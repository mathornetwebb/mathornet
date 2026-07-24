import './setup-env';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

async function main() {
  console.log('Starting static build script...');
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    // Fetch data from DB
    const products = await prisma.product.findMany();
    const news = await prisma.news.findMany();
    
    // Safety check - if db is totally empty, don't wipe out the site
    if (products.length === 0 && news.length === 0) {
      console.log('Database empty, skipping build to protect files.');
      process.exit(0);
    }
    // --- REBUILD PRODUKTER.HTML ---
    const produkterPath = path.join(publicDir, 'produkter.html');
    let produkterHtml = fs.readFileSync(produkterPath, 'utf8');
    
    // We want to replace everything inside <div class="products-grid-large">...</div>
    // Let's find the start and end of that div contents
    const gridStartStr = '<div class="products-grid-large">';
    const gridStartIdx = produkterHtml.indexOf(gridStartStr);
    if (gridStartIdx !== -1) {
      // Find the closing div for products-grid-large
      // Instead of perfect HTML parsing, we can just find the start of the next section
      const sectionEndIdx = produkterHtml.indexOf('</section>', gridStartIdx);
      // Actually, we'll just isolate the grid div
      const afterGridStart = produkterHtml.substring(gridStartIdx + gridStartStr.length);
      const gridEndIdx = gridStartIdx + gridStartStr.length + afterGridStart.indexOf('</div>\n            </div>\n        </section>');
      
      let newProductsList = '';
      for (const p of products) {
        // Try to parse product info to get weight
        let weight = '-';
        let isNyhet = false; // We can add a featured/nyhet toggle later if needed
        try {
          const info = JSON.parse(p.productInfo || '{}');
          if (info.packaging?.bag?.weight) weight = info.packaging.bag.weight;
          else if (info.packaging?.box?.weight) weight = info.packaging.box.weight;
        } catch(e) {}
        
        let badgeHtml = isNyhet ? '<span class="product-badge">Nyhet</span>' : '';
        
        newProductsList += `
                    <!-- Dynamisk Produkt: ${p.title} -->
                    <a href="${p.slug}.html" class="product-card">
                        ${badgeHtml}
                        <div class="product-img-wrapper">
                            <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}">
                        </div>
                        <div class="product-info">
                            <h3>${p.title}</h3>
                            <div class="product-meta">
                                <span class="weight">${weight}</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>\n`;
      }
      
      const beforeGrid = produkterHtml.substring(0, gridStartIdx + gridStartStr.length);
      const afterGrid = produkterHtml.substring(gridEndIdx);
      
      produkterHtml = beforeGrid + '\n' + newProductsList + afterGrid;
      fs.writeFileSync(produkterPath, produkterHtml);
    }

    // --- REBUILD MATHORNET.HTML (START PAGE SLIDER) ---
    const mathornetPath = path.join(publicDir, 'mathornet.html');
    if (fs.existsSync(mathornetPath)) {
      let mathornetHtml = fs.readFileSync(mathornetPath, 'utf8');
      
      const tezaStartStr = '<div class="swiper teza-swiper"';
      const tezaStartIdx = mathornetHtml.indexOf(tezaStartStr);
      if (tezaStartIdx !== -1) {
        const wrapperStartStr = '<div class="swiper-wrapper">';
        const wrapperStartIdx = mathornetHtml.indexOf(wrapperStartStr, tezaStartIdx);
        
        if (wrapperStartIdx !== -1) {
          const controlsStr = '<!-- Custom Navigation -->';
          const controlsIdx = mathornetHtml.indexOf(controlsStr, wrapperStartIdx);
          
          if (controlsIdx !== -1) {
            // Find the last </div> before controlsIdx
            const wrapperEndIdx = mathornetHtml.lastIndexOf('</div>', controlsIdx);
            
            if (wrapperEndIdx !== -1) {
              let newSliderList = '';
              for (const p of products) {
                newSliderList += `
                    <!-- Dynamisk Produkt: ${p.title} -->
                    <div class="swiper-slide teza-slide">
                        <a href="${p.slug}.html" class="teza-product-link">
                            <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}" class="teza-product-img">
                            <div class="teza-product-info">
                                <h3>${p.title}</h3>
                            </div>
                        </a>
                    </div>\n`;
              }
              
              const beforeSlider = mathornetHtml.substring(0, wrapperStartIdx + wrapperStartStr.length);
              const afterSlider = mathornetHtml.substring(wrapperEndIdx);
              
              mathornetHtml = beforeSlider + '\n' + newSliderList + '                ' + afterSlider;
              fs.writeFileSync(mathornetPath, mathornetHtml);
            }
          }
        }
      }
    }

    // --- REBUILD NYHETER.HTML ---
    const nyheterPath = path.join(publicDir, 'nyheter.html');
    let nyheterHtml = fs.readFileSync(nyheterPath, 'utf8');
    
    if (news.length > 0) {
      const featuredNews = news[0];
      const featuredRegex = /<a [^>]*class="featured-post"[^>]*>[\s\S]*?<\/a>/i;
      
      const dObj = featuredNews.createdAt || new Date();
      const mNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
      const dStr = `${dObj.getDate().toString().padStart(2, '0')} ${mNames[dObj.getMonth()]} ${dObj.getFullYear()}`;
      
      const featuredHtml = `
            <a href="${featuredNews.slug}.html" class="featured-post">
                <img src="${featuredNews.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" class="featured-bg" alt="${featuredNews.title}">
                <div class="featured-overlay"></div>
                <div class="featured-content">
                    <div class="featured-meta">
                        <span class="category" style="background: var(--navy-bg); color: #fff; padding: 6px 16px; border-radius: 50px; font-size: 0.95rem;">Nyhet</span>
                        <span style="color: #fff; font-weight: 500;">${dStr}</span>
                    </div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); line-height: 1.2;">${featuredNews.title}</h2>
                    <p style="font-size: 1.15rem; margin-bottom: 1rem; opacity: 0.95; text-shadow: 0 1px 5px rgba(0,0,0,0.5); max-width: 600px;">${featuredNews.excerpt || ''}</p>
                    <span class="btn" style="background: #64b000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; width: fit-content; margin-top: 1.5rem;">Läs inlägg</span>
                </div>
            </a>`;
      nyheterHtml = nyheterHtml.replace(featuredRegex, featuredHtml);
    }
    
    const newsGridStartStr = '<div class="news-grid-layout">';
    const newsGridStartIdx = nyheterHtml.indexOf(newsGridStartStr);
    if (newsGridStartIdx !== -1) {
      const afterNewsGridStart = nyheterHtml.substring(newsGridStartIdx + newsGridStartStr.length);
      const newsGridEndIdx = newsGridStartIdx + newsGridStartStr.length + afterNewsGridStart.indexOf('</div>\n        </div>\n    </main>');
      
      let newNewsList = '';
      for (const n of news) {
        // Format date: "24 sep 2026"
        const dateObj = n.createdAt || new Date();
        const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        
        newNewsList += `
                    <!-- Dynamisk Nyhet: ${n.title} -->
                    <a href="${n.slug}.html" class="news-card-v2" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                        <div class="news-img" style="height: 250px; overflow: hidden;">
                            <img src="${n.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${n.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                            <div class="news-meta" style="font-size: 0.85rem; color: #666; margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
                                <span class="date">${dateStr}</span>
                                <span class="divider">|</span>
                                <span class="category" style="color: #666; font-weight: 600;">Nyhet</span>
                            </div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${n.title}</h3>
                            <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${n.excerpt || ''}</p>
                            <span class="btn" style="background: #64b000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; width: 100%; text-align: center; font-weight: bold; margin-top: auto;">Läs inlägg</span>
                        </div>
                    </a>\n`;
      }
      
      const beforeNewsGrid = nyheterHtml.substring(0, newsGridStartIdx + newsGridStartStr.length);
      const afterNewsGrid = nyheterHtml.substring(newsGridEndIdx);
      
      nyheterHtml = beforeNewsGrid + '\n' + newNewsList + afterNewsGrid;
      fs.writeFileSync(nyheterPath, nyheterHtml);
    }
    
    // --- BUILD INDIVIDUAL PRODUCT PAGES ---
    // We will use kubbe-mosel.html as a template
    const templatePath = path.join(publicDir, 'kubbe-mosel.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Extract everything from <header> to </header> and <footer>
    // Since we just want to replace the main content, we can use regex
    const headerRegex = /(<header class="main-header">[\s\S]*?<\/header>)/i;
    const footerRegex = /(<footer [\s\S]*?<\/footer>)/i;
    
    const headerMatch = templateHtml.match(headerRegex);
    const headerStr = headerMatch ? headerMatch[1] : '';
    
    // Also fetch index.html or mathornet.html to reliably get footer if it's missing in some files
    let footerStr = '';
    try {
        const mathornetHtml = fs.readFileSync(path.join(publicDir, 'mathornet.html'), 'utf8');
        const fMatch = mathornetHtml.match(footerRegex);
        if (fMatch) footerStr = fMatch[1];
    } catch(e) {}
    
    for (const p of products) {
        let pInfo = { manufacturingCountry: '', manufacturer: '', specialDiets: '', leadTime: '', properties: [], packaging: { bag: { count: '', weight: '' }, box: { count: '', weight: '' }, pallet: { count: '', weight: '' } } };
        let nInfo = { energy: '', fat: '', saturatedFat: '', carbs: '', sugar: '', protein: '', salt: '' };
        let iInfo = { dough: '', filling: '', allergens: '' };
        let cInfo = { general: '', oven: '', airfryer: '', pan: '' };
        
        try { pInfo = JSON.parse(p.productInfo || '{}'); } catch(e) {}
        try { nInfo = JSON.parse(p.nutritionInfo || '{}'); } catch(e) {}
        try { iInfo = JSON.parse(p.ingredients || '{}'); } catch(e) {}
        try { cInfo = JSON.parse(p.cookingInstructions || '{}'); } catch(e) {}

        const productHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} | Mathörnet</title>
    <meta name="description" content="Köp ${p.title} från Mathörnet.">
    <link rel="stylesheet" href="style_v5.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${headerStr}

    <main>
        <section class="product-detail-layout container" style="margin-top: 4rem; padding-bottom: 4rem;">
            <div class="mobile-product-header">
                <div class="breadcrumbs" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <a href="mathornet.html" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter.html" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.title}
                </div>
                <h1 style="font-size: 1.8rem; font-weight: 800; color: #111; margin-bottom: 1rem; line-height: 1.2;">${p.title}</h1>
            </div>

            <div class="product-detail-img">
                <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}">
            </div>
            
            <div class="product-detail-info">
                <div class="breadcrumbs desktop-only" style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #666;">
                    <a href="mathornet.html" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter.html" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.title}
                </div>
                
                <h1 class="desktop-only">${p.title}</h1>

                <div class="pack-type-selector">
                    <span>Typ</span>
                    <button class="pack-btn active" data-type="bag" 
                            data-artnr="${p.artNr || ''}" 
                            data-antal-label="Antal/påse:" data-antal-value="${pInfo.packaging?.bag?.count || ''}" 
                            data-vikt-label="Vikt/påse:" data-vikt-value="${pInfo.packaging?.bag?.weight || ''}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><rect x="9" y="11" width="6" height="4" rx="1"></rect></svg>
                        <span class="pack-label">Påse</span>
                    </button>
                    <button class="pack-btn" data-type="box" 
                            data-artnr="${p.artNr || ''}" 
                            data-antal-label="Antal påsar/låda:" data-antal-value="${pInfo.packaging?.box?.count || ''}" 
                            data-vikt-label="Nettovikt/låda:" data-vikt-value="${pInfo.packaging?.box?.weight || ''}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span class="pack-label">Kartong</span>
                    </button>
                    <button class="pack-btn" data-type="pallet" 
                            data-artnr="${p.artNr || ''}" 
                            data-antal-label="Antal lådor/pall:" data-antal-value="${pInfo.packaging?.pallet?.count || ''}" 
                            data-vikt-label="Nettovikt/pall:" data-vikt-value="${pInfo.packaging?.pallet?.weight || ''}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="21" x2="22" y2="21"></line><line x1="4" y1="21" x2="4" y2="18"></line><line x1="12" y1="21" x2="12" y2="18"></line><line x1="20" y1="21" x2="20" y2="18"></line><line x1="2" y1="18" x2="22" y2="18"></line><rect x="4" y="12" width="7" height="6"></rect><rect x="13" y="12" width="7" height="6"></rect><rect x="8" y="6" width="8" height="6"></rect></svg>
                        <span class="pack-label">Pall</span>
                    </button>
                </div>

                <table class="product-data-table">
                    <tbody>
                        <tr><td>Art. nr:</td><td id="td-artnr">${p.artNr || ''}</td></tr>
                        <tr><td>Benämning:</td><td>${p.title}</td></tr>
                        <tr><td>EAN:</td><td>${p.ean || ''}</td></tr>
                        <tr><td id="td-antal-label">Antal/påse:</td><td id="td-antal-value">${pInfo.packaging?.bag?.count || ''}</td></tr>
                        <tr><td id="td-vikt-label">Vikt/påse:</td><td id="td-vikt-value">${pInfo.packaging?.bag?.weight || ''}</td></tr>
                    </tbody>
                </table>

                <div class="product-accordions">
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Beskrivning
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                ${p.description || ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Produktinformation
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                <p><strong>Tillverkningsland:</strong> ${pInfo.manufacturingCountry || ''}</p>
                                <p><strong>Tillagas av:</strong> ${pInfo.manufacturer || ''}</p>
                                <br>
                                ${(pInfo.properties || []).map((prop: string) => '<p>'+prop+'</p>').join('')}
                                <br>
                                <p><strong>Specialanpassningar:</strong> ${pInfo.specialDiets || ''}</p>
                                <p><strong>Ledtid:</strong> ${pInfo.leadTime || ''}</p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <button class="accordion-header">
                            Näringsvärde
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                <table class="nutrition-table">
                                    <tbody>
                                        <tr><td>Energi, 100g</td><td>${nInfo.energy || ''}</td></tr>
                                        <tr><td>Fett</td><td>${nInfo.fat || ''}</td></tr>
                                        <tr><td>Varav mättat</td><td>${nInfo.saturatedFat || ''}</td></tr>
                                        <tr><td>Kolhydrat</td><td>${nInfo.carbs || ''}</td></tr>
                                        <tr><td>Varav socker</td><td>${nInfo.sugar || ''}</td></tr>
                                        <tr><td>Protein</td><td>${nInfo.protein || ''}</td></tr>
                                        <tr><td>Salt</td><td>${nInfo.salt || ''}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <button class="accordion-header">
                            Innehållsförteckning
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                <p><strong>Deg:</strong> ${iInfo.dough || ''}</p>
                                <p><strong>Fyllning:</strong> ${iInfo.filling || ''}</p>
                                <p><strong>Allergener:</strong> ${iInfo.allergens || ''}</p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <button class="accordion-header">
                            Förvaring
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                <p>${p.storage || ''}</p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <button class="accordion-header">
                            Tillagningsanvisningar
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                <p style="margin-bottom: 1.5rem;">${cInfo.general || ''}</p>
                                <p style="margin-bottom: 1rem;"><strong>Varmluftsugn</strong><br>${cInfo.oven || ''}</p>
                                <p style="margin-bottom: 1rem;"><strong>Airfryer</strong><br>${cInfo.airfryer || ''}</p>
                                <p><strong>Stekpanna</strong><br>${cInfo.pan || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Fler produkter Karusell -->
        <section class="products-section carousel-section" style="background-color: #fcfcfc; padding: 5rem 0;">
            <div class="container">
                <div class="section-header" style="text-align: center; margin-bottom: 3rem; display: block;">
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #111;">Fler produkter</h2>
                </div>
                
                <div class="carousel-wrapper">
                    <div class="carousel-viewport">
                        <div class="carousel-track">
${(() => {
    const otherProducts = products.filter(op => op.id !== p.id).slice(0, 8);
    return otherProducts.map(op => {
        let pWeight = '500 gram';
        try {
            const info = JSON.parse(op.productInfo || '{}');
            if (info.packaging?.bag?.weight) pWeight = info.packaging.bag.weight;
        } catch(e) {}
        
        return `
                            <a href="${op.slug}.html" class="product-card carousel-card" style="text-decoration: none;">
                                <div class="product-img-wrapper">
                                    <img src="${op.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${op.title}">
                                </div>
                                <div class="product-info" style="text-align: center;">
                                    <h3>${op.title}</h3>
                                    <div class="product-meta" style="justify-content: center;">
                                        <span class="weight">${pWeight}</span>
                                    </div>
                                </div>
                            </a>`;
    }).join('');
})()}
                        </div>
                    </div>
                    
                    <div class="carousel-controls" style="margin-top: 2.5rem;">
                        <button class="carousel-btn prev-btn" aria-label="Föregående">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="carousel-dots"></div>
                        <button class="carousel-btn next-btn" aria-label="Nästa">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 3rem;">
                    <a href="produkter.html" class="btn btn-primary" style="background: #64b000; color: white; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Se alla produkter &rarr;</a>
                </div>
            </div>
        </section>
    </main>

    ${footerStr}
    <script src="main_v5.js"></script>
    <script>
      // Pack button logic
      document.querySelectorAll('.pack-btn').forEach(btn => {
          btn.addEventListener('click', function() {
              document.querySelectorAll('.pack-btn').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
              document.getElementById('td-artnr').innerText = this.dataset.artnr || '';
              document.getElementById('td-antal-label').innerText = this.dataset.antalLabel || '';
              document.getElementById('td-antal-value').innerText = this.dataset.antalValue || '';
              document.getElementById('td-vikt-label').innerText = this.dataset.viktLabel || '';
              document.getElementById('td-vikt-value').innerText = this.dataset.viktValue || '';
          });
      });
      // Accordion logic
      document.querySelectorAll('.accordion-header').forEach(header => {
          header.addEventListener('click', () => {
              header.classList.toggle('active');
              const content = header.nextElementSibling;
              if (header.classList.contains('active')) {
                  content.style.maxHeight = content.scrollHeight + "px";
              } else {
                  content.style.maxHeight = null;
              }
          });
      });
    </script>
</body>
</html>`;
        fs.writeFileSync(path.join(publicDir, `${p.slug}.html`), productHtml);
    }

    // --- BUILD INDIVIDUAL NEWS PAGES ---
    for (const n of news) {
        const dateObj = n.createdAt || new Date();
        const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        
        let blocksHtml = '';
        try {
            const blocks = JSON.parse(n.content || '[]');
            blocksHtml = blocks.map((b: any) => {
                if (b.type === 'h2') return `<h2 style="font-size: 2rem; font-weight: 800; color: #111; margin-top: 3rem; margin-bottom: 1rem;">${b.content}</h2>`;
                if (b.type === 'h3') return `<h3 style="font-size: 1.5rem; font-weight: 700; color: #111; margin-top: 2rem; margin-bottom: 1rem;">${b.content}</h3>`;
                if (b.type === 'text') return `<div style="font-size: 1.15rem; color: #444; line-height: 1.8; margin-bottom: 1.5rem;">${b.content}</div>`;
                if (b.type === 'image') return `<figure style="margin: 3rem 0;"><img src="${b.content}" alt="" style="width: 100%; border-radius: 12px;"><figcaption style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; text-align: center;">${b.caption || ''}</figcaption></figure>`;
                return '';
            }).join('\n');
        } catch(e) {}

        const newsHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${n.title} | Mathörnet</title>
    <meta name="description" content="${n.metaDescription || ''}">
    <link rel="stylesheet" href="style_v5.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${headerStr}

    <main style="background-color: #fcfcfc; padding-bottom: 6rem;">
        <!-- NEW FULL-WIDTH HERO SECTION -->
        <header style="position: relative; width: 100%; min-height: 55vh; display: flex; align-items: center; justify-content: center; background: url('${n.featuredImage || ''}') center/cover no-repeat; padding: 6rem 2rem; margin-bottom: 4rem;">
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.5);"></div>
            <div style="position: relative; text-align: center; color: #fff; z-index: 1; max-width: 900px; width: 100%; margin-top: 4rem;">
                <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3); font-family: 'Outfit', sans-serif;">${n.title}</h1>
                <div class="news-meta" style="font-size: 1.1rem; font-weight: 500; display: flex; gap: 0.8rem; align-items: center; justify-content: center; text-shadow: 0 1px 5px rgba(0,0,0,0.5);">
                    <span class="category">Nyhet</span>
                    <span class="divider" style="color: rgba(255,255,255,0.7);">|</span>
                    <span class="date">${dateStr}</span>
                </div>
            </div>
        </header>

        <div class="container" style="max-width: 850px; margin: 0 auto; padding: 0 1.5rem;">
            <div class="breadcrumbs" style="font-size: 0.9rem; color: #888; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <a href="mathornet.html" style="color: #666; text-decoration: none; font-weight: 500;">Hemsida</a> <span style="color: #ccc;">/</span> 
                <a href="nyheter.html" style="color: #666; text-decoration: none; font-weight: 500;">Nyheter</a> <span style="color: #ccc;">/</span> 
                <span style="color: #111; font-weight: 600;">${n.title}</span>
            </div>

            <article style="background: #fff; padding: clamp(2rem, 5vw, 4rem); border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                ${n.excerpt ? `<p style="font-size: 1.35rem; color: #444; line-height: 1.7; font-weight: 500; margin-bottom: 3rem; font-family: 'Outfit', sans-serif;">${n.excerpt}</p>` : ''}
                
                <div class="article-content" style="font-size: 1.15rem; color: #333; line-height: 1.8;">
                    ${blocksHtml}
                </div>
        </article>
    </main>

    ${footerStr}
    <script src="main_v5.js"></script>
