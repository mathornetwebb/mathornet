const fs = require('fs');

const products = [
    { file: 'public/sandwich-kubbe.html', name: 'Sandwich Kubbe', img: 'img/sandwich kubbe.png' },
    { file: 'public/kubbe-halab.html', name: 'Kubbe Halab', img: 'img/kubbe halab.png' },
    { file: 'public/kubbe-mosel.html', name: 'Kubbe Mosel', img: 'img/kubbe mosel.png' },
    { file: 'public/kubbe-trabolsie.html', name: 'Kubbe Trabolsie', img: 'img/kubbe trabolsie.png' },
    { file: 'public/potatis-kubbe.html', name: 'Potatis Kubbe', img: 'img/potatis kubbe.png' },
    { file: 'public/ris-kubbe.html', name: 'Ris Kubbe', img: 'img/ris kubbe.png' },
];

for (const p of products) {
    if (!fs.existsSync(p.file)) { console.log(`Skipping ${p.file}`); continue; }
    let content = fs.readFileSync(p.file, 'utf8');
    const original = content;

    // Current structure (after my broken changes):
    // <section class="product-detail-layout container">
    //     <div class="product-detail-breadcrumbs breadcrumbs" ...>...</div>
    //     <h1 class="product-detail-title">Name</h1>
    //     <div class="product-detail-img">
    //         <img ...>
    //     </div>
    //     <div class="product-detail-info">
    //         (empty lines where breadcrumbs/h1 used to be)
    //         <div class="pack-type-selector">

    // Step 1: Remove the standalone breadcrumbs div
    content = content.replace(
        /\s*<div class="product-detail-breadcrumbs breadcrumbs"[^>]*>\s*<a href="mathornet\.html"[^>]*>Hemsida<\/a>[^<]*<a href="produkter\.html"[^>]*>Produkter<\/a>[^<]*\s*<\/div>\s*/,
        '\n'
    );

    // Step 2: Remove the standalone h1
    content = content.replace(
        /\s*<h1 class="product-detail-title">[^<]+<\/h1>\s*/,
        '\n'
    );

    // Step 3: Add mobile-only breadcrumbs+h1 BEFORE the image, and restore originals inside .product-detail-info
    const imgDivPattern = `<div class="product-detail-img">
                <img src="${p.img}" alt="${p.name}">
            </div>
            
            <div class="product-detail-info">`;

    const replacement = `<!-- Mobile-only: breadcrumbs + title shown above image -->
            <div class="mobile-product-header">
                <div class="breadcrumbs" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <a href="mathornet.html" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter.html" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.name}
                </div>
                <h1 style="font-size: 1.8rem; font-weight: 800; color: #111; margin-bottom: 1rem; line-height: 1.2;">${p.name}</h1>
            </div>

            <div class="product-detail-img">
                <img src="${p.img}" alt="${p.name}">
            </div>
            
            <div class="product-detail-info">
                <div class="breadcrumbs desktop-only" style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #666;">
                    <a href="mathornet.html" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter.html" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.name}
                </div>
                
                <h1 class="desktop-only">${p.name}</h1>`;

    if (content.includes(imgDivPattern)) {
        content = content.replace(imgDivPattern, replacement);
        fs.writeFileSync(p.file, content, 'utf8');
        console.log(`Fixed ${p.file}`);
    } else {
        console.log(`Pattern not found in ${p.file}`);
        // Debug: show what's around product-detail-img
        const idx = content.indexOf('product-detail-img');
        if (idx > -1) {
            console.log('Context:', content.substring(idx - 50, idx + 200));
        }
    }
}
