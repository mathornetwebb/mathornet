import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImage(inputBuffer: Buffer): Promise<{ buffer: Buffer; isPng: boolean }> {
  try {
    // Auto-orient according to EXIF and pre-scale if very large to prevent memory/timeout issues
    let img = sharp(inputBuffer).rotate();
    const meta = await img.metadata();
    
    if ((meta.width && meta.width > 1200) || (meta.height && meta.height > 1200)) {
      img = img.resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true });
    }

    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;

    // Sample corner colors
    const corners = [
      [data[0], data[1], data[2], data[3]],
      [data[(width - 1) * 4], data[(width - 1) * 4 + 1], data[(width - 1) * 4 + 2], data[(width - 1) * 4 + 3]],
      [data[((height - 1) * width) * 4], data[((height - 1) * width) * 4 + 1], data[((height - 1) * width) * 4 + 2], data[((height - 1) * width) * 4 + 3]],
      [data[((height - 1) * width + width - 1) * 4], data[((height - 1) * width + width - 1) * 4 + 1], data[((height - 1) * width + width - 1) * 4 + 2], data[((height - 1) * width + width - 1) * 4 + 3]],
    ];

    const alreadyTransparent = corners.some(c => c[3] < 200);
    const avgCornerR = corners.reduce((acc, c) => acc + c[0], 0) / 4;
    const avgCornerG = corners.reduce((acc, c) => acc + c[1], 0) / 4;
    const avgCornerB = corners.reduce((acc, c) => acc + c[2], 0) / 4;

    const isLightCorner = avgCornerR >= 210 && avgCornerG >= 210 && avgCornerB >= 210;

    let processedData = data;

    if (!alreadyTransparent && isLightCorner) {
      const isBg = (r: number, g: number, b: number) => {
        if (r < 205 || g < 205 || b < 205) return false;
        const dist = Math.sqrt(
          Math.pow(r - avgCornerR, 2) +
          Math.pow(g - avgCornerG, 2) +
          Math.pow(b - avgCornerB, 2)
        );
        const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
        return dist <= 26 && maxDiff <= 14;
      };

      const visited = new Uint8Array(width * height);
      const queue = new Int32Array(width * height);
      let qStart = 0, qEnd = 0;

      for (let x = 0; x < width; x++) {
        if (isBg(data[x * 4], data[x * 4 + 1], data[x * 4 + 2])) {
          visited[x] = 1;
          queue[qEnd++] = x;
        }
        const btmIdx = (height - 1) * width + x;
        if (isBg(data[btmIdx * 4], data[btmIdx * 4 + 1], data[btmIdx * 4 + 2])) {
          visited[btmIdx] = 1;
          queue[qEnd++] = btmIdx;
        }
      }

      for (let y = 0; y < height; y++) {
        const lIdx = y * width;
        if (isBg(data[lIdx * 4], data[lIdx * 4 + 1], data[lIdx * 4 + 2]) && !visited[lIdx]) {
          visited[lIdx] = 1;
          queue[qEnd++] = lIdx;
        }
        const rIdx = y * width + width - 1;
        if (isBg(data[rIdx * 4], data[rIdx * 4 + 1], data[rIdx * 4 + 2]) && !visited[rIdx]) {
          visited[rIdx] = 1;
          queue[qEnd++] = rIdx;
        }
      }

      while (qStart < qEnd) {
        const curr = queue[qStart++];
        const cx = curr % width;
        const cy = Math.floor(curr / width);

        data[curr * 4 + 3] = 0;

        const neighbors = [
          cx > 0 ? curr - 1 : -1,
          cx < width - 1 ? curr + 1 : -1,
          cy > 0 ? curr - width : -1,
          cy < height - 1 ? curr + width : -1
        ];

        for (const n of neighbors) {
          if (n !== -1 && !visited[n]) {
            visited[n] = 1;
            const nr = data[n * 4], ng = data[n * 4 + 1], nb = data[n * 4 + 2];
            if (isBg(nr, ng, nb)) {
              queue[qEnd++] = n;
            }
          }
        }
      }
      processedData = data;
    }

    // Trim transparent margins and enforce fixed maximum dimensions (600x600 fit inside)
    let outBuffer: Buffer;
    try {
      outBuffer = await sharp(processedData, { raw: { width, height, channels: 4 } })
        .trim()
        .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
    } catch {
      outBuffer = await sharp(processedData, { raw: { width, height, channels: 4 } })
        .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
    }

    return { buffer: outBuffer, isPng: true };
  } catch (err) {
    console.error('Image processing error:', err);
    return { buffer: inputBuffer, isPng: false };
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Obehörig (Unauthorized)' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Inget fil hittades' }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|heic|heif|avif|gif)$/i.test(file.name);
    if (!isImage) {
      return NextResponse.json({ error: 'Ogiltigt filformat. Endast bilder tillåts.' }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    
    // Process image for transparency and fixed size constraints
    const { buffer: processedBuffer, isPng } = await processImage(rawBuffer);

    const safeBaseName = path.parse(file.name).name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = isPng ? '.png' : path.extname(file.name) || '.png';
    const uniqueName = `upload_${Date.now()}_${safeBaseName}${ext}`;
    
    let returnUrl: string | null = null;

    // 1. Upload to Supabase Storage (primary cloud storage for persistence)
    try {
      const { data, error } = await supabaseAdmin
        .storage
        .from('images')
        .upload(uniqueName, processedBuffer, {
          contentType: isPng ? 'image/png' : (file.type || 'image/png'),
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin
          .storage
          .from('images')
          .getPublicUrl(uniqueName);
        if (publicUrlData?.publicUrl) {
          returnUrl = publicUrlData.publicUrl;
        }
      } else if (error) {
        console.error('Supabase upload error:', error);
      }
    } catch (supabaseErr) {
      console.error('Supabase storage exception:', supabaseErr);
    }

    // 2. Also save to public/uploads locally if writable (safe fallback for local development)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, uniqueName), processedBuffer);
      if (!returnUrl) {
        returnUrl = `uploads/${uniqueName}`;
      }
    } catch (fsErr) {
      console.log('Local disk write skipped (normal on read-only serverless environments like Vercel)');
    }

    if (!returnUrl) {
      return NextResponse.json({ error: 'Kunde inte spara bilden till lagringen. Kontrollera behörigheter.' }, { status: 500 });
    }

    return NextResponse.json({ url: returnUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Kunde inte ladda upp filen' }, { status: 500 });
  }
}
