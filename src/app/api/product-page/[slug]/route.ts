import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function tryServeStaticHtml(normalizedSlug: string, reqUrl: string): Promise<Response | null> {
  if (!/^[a-zA-Z0-9._-]+$/.test(normalizedSlug)) return null;
  try {
    const filePath = path.join(process.cwd(), 'public', `${normalizedSlug}.html`);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  } catch (e) {}
  try {
    const staticUrl = new URL(`/${encodeURIComponent(normalizedSlug)}.html`, reqUrl);
    const staticRes = await fetch(staticUrl);
    if (staticRes.ok) {
      const html = await staticRes.text();
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  } catch (e) {}
  return null;
}

function cleanSlug(slug?: string | null): string {
  return (slug || '').replace(/^\/+/, '');
}

function escapeAttr(val?: string | null): string {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const HEADER_HTML = `<header class="main-header">
        <div class="header-inner container">
            <a href="mathornet" class="logo">
                <img src="img/mathornet_logo_ny_transparent.png" alt="Mathörnet Logotyp" class="main-logo">
            </a>
            
            <button class="mobile-menu-toggle" aria-label="Öppna meny">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <nav class="main-nav">
                <ul>
                    <li><a href="produkter">Produkter</a></li>
                    <li><a href="recept">Recept</a></li>
                    <li><a href="nyheter">Nyheter</a></li>
                    <li><a href="aterforsaljare">Bli återförsäljare</a></li>
                    <li><a href="om-oss">Om oss</a></li>
                    <li><a href="hitta-oss">Hitta oss</a></li>
                    <li><a href="kontakt">Kontakt</a></li>
                </ul>
            </nav>
            <div class="header-actions" style="display: flex; align-items: center; gap: 1rem;">
                <div class="custom-lang-picker">
                    <button class="lang-toggle-btn" aria-label="Välj språk">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </button>
                    <div class="lang-dropdown">
                        <button class="lang-option" data-lang="sv">
                            <img src="https://flagcdn.com/w20/se.png" srcset="https://flagcdn.com/w40/se.png 2x" width="20" alt="Sverige"> Svenska
                        </button>
                        <button class="lang-option" data-lang="en">
                            <img src="https://flagcdn.com/w20/gb.png" srcset="https://flagcdn.com/w40/gb.png 2x" width="20" alt="Storbritannien"> English
                        </button>
                        <button class="lang-option" data-lang="ar">
                            <img src="https://flagcdn.com/w20/sa.png" srcset="https://flagcdn.com/w40/sa.png 2x" width="20" alt="Saudiarabien"> العربية
                        </button>
                    </div>
                </div>
                <div class="search-container">
                    <button class="search-btn" aria-label="Sök">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    <div class="search-dropdown">
                        <input type="text" id="search-input" placeholder="Sök, t.ex. falafel...">
                        <div class="search-results" id="search-results">
                            <!-- JS injected results -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>`;

const FOOTER_HTML = `<footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col">
                <a href="mathornet" class="footer-logo" style="display: block;">
                    <img src="img/mathornet_logo_ny_transparent.png" alt="Mathörnet Logotyp" style="height: 75px; width: auto; max-width: 100%; object-fit: contain; margin-bottom: 15px;">
                </a>
                <p style="color: rgba(255,255,255,0.9); max-width: 260px; font-size: 0.9rem; line-height: 1.6;">Mathörnet bygger på generationer av kunskap om orientalisk matlagning. Äkta råvaror, äkta smak.</p>
                <div class="social-links">
                    <!-- Facebook -->
                    <a href="https://www.facebook.com/p/Math%C3%B6rnet-61595362481669/" target="_blank" rel="noopener noreferrer" aria-label="Mathörnet på Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.5-.14-2.75-.14-2.8 0-4.75 1.7-4.75 4.86V9.5H7v4h3V22h4v-8.5z"/>
                        </svg>
                    </a>
                    <!-- LinkedIn -->
                    <a href="https://www.linkedin.com/company/mathornet" target="_blank" rel="noopener noreferrer" aria-label="Mathörnet på LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                    </a>
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/mathornet/" target="_blank" rel="noopener noreferrer" aria-label="Mathörnet på Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <!-- TikTok -->
                    <a href="https://www.tiktok.com/@mathornet1" target="_blank" rel="noopener noreferrer" aria-label="Mathörnet på TikTok">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                        </svg>
                    </a>
                </div>
            </div>
            
            <div class="footer-col">
                <h3>Snabblänkar</h3>
                <ul>
                    <li><a href="produkter">Produkter</a></li>
                    <li><a href="recept">Recept</a></li>
                    <li><a href="nyheter">Nyheter</a></li>
                    <li><a href="aterforsaljare">Bli återförsäljare</a></li>
                    <li><a href="om-oss">Om oss</a></li>
                    <li><a href="hitta-oss">Hitta oss</a></li>
                    <li><a href="kontakt">Kontakt</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h3>Besöksadress</h3>
                <ul class="contact-info">
                    <li>Mariefredsvägen 35, 64541, Strängnäs</li>
                    <li><a href="mailto:info@mathornet.se">info@mathornet.se</a></li>
                    <li><a href="tel:0766319971" style="color: inherit; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">0766319971</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom container">
            <p>&copy; 2026 Mathörnet. Alla rättigheter reserverade.</p>
            <div class="footer-legal">
                <a href="kopvillkor">Köpvillkor</a>
                <a href="integritetspolicy">Integritetspolicy</a>
                <a href="cookies">Cookies</a>
            </div>
        </div>
    </footer>`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  let normalizedSlug = '';
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug || '');
    normalizedSlug = decodedSlug.replace(/\.html$/i, '').replace(/^\/+/, '');

    if (!normalizedSlug) {
      return new Response('Not found', { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: '/' + normalizedSlug },
        ],
      },
    });

    if (!product) {
      const staticResp = await tryServeStaticHtml(normalizedSlug, _req.url);
      if (staticResp) return staticResp;
      return new Response('Not found', { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { published: true },
    });

    let pInfo: any = {
      manufacturingCountry: '',
      manufacturer: '',
      specialDiets: '',
      leadTime: '',
      properties: [],
      packaging: {
        bag: { count: '', weight: '', artNr: '', ean: '' },
        box: { count: '', weight: '', artNr: '', ean: '' },
        pallet: { count: '', weight: '', artNr: '', ean: '' },
      },
    };
    let nInfo = { energy: '', fat: '', saturatedFat: '', carbs: '', sugar: '', protein: '', salt: '' };
    let iInfo = { dough: '', filling: '', allergens: '' };
    let cInfo = { general: '', oven: '', airfryer: '', pan: '' };

    try { pInfo = JSON.parse(product.productInfo || '{}'); } catch (e) {}
    try { nInfo = JSON.parse(product.nutritionInfo || '{}'); } catch (e) {}
    try { iInfo = JSON.parse(product.ingredients || '{}'); } catch (e) {}
    try { cInfo = JSON.parse(product.cookingInstructions || '{}'); } catch (e) {}

    const bagArtNr = pInfo.packaging?.bag?.artNr || product.artNr || '';
    const bagEan = pInfo.packaging?.bag?.ean || product.ean || '';
    const bagCount = pInfo.packaging?.bag?.count || '';
    const bagWeight = pInfo.packaging?.bag?.weight || '';

    const boxArtNr = pInfo.packaging?.box?.artNr || product.artNr || '';
    const boxEan = pInfo.packaging?.box?.ean || product.ean || '';
    const boxCount = pInfo.packaging?.box?.count || '';
    const boxWeight = pInfo.packaging?.box?.weight || '';

    const palletArtNr = pInfo.packaging?.pallet?.artNr || product.artNr || '';
    const palletEan = pInfo.packaging?.pallet?.ean || product.ean || '';
    const palletCount = pInfo.packaging?.pallet?.count || '';
    const palletWeight = pInfo.packaging?.pallet?.weight || '';

    const otherProducts = products.filter(op => op.id !== product.id).slice(0, 8);
    const otherProductsHtml = otherProducts.map(op => {
      let pWeight = '500 gram';
      try {
        const info = JSON.parse(op.productInfo || '{}');
        if (info.packaging?.bag?.weight) pWeight = info.packaging.bag.weight;
      } catch (e) {}

      const opSlug = cleanSlug(op.slug);
      return `
                            <a href="${escapeAttr(opSlug)}" class="product-card carousel-card" style="text-decoration: none;">
                                <div class="product-img-wrapper">
                                    <img src="${escapeAttr(op.featuredImage || 'img/mathornet_logo_ny_transparent.png')}" alt="${escapeAttr(op.title)}" loading="lazy">
                                </div>
                                <div class="product-info" style="text-align: center;">
                                    <h3>${escapeAttr(op.title)}</h3>
                                    <div class="product-meta" style="justify-content: center;">
                                        <span class="weight">${escapeAttr(pWeight)}</span>
                                    </div>
                                </div>
                            </a>`;
    }).join('');

    const safeTitle = escapeAttr(product.title);
    const safeImage = escapeAttr(product.featuredImage || 'img/mathornet_logo_ny_transparent.png');

    const productHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} | Mathörnet</title>
    <meta name="description" content="Köp ${safeTitle} från Mathörnet.">
    <meta property="og:title" content="${safeTitle} | Mathörnet">
    <meta property="og:description" content="Köp ${safeTitle} från Mathörnet.">
    <meta property="og:image" content="${safeImage}">
    <meta property="og:type" content="product">
    <link rel="stylesheet" href="style_v5.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${HEADER_HTML}

    <main>
        <section class="product-detail-layout container" style="margin-top: 0; padding-bottom: 4rem;">
            <div class="mobile-product-header">
                <div class="breadcrumbs" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <a href="mathornet" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${safeTitle}
                </div>
                <h1 style="font-size: 1.8rem; font-weight: 800; color: #111; margin-bottom: 1rem; line-height: 1.2;">${safeTitle}</h1>
            </div>

            <div class="product-detail-img" style="overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: 16px; padding: 2.5rem 1.5rem; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); min-height: 400px;">
                <img src="${safeImage}" alt="${safeTitle}" style="max-width: 100%; max-height: 380px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.12));">
            </div>
            
            <div class="product-detail-info">
                <div class="breadcrumbs desktop-only" style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #666;">
                    <a href="mathornet" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${safeTitle}
                </div>
                
                <h1 class="desktop-only">${safeTitle}</h1>

                <div class="pack-type-selector">
                    <span>Typ</span>
                    <button class="pack-btn active" data-type="bag" 
                            data-artnr="${escapeAttr(bagArtNr)}" 
                            data-ean="${escapeAttr(bagEan)}" 
                            data-antal-label="Antal/påse:" data-antal-value="${escapeAttr(bagCount)}" 
                            data-vikt-label="Vikt/påse:" data-vikt-value="${escapeAttr(bagWeight)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><rect x="9" y="11" width="6" height="4" rx="1"></rect></svg>
                        <span class="pack-label">Påse</span>
                    </button>
                    <button class="pack-btn" data-type="box" 
                            data-artnr="${escapeAttr(boxArtNr)}" 
                            data-ean="${escapeAttr(boxEan)}" 
                            data-antal-label="Antal påsar/låda:" data-antal-value="${escapeAttr(boxCount)}" 
                            data-vikt-label="Nettovikt/låda:" data-vikt-value="${escapeAttr(boxWeight)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span class="pack-label">Kartong</span>
                    </button>
                    <button class="pack-btn" data-type="pallet" 
                            data-artnr="${escapeAttr(palletArtNr)}" 
                            data-ean="${escapeAttr(palletEan)}" 
                            data-antal-label="Antal lådor/pall:" data-antal-value="${escapeAttr(palletCount)}" 
                            data-vikt-label="Nettovikt/pall:" data-vikt-value="${escapeAttr(palletWeight)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="21" x2="22" y2="21"></line><line x1="4" y1="21" x2="4" y2="18"></line><line x1="12" y1="21" x2="12" y2="18"></line><line x1="20" y1="21" x2="20" y2="18"></line><line x1="2" y1="18" x2="22" y2="18"></line><rect x="4" y="12" width="7" height="6"></rect><rect x="13" y="12" width="7" height="6"></rect><rect x="8" y="6" width="8" height="6"></rect></svg>
                        <span class="pack-label">Pall</span>
                    </button>
                </div>

                <table class="product-data-table">
                    <tbody>
                        <tr><td>Art. nr:</td><td id="td-artnr">${escapeAttr(bagArtNr)}</td></tr>
                        <tr><td>Benämning:</td><td>${safeTitle}</td></tr>
                        <tr><td>EAN:</td><td id="td-ean">${escapeAttr(bagEan)}</td></tr>
                        <tr><td id="td-antal-label">Antal/påse:</td><td id="td-antal-value">${escapeAttr(bagCount)}</td></tr>
                        <tr><td id="td-vikt-label">Vikt/påse:</td><td id="td-vikt-value">${escapeAttr(bagWeight)}</td></tr>
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
                                ${product.description || ''}
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
                                <p><strong>Tillverkningsland:</strong> ${escapeAttr(pInfo.manufacturingCountry)}</p>
                                <p><strong>Tillagas av:</strong> ${escapeAttr(pInfo.manufacturer)}</p>
                                <br>
                                ${(Array.isArray(pInfo.properties) ? pInfo.properties : []).map((prop: string) => '<p>' + escapeAttr(prop) + '</p>').join('')}
                                <br>
                                <p><strong>Specialanpassningar:</strong> ${escapeAttr(pInfo.specialDiets)}</p>
                                <p><strong>Ledtid:</strong> ${escapeAttr(pInfo.leadTime)}</p>
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
                                        <tr><td>Energi, 100g</td><td>${escapeAttr(nInfo.energy)}</td></tr>
                                        <tr><td>Fett</td><td>${escapeAttr(nInfo.fat)}</td></tr>
                                        <tr><td>Varav mättat</td><td>${escapeAttr(nInfo.saturatedFat)}</td></tr>
                                        <tr><td>Kolhydrat</td><td>${escapeAttr(nInfo.carbs)}</td></tr>
                                        <tr><td>Varav socker</td><td>${escapeAttr(nInfo.sugar)}</td></tr>
                                        <tr><td>Protein</td><td>${escapeAttr(nInfo.protein)}</td></tr>
                                        <tr><td>Salt</td><td>${escapeAttr(nInfo.salt)}</td></tr>
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
                                <p><strong>Deg:</strong> ${escapeAttr(iInfo.dough)}</p>
                                <p><strong>Fyllning:</strong> ${escapeAttr(iInfo.filling)}</p>
                                <p><strong>Allergener:</strong> ${escapeAttr(iInfo.allergens)}</p>
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
                                <p>${escapeAttr(product.storage)}</p>
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
                                <p style="margin-bottom: 1.5rem;">${escapeAttr(cInfo.general)}</p>
                                <p style="margin-bottom: 1rem;"><strong>Varmluftsugn</strong><br>${escapeAttr(cInfo.oven)}</p>
                                <p style="margin-bottom: 1rem;"><strong>Airfryer</strong><br>${escapeAttr(cInfo.airfryer)}</p>
                                <p><strong>Stekpanna</strong><br>${escapeAttr(cInfo.pan)}</p>
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
${otherProductsHtml}
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
                    <a href="produkter" class="btn btn-primary" style="background: #64b000; color: white; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Se alla produkter &rarr;</a>
                </div>
            </div>
        </section>
    </main>

    ${FOOTER_HTML}
    <!-- Google Translate Script & Custom Logic -->
    <div id="google_translate_element" style="display:none;"></div>
    <script src="js/translate.js"></script>
    <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <script src="main_v5.js"></script>
    <script>
      // Pack button logic
      document.querySelectorAll('.pack-btn').forEach(btn => {
          btn.addEventListener('click', function() {
              document.querySelectorAll('.pack-btn').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
              const tdArtnr = document.getElementById('td-artnr');
              if (tdArtnr) tdArtnr.innerText = this.dataset.artnr || '';
              const tdEan = document.getElementById('td-ean');
              if (tdEan) tdEan.innerText = this.dataset.ean || '';
              const tdAntalLabel = document.getElementById('td-antal-label');
              if (tdAntalLabel) tdAntalLabel.innerText = this.dataset.antalLabel || '';
              const tdAntalVal = document.getElementById('td-antal-value');
              if (tdAntalVal) tdAntalVal.innerText = this.dataset.antalValue || '';
              const tdViktLabel = document.getElementById('td-vikt-label');
              if (tdViktLabel) tdViktLabel.innerText = this.dataset.viktLabel || '';
              const tdViktVal = document.getElementById('td-vikt-value');
              if (tdViktVal) tdViktVal.innerText = this.dataset.viktValue || '';
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

    return new Response(productHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to render product page from DB, falling back to static HTML:', error);
    if (normalizedSlug) {
      const staticResp = await tryServeStaticHtml(normalizedSlug, _req.url);
      if (staticResp) return staticResp;
    }
    return new Response('Internal server error', { status: 500 });
  }
}
