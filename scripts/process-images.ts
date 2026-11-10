import sharp from 'sharp';
import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function processAll() {
  const dir = path.join(process.cwd(), 'public', 'img', 'transparent_products');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const products = await prisma.product.findMany();

  for (const p of products) {
    console.log('Fetching', p.title, p.featuredImage);
    const res = await fetch(p.featuredImage);
    const buf = Buffer.from(await res.arrayBuffer());
    
    const image = sharp(buf);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    const rgba = Buffer.alloc(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      rgba[i * 4] = data[i * channels];
      rgba[i * 4 + 1] = data[i * channels + 1];
      rgba[i * 4 + 2] = data[i * channels + 2];
      rgba[i * 4 + 3] = 255;
    }

    // Sample corner colors
    const corners = [
      [rgba[0], rgba[1], rgba[2]],
      [rgba[(width - 1) * 4], rgba[(width - 1) * 4 + 1], rgba[(width - 1) * 4 + 2]],
      [rgba[((height - 1) * width) * 4], rgba[((height - 1) * width) * 4 + 1], rgba[((height - 1) * width) * 4 + 2]],
      [rgba[((height - 1) * width + width - 1) * 4], rgba[((height - 1) * width + width - 1) * 4 + 1], rgba[((height - 1) * width + width - 1) * 4 + 2]],
    ];
    const avgCornerR = corners.reduce((acc, c) => acc + c[0], 0) / 4;
    const avgCornerG = corners.reduce((acc, c) => acc + c[1], 0) / 4;
    const avgCornerB = corners.reduce((acc, c) => acc + c[2], 0) / 4;

    console.log(` -> Avg corner for ${p.slug}: [${Math.round(avgCornerR)}, ${Math.round(avgCornerG)}, ${Math.round(avgCornerB)}]`);

    const isBg = (r: number, g: number, b: number) => {
      // Must be bright (light studio backdrop or white)
      if (r < 210 || g < 210 || b < 210) return false;
      // Must be close to the corner background color
      const dist = Math.sqrt(
        Math.pow(r - avgCornerR, 2) +
        Math.pow(g - avgCornerG, 2) +
        Math.pow(b - avgCornerB, 2)
      );
      // Low saturation (neutral white/grey)
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
      return dist <= 24 && maxDiff <= 12;
    };

    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let qStart = 0, qEnd = 0;

    for (let x = 0; x < width; x++) {
      const idxT = x;
      if (isBg(rgba[idxT*4], rgba[idxT*4+1], rgba[idxT*4+2])) {
        visited[idxT] = 1;
        queue[qEnd++] = idxT;
      }
      const idxB = (height - 1) * width + x;
      if (isBg(rgba[idxB*4], rgba[idxB*4+1], rgba[idxB*4+2])) {
        visited[idxB] = 1;
        queue[qEnd++] = idxB;
      }
    }

    for (let y = 0; y < height; y++) {
      const idxL = y * width;
      if (isBg(rgba[idxL*4], rgba[idxL*4+1], rgba[idxL*4+2]) && !visited[idxL]) {
        visited[idxL] = 1;
        queue[qEnd++] = idxL;
      }
      const idxR = y * width + (width - 1);
      if (isBg(rgba[idxR*4], rgba[idxR*4+1], rgba[idxR*4+2]) && !visited[idxR]) {
        visited[idxR] = 1;
        queue[qEnd++] = idxR;
      }
    }

    while (qStart < qEnd) {
      const curr = queue[qStart++];
      const cx = curr % width;
      const cy = Math.floor(curr / width);

      rgba[curr * 4 + 3] = 0;

      const neighbors = [
        cx > 0 ? curr - 1 : -1,
        cx < width - 1 ? curr + 1 : -1,
        cy > 0 ? curr - width : -1,
        cy < height - 1 ? curr + width : -1
      ];

      for (const n of neighbors) {
        if (n !== -1 && !visited[n]) {
          visited[n] = 1;
          const nr = rgba[n * 4], ng = rgba[n * 4 + 1], nb = rgba[n * 4 + 2];
          if (isBg(nr, ng, nb)) {
            queue[qEnd++] = n;
          }
        }
      }
    }

    const pct = ((qEnd / (width * height)) * 100).toFixed(1);
    console.log(` -> ${p.slug}: ${pct}% made transparent`);

    const outFilename = `${p.slug}.png`;
    const outPath = path.join(dir, outFilename);
    
    // Trim transparent whitespace and set fixed dimensions (max 600x600 fit inside)
    await sharp(rgba, { raw: { width, height, channels: 4 } })
      .trim()
      .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 8 })
      .toFile(outPath);

    console.log(`Saved ${outPath}`);
  }
  process.exit(0);
}

processAll().catch(e => { console.error(e); process.exit(1); });