</body>
</html>`;
        fs.writeFileSync(path.join(publicDir, `${n.slug}.html`), newsHtml);
    }

    // --- REBUILD RECEPT.HTML ---
    const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
    if (recipes.length > 0) {
      const receptPath = path.join(publicDir, 'recept.html');
      let receptHtml = fs.readFileSync(receptPath, 'utf8');
      
      const featuredRecipe = recipes[0];
      const otherRecipes = recipes;
      
      // Replace featured post
      const featuredStartStr = '<a href="recept-libanesisk-toum.html" class="featured-post">';
      // We will just find the first <a ... class="featured-post"> and replace until </a>
      const fStartIdx = receptHtml.indexOf('<a ');
      // We need to be careful, let's use a regex to replace the featured-post block
      // But actually, we can find '<a ' and 'class="featured-post"'
      const featuredRegex = /<a [^>]*class="featured-post"[^>]*>[\s\S]*?<\/a>/i;
      
      const featuredHtml = `
            <a href="${featuredRecipe.slug}.html" class="featured-post">
                <img src="${featuredRecipe.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" class="featured-bg" alt="${featuredRecipe.title}">
                <div class="featured-overlay"></div>
                <div class="featured-content">
                    <div class="featured-meta">
                        <span class="category" style="background: var(--navy-bg); color: #fff; padding: 6px 16px; border-radius: 50px; font-size: 0.95rem;">Veckans utvalda</span>
                        <span>⏱️ ${featuredRecipe.prepTime || ''}</span>
                    </div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); line-height: 1.2;">${featuredRecipe.title}</h2>
                    <p style="font-size: 1.15rem; margin-bottom: 1rem; opacity: 0.95; text-shadow: 0 1px 5px rgba(0,0,0,0.5); max-width: 600px;">${featuredRecipe.description || ''}</p>
                    <span class="btn" style="background: #64b000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; width: fit-content; margin-top: 1.5rem;">Till receptet</span>
                </div>
            </a>`;
      
      receptHtml = receptHtml.replace(featuredRegex, featuredHtml);
      
      // Replace grid layout for other recipes
      const gridStartStr = '<div class="news-grid-layout">';
      const gridStartIdx = receptHtml.indexOf(gridStartStr);
      if (gridStartIdx !== -1) {
        const afterGridStart = receptHtml.substring(gridStartIdx + gridStartStr.length);
        const gridEndIdx = gridStartIdx + gridStartStr.length + afterGridStart.indexOf('</div>\n        </div>\n    </main>');
        
        let newRecipesList = '';
        for (const r of otherRecipes) {
          newRecipesList += `
            <a href="${r.slug}.html" class="news-card-v2" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div class="news-img" style="height: 250px; overflow: hidden; position: relative;">
                    <img src="${r.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${r.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 10px; right: 10px; background: var(--navy-bg); color: white; padding: 4px 10px; border-radius: 5px; font-weight: 600; font-size: 0.85rem;">⏱️ ${r.prepTime || ''}</span>
                </div>
                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${r.title}</h3>
                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${r.description || ''}</p>
                    <span class="btn" style="background: #64b000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; width: 100%; text-align: center; font-weight: bold; margin-top: auto;">Till receptet</span>
                </div>
            </a>\n`;
        }
        
        const beforeGrid = receptHtml.substring(0, gridStartIdx + gridStartStr.length);
        const afterGrid = receptHtml.substring(gridEndIdx);
        receptHtml = beforeGrid + '\n' + newRecipesList + afterGrid;
      }
      fs.writeFileSync(receptPath, receptHtml);
    }
    
    // --- BUILD INDIVIDUAL RECIPE PAGES ---
    for (const r of recipes) {
        let ingBlocksHtml = '';
        let instBlocksHtml = '';
        try {
            const iBlocks = JSON.parse(r.ingredients || '[]');
            ingBlocksHtml = iBlocks.map((b: any) => {
                if (b.type === 'text' && b.content.trim() !== '') {
                    return `                    <li><label class="ingredient-checkbox"><input type="checkbox"><span class="checkmark"></span><span class="ingredient-text">${b.content}</span></label></li>`;
                }
                return '';
            }).join('\n');
        } catch(e) {}
        
        try {
            const iBlocks = JSON.parse(r.instructions || '[]');
            instBlocksHtml = iBlocks.map((b: any, i: number) => {
                if (b.type === 'text' && b.content.trim() !== '') {
                    return `
                <div class="instruction-step">
                    <div class="step-number">${i + 1}</div>
                    <div class="step-text">${b.content}</div>
                </div>`;
                }
                return '';
            }).join('\n');
        } catch(e) {}

        const recipeHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${r.title} | Mathörnet Recept</title>
    <link rel="stylesheet" href="style_v5.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .ingredients-list { list-style: none; padding: 0; margin: 0; }
        .ingredients-list li { padding: 0.8rem 0; border-bottom: 1px solid #f5f5f5; font-size: 1.1rem; color: #333; }
        .ingredients-list li:last-child { border-bottom: none; }
        .ingredient-checkbox { display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; user-select: none; }
        .ingredient-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
        .checkmark { margin-top: 2px; height: 22px; width: 22px; background-color: #fff; border: 2px solid #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .ingredient-checkbox:hover input ~ .checkmark { border-color: #64b000; }
        .ingredient-checkbox input:checked ~ .checkmark { background-color: #64b000; border-color: #64b000; }
        .checkmark:after { content: ""; position: absolute; display: none; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); margin-bottom: 2px; }
        .ingredient-checkbox input:checked ~ .checkmark:after { display: block; }
        .ingredient-text { line-height: 1.4; transition: color 0.2s; }
        .ingredient-checkbox input:checked ~ .ingredient-text { color: #aaa; text-decoration: line-through; }
        .instruction-step { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
        .step-number { flex-shrink: 0; width: 44px; height: 44px; background: #f0f7e6; color: #64b000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; font-family: 'Outfit', sans-serif; }
        .step-text { font-size: 1.15rem; line-height: 1.7; color: #333; padding-top: 0.4rem; }
    </style>
</head>
<body>
    ${headerStr}

    <main style="background-color: #fcfcfc; padding-bottom: 6rem;">
        <!-- NEW FULL-WIDTH HERO SECTION -->
        <header style="position: relative; width: 100%; min-height: 60vh; display: flex; align-items: center; justify-content: center; background: url('${r.featuredImage || ''}') center/cover no-repeat; padding: 10rem 2rem 4rem 2rem; margin-bottom: 4rem;">
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2);"></div>
            
            <div style="position: relative; background: #fff; padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 5vw, 5rem); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-width: 900px; width: 100%; text-align: center; z-index: 1;">
                <h1 style="font-size: clamp(2rem, 4.5vw, 3.8rem); font-weight: 800; color: #111; line-height: 1.15; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif;">${r.title}</h1>
                <p style="font-size: 1.2rem; color: #555; max-width: 650px; margin: 0 auto 2.5rem; line-height: 1.6;">${r.description || ''}</p>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #222; font-weight: 700; font-size: 1.1rem;">
                        <span>⏱️</span>
                        <span>${r.prepTime || '-'}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #222; font-weight: 700; font-size: 1.1rem;">
                        <span>🍽️</span>
                        <span>${r.portions || '-'} portioner</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #222; font-weight: 700; font-size: 1.1rem;">
                        <span>👨‍🍳</span>
                        <span>${r.difficulty || '-'}</span>
                    </div>
                </div>
            </div>
        </header>

        <article class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 1.5rem;">
            <div class="breadcrumbs" style="font-size: 0.9rem; color: #666; margin-bottom: 3rem;">
                <a href="mathornet.html" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="recept.html" style="color: #666; text-decoration: none;">Recept</a> &gt; <span style="color: #111; font-weight: 600;">${r.title}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 4rem;">
                <!-- Try a 2-column layout on larger screens: 1/3 and 2/3 -->
                <div style="display: flex; flex-wrap: wrap; gap: 3rem;">
                    
                    <!-- INGREDIENSER -->
                    <aside style="flex: 1; min-width: 300px; max-width: 400px; background: #fff; padding: 2.5rem; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); height: fit-content;">
                        <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; color: #111; margin-bottom: 2rem; border-bottom: 2px solid #64b000; padding-bottom: 0.8rem;">Ingredienser</h2>
                        <ul class="ingredients-list">
${ingBlocksHtml}
                        </ul>
                    </aside>
                    
                    <!-- GÖR SÅ HÄR -->
                    <section style="flex: 2; min-width: 300px;">
                        <h2 style="font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 2.5rem;">Gör så här</h2>
${instBlocksHtml}
                    </section>

                </div>
                
                <div style="margin-top: 1rem; text-align: center; width: 100%;">
                    <a href="recept.html" class="btn btn-primary" style="background: #64b000; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold;">&larr; Tillbaka till alla recept</a>
                </div>
            </div>
        </article>
    </main>

    ${footerStr}
    <script src="main_v5.js"></script>
</body>
</html>`;
        fs.writeFileSync(path.join(publicDir, `${r.slug}.html`), recipeHtml);
    }
    
    // --- BUILD STORE LOCATOR JS ---
    const stores = await prisma.store.findMany({ where: { published: true } });
    const jsPath = path.join(publicDir, 'js', 'store-locator.js');
    if (fs.existsSync(jsPath)) {
        let jsContent = fs.readFileSync(jsPath, 'utf8');
        
        // Find the array declaration
        const arrayStartStr = 'const stores = [';
        const arrayStartIdx = jsContent.indexOf(arrayStartStr);
        if (arrayStartIdx !== -1) {
            // Find the end of the array, which should be '];'
            // We can search for the next '// 2. Initialize Leaflet Map' and go backwards
            const nextSectionIdx = jsContent.indexOf('// 2. Initialize Leaflet Map');
            if (nextSectionIdx !== -1) {
                // Find the last '];' before nextSectionIdx
                const arrayEndIdx = jsContent.lastIndexOf('];', nextSectionIdx);
                if (arrayEndIdx !== -1) {
                    const beforeArray = jsContent.substring(0, arrayStartIdx + arrayStartStr.length);
                    const afterArray = jsContent.substring(arrayEndIdx + 2); // skip ];
                    
                    const jsArray = stores.map(s => {
                        const hoursStr = s.openingHours ? JSON.stringify(s.openingHours) : 'null';
                        return `{
            id: "${s.id}",
            name: "${s.name.replace(/"/g, '\\"')}",
            address: "${(s.address || '').replace(/"/g, '\\"')}",
            lat: ${s.lat || 0},
            lng: ${s.lng || 0},
            openingHours: ${hoursStr},
            phone: "",
            website: ""
        }`;
                    }).join(',\n        ');
                    
                    jsContent = beforeArray + '\n        ' + jsArray + '\n    ];' + afterArray;
                    fs.writeFileSync(jsPath, jsContent);
                }
            }
        }
    }

    console.log('Website rebuilt successfully');
  } catch (error) {
    console.error('Failed to rebuild website:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
