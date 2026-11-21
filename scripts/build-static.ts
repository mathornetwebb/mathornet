import './setup-env';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

async function main() {
  console.log('Starting static build script...');
  const cleanSlug = (slug?: string | null) => (slug || '').replace(/^\/+/, '');
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    // Fetch data from DB
    const products = await prisma.product.findMany();
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    
    // Safety check - if db is totally empty, don't wipe out the site
    if (products.length === 0 && news.length === 0) {
      console.log('Database empty, skipping build to protect files.');
      process.exit(0);
    }
    // --- REBUILD PRODUKTER.HTML (BRAND ASSORTMENT SELECTION) ---
    const produkterPath = path.join(publicDir, 'produkter.html');
    let produkterHtml = fs.readFileSync(produkterPath, 'utf8');
    
    const mainStartIdx = produkterHtml.indexOf('<main>');
    const mainEndIdx = produkterHtml.indexOf('</main>');
    
    if (mainStartIdx !== -1 && mainEndIdx !== -1) {
      const mathornetProducts: string[] = [];
      const ahalnaProducts: string[] = [];

      for (const p of products) {
        let brand = 'mathornet';
        let weight = '-';
        let isNyhet = false;
        try {
          const info = JSON.parse(p.productInfo || '{}');
          if (info.brand) brand = info.brand;
          if (info.packaging?.bag?.weight) weight = info.packaging.bag.weight;
          else if (info.packaging?.box?.weight) weight = info.packaging.box.weight;
        } catch(e) {}
        
        const badgeHtml = isNyhet ? '<span class="product-badge">Nyhet</span>' : '';
        const slug = cleanSlug(p.slug);
        const cardHtml = `
                    <!-- Dynamisk Produkt: ${p.title} -->
                    <a href="${slug}" class="product-card">
                        ${badgeHtml}
                        <div class="product-img-wrapper">
                            <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3>${p.title}</h3>
                            <div class="product-meta">
                                <span class="weight">${weight}</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>`;

        if (brand === 'ahalna') {
          ahalnaProducts.push(cardHtml);
        } else {
          mathornetProducts.push(cardHtml);
        }
      }

      const mathornetGridHtml = mathornetProducts.join('\n');
      const ahalnaGridHtml = ahalnaProducts.length > 0 ? ahalnaProducts.join('\n') : `
                    <div class="empty-brand-state">
                        <div class="empty-brand-icon">✨</div>
                        <h3>Ahalna sortimentet lanseras inom kort</h3>
                        <p>Vi arbetar just nu för fullt med att ta fram spännande nya produkter under varumärket Ahalna. Håll utkik här för lanseringen!</p>
                        <button type="button" onclick="selectBrand('mathornet')" class="btn-switch-mathornet">Se Mathörnets sortiment istället &rarr;</button>
                    </div>`;

      const newMainHtml = `<main>
        <!-- STEG 1: VÄLJ VARUMÄRKE -->
        <section id="brand-selection-view" class="brand-selection-section">
            <div class="brand-selection-container">
                <div class="menu-page-header">
                    <h1 class="menu-page-title">Meny</h1>
                    <p class="menu-page-subtitle">Välj varumärke för att upptäcka sortimentet</p>
                </div>

                <div class="brand-menu-grid">
                    <!-- Mathörnet Kort -->
                    <div class="brand-menu-card brand-card-mathornet" onclick="selectBrand('mathornet')" onkeydown="if(event.key==='Enter'||event.key===' '){selectBrand('mathornet');event.preventDefault();}" role="button" tabindex="0" aria-label="Mathörnet sortiment">
                        <div class="brand-menu-img-wrap">
                            <img src="img/products/kubbe-trabolsie.png" alt="Mathörnet produkter" class="brand-menu-img" loading="eager">
                        </div>
                        <div class="brand-menu-footer">
                            <div class="brand-menu-info">
                                <span class="brand-menu-name">Mathörnet</span>
                                <span class="brand-menu-desc">Originalsortiment • ${mathornetProducts.length} produkter</span>
                            </div>
                            <span class="brand-menu-chevron" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <!-- Ahalna Kort -->
                    <div class="brand-menu-card brand-card-ahalna" onclick="selectBrand('ahalna')" onkeydown="if(event.key==='Enter'||event.key===' '){selectBrand('ahalna');event.preventDefault();}" role="button" tabindex="0" aria-label="Ahalna delikatesser">
                        <div class="brand-menu-img-wrap">
                            <img src="https://zgylvcwzwfqmligweato.supabase.co/storage/v1/object/public/images/upload_1794897091125_AH_Trabolsie.jpeg" alt="Ahalna delikatesser" class="brand-menu-img" loading="eager">
                        </div>
                        <div class="brand-menu-footer">
                            <div class="brand-menu-info">
                                <span class="brand-menu-name">Ahalna</span>
                                <span class="brand-menu-desc">Premium Delikatesser • ${ahalnaProducts.length > 0 ? ahalnaProducts.length + ' produkter' : 'Kommer snart'}</span>
                            </div>
                            <span class="brand-menu-chevron" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- STEG 2: PRODUKTRUTNÄT -->
        <section id="product-grid-view" class="products-section" style="padding: 4rem 0 6rem 0; display: none;">
            <div class="container">
                
                <!-- Navigering & Varumärkesväxlare -->
                <div class="product-view-nav-bar">
                    <button type="button" class="back-to-brands-btn" onclick="showBrandSelection()">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <span>Alla Varumärken</span>
                    </button>

                    <div class="brand-toggle-tabs">
                        <button type="button" class="brand-tab-btn active" data-brand="mathornet" onclick="selectBrand('mathornet')">
                            Mathörnet (${mathornetProducts.length})
                        </button>
                        <button type="button" class="brand-tab-btn" data-brand="ahalna" onclick="selectBrand('ahalna')">
                            Ahalna (${ahalnaProducts.length})
                        </button>
                    </div>
                </div>

                <!-- Mathörnet Banner & Grid -->
                <div id="brand-banner-mathornet" class="active-brand-banner mathornet-banner">
                    <div class="brand-banner-text">
                        <span class="banner-pill">Sortiment: Mathörnet</span>
                        <h2>Autentiska orientaliska specialiteter</h2>
                        <p>Klassiska recept och traditionella smaker, tillagade och förpackade med högsta kvalitet.</p>
                    </div>
                </div>

                <div id="grid-mathornet" class="products-grid-large brand-grid">
${mathornetGridHtml}
                </div>

                <!-- Ahalna Banner & Grid -->
                <div id="brand-banner-ahalna" class="active-brand-banner ahalna-banner" style="display: none;">
                    <div class="brand-banner-text">
                        <span class="banner-pill">Sortiment: Ahalna</span>
                        <h2>En ny värld av orientaliska delikatesser</h2>
                        <p>Utvalda råvaror och moderna orientaliska smaker med premiumkänsla.</p>
                    </div>
                </div>

                <div id="grid-ahalna" class="products-grid-large brand-grid" style="display: none;">
${ahalnaGridHtml}
                </div>

            </div>
        </section>

        <!-- Brand Assortment Logic -->
        <script>
            function selectBrand(brand) {
                try { window.location.hash = brand; } catch(e) {}
                const selectionView = document.getElementById('brand-selection-view');
                const gridView = document.getElementById('product-grid-view');
                if (!selectionView || !gridView) return;
                
                selectionView.style.display = 'none';
                gridView.style.display = 'block';

                document.querySelectorAll('.brand-tab-btn').forEach(btn => {
                    if (btn.dataset.brand === brand) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                const mathornetBanner = document.getElementById('brand-banner-mathornet');
                const ahalnaBanner = document.getElementById('brand-banner-ahalna');
                const mathornetGrid = document.getElementById('grid-mathornet');
                const ahalnaGrid = document.getElementById('grid-ahalna');

                if (brand === 'ahalna') {
                    if (mathornetBanner) mathornetBanner.style.display = 'none';
                    if (ahalnaBanner) ahalnaBanner.style.display = 'block';
                    if (mathornetGrid) mathornetGrid.style.display = 'none';
                    if (ahalnaGrid) ahalnaGrid.style.display = 'grid';
                } else {
                    if (mathornetBanner) mathornetBanner.style.display = 'block';
                    if (ahalnaBanner) ahalnaBanner.style.display = 'none';
                    if (mathornetGrid) mathornetGrid.style.display = 'grid';
                    if (ahalnaGrid) ahalnaGrid.style.display = 'none';
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function showBrandSelection() {
                try { history.pushState("", document.title, window.location.pathname + window.location.search); } catch(e) {}
                const selectionView = document.getElementById('brand-selection-view');
                const gridView = document.getElementById('product-grid-view');
                if (selectionView && gridView) {
                    selectionView.style.display = 'block';
                    gridView.style.display = 'none';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function initBrandFromHash() {
                const hash = window.location.hash.replace('#', '');
                if (hash === 'mathornet' || hash === 'ahalna') {
                    selectBrand(hash);
                } else {
                    const selectionView = document.getElementById('brand-selection-view');
                    const gridView = document.getElementById('product-grid-view');
                    if (selectionView && gridView) {
                        selectionView.style.display = 'block';
                        gridView.style.display = 'none';
                    }
                }
            }

            function escHtml(str) {
                return String(str || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            }

            async function syncLiveProducts() {
                try {
                    const res = await fetch('/api/products?t=' + Date.now(), { cache: 'no-store' });
                    if (!res.ok) return;
                    const data = await res.json();
                    if (!data || !Array.isArray(data.products) || data.products.length === 0) return;

                    const mathornetCards = [];
                    const ahalnaCards = [];

                    for (const p of data.products) {
                        let brand = 'mathornet';
                        let weight = '-';
                        try {
                            const info = JSON.parse(p.productInfo || '{}');
                            if (info.brand) brand = info.brand;
                            if (info.packaging && info.packaging.bag && info.packaging.bag.weight) weight = info.packaging.bag.weight;
                            else if (info.packaging && info.packaging.box && info.packaging.box.weight) weight = info.packaging.box.weight;
                        } catch (e) {}

                        const cleanProductSlug = (p.slug || '').replace(new RegExp('^/+'), '');
                        const imgSrc = escHtml(p.featuredImage || 'img/mathornet_logo_ny_transparent.png');
                        const safeTitle = escHtml(p.title);
                        const safeWeight = escHtml(weight);
                        const cardHtml =
                            '<a href="' + escHtml(cleanProductSlug) + '" class="product-card">' +
                            '<div class="product-img-wrapper">' +
                            '<img src="' + imgSrc + '" alt="' + safeTitle + '" loading="lazy">' +
                            '</div>' +
                            '<div class="product-info">' +
                            '<h3>' + safeTitle + '</h3>' +
                            '<div class="product-meta">' +
                            '<span class="weight">' + safeWeight + '</span>' +
                            '<span class="read-more">Tryck för att läsa mer &rarr;</span>' +
                            '</div>' +
                            '</div>' +
                            '</a>';

                        if (brand === 'ahalna') {
                            ahalnaCards.push(cardHtml);
                        } else {
                            mathornetCards.push(cardHtml);
                        }
                    }

                    const mathornetGrid = document.getElementById('grid-mathornet');
                    if (mathornetGrid) mathornetGrid.innerHTML = mathornetCards.join('\\n');

                    const ahalnaGrid = document.getElementById('grid-ahalna');
                    if (ahalnaGrid) {
                        ahalnaGrid.innerHTML = ahalnaCards.length > 0 ? ahalnaCards.join('\\n') :
                            '<div class="empty-brand-state">' +
                            '<div class="empty-brand-icon">✨</div>' +
                            '<h3>Ahalna sortimentet lanseras inom kort</h3>' +
                            '<p>Vi arbetar just nu för fullt med att ta fram spännande nya produkter under varumärket Ahalna. Håll utkik här för lanseringen!</p>' +
                            '<button type="button" onclick="selectBrand(\\'mathornet\\')" class="btn-switch-mathornet">Se Mathörnets sortiment istället &rarr;</button>' +
                            '</div>';
                    }

                    const mathornetCountTag = document.querySelector('.brand-card-mathornet .product-count-tag');
                    if (mathornetCountTag) mathornetCountTag.textContent = mathornetCards.length + ' produkter';

                    const ahalnaCountTag = document.querySelector('.brand-card-ahalna .product-count-tag');
                    if (ahalnaCountTag) ahalnaCountTag.textContent = ahalnaCards.length > 0 ? ahalnaCards.length + ' produkter' : 'Kommer snart';

                    const mathornetTabBtn = document.querySelector('.brand-tab-btn[data-brand="mathornet"]');
                    if (mathornetTabBtn) mathornetTabBtn.textContent = 'Mathörnet (' + mathornetCards.length + ')';

                    const ahalnaTabBtn = document.querySelector('.brand-tab-btn[data-brand="ahalna"]');
                    if (ahalnaTabBtn) ahalnaTabBtn.textContent = 'Ahalna (' + ahalnaCards.length + ')';
                } catch (err) {
                    console.error('Failed to sync live products:', err);
                }
            }

            window.addEventListener('DOMContentLoaded', initBrandFromHash);
            window.addEventListener('DOMContentLoaded', syncLiveProducts);
            window.addEventListener('hashchange', initBrandFromHash);
        </script>
    </main>`;

      produkterHtml = produkterHtml.substring(0, mainStartIdx) + newMainHtml + produkterHtml.substring(mainEndIdx + 7);
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
                const slug = cleanSlug(p.slug);
                newSliderList += `
                    <!-- Dynamisk Produkt: ${p.title} -->
                    <div class="swiper-slide teza-slide">
                        <a href="${slug}" class="teza-product-link">
                            <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}" class="teza-product-img" loading="lazy">
                            <div class="teza-product-info">
                                <h3>${p.title}</h3>
                            </div>
                        </a>
                    </div>\n`;
              }
              
              const beforeSlider = mathornetHtml.substring(0, wrapperStartIdx + wrapperStartStr.length);
              const afterSlider = mathornetHtml.substring(wrapperEndIdx);
              
              mathornetHtml = beforeSlider + '\n' + newSliderList + '                ' + afterSlider;
            }
          }
        }
      }
      
      // Update News Carousel on start page (latest 6)
      const carouselTrackStr = '<div class="carousel-track" style="display: flex; transition: transform 0.5s ease-in-out;">';
      const carouselTrackIdx = mathornetHtml.indexOf(carouselTrackStr);
      if (carouselTrackIdx !== -1) {
        const carouselTrackEndIdx = mathornetHtml.indexOf('</div>\n                    </div>\n                    <div class="carousel-controls"', carouselTrackIdx);
        // Sometimes the html formatting differs slightly, let's use a more robust search
        const nextDivIdx = mathornetHtml.indexOf('</div>\n                    </div>', carouselTrackIdx);
        
        if (nextDivIdx !== -1) {
          let newNewsSliderList = '';
          // We want the 6 latest news
          // Note: we should ensure `news` is sorted by date descending, but let's sort a copy just in case
          const sortedNews = [...news].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          const top6News = sortedNews.slice(0, 6);
          
          for (const n of top6News) {
            const dateObj = n.createdAt || new Date();
            const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
            const dateStr = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
            
            newNewsSliderList += `
                            <!-- Dynamisk Nyhet: ${n.title} -->
                            <a href="${n.slug}" class="carousel-card news-card-v2" style="flex: 0 0 calc(33.333% - 22px); min-width: 300px;  background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                                <div class="news-img" style="height: 250px; overflow: hidden;">
                                    <img src="${n.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${n.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                                </div>
                                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                                    <div class="news-meta" style="font-size: 0.85rem; color: #666; margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
                                        <span class="date">${dateStr}</span>
                                        <span class="divider">|</span>
                                        <span class="category" style="color: var(--navy-bg); font-weight: 600;">Nyhet</span>
                                    </div>
                                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${n.title}</h3>
                                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${n.excerpt || ''}</p>
                                    <span class="btn btn-navy" style="text-align: center; width: 100%;">Läs inlägg</span>
                                </div>
                            </a>\n`;
          }
          
          const beforeNews = mathornetHtml.substring(0, carouselTrackIdx + carouselTrackStr.length);
          const afterNews = mathornetHtml.substring(nextDivIdx);
          
          mathornetHtml = beforeNews + '\n' + newNewsSliderList + '                        ' + afterNews;
        }
      }

      fs.writeFileSync(mathornetPath, mathornetHtml);
      fs.writeFileSync(path.join(publicDir, 'index.html'), mathornetHtml);
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
            <a href="${featuredNews.slug}" class="featured-post" style="position: relative; border-radius: 24px; overflow: hidden; height: 500px; min-height: 500px; margin-bottom: 4rem; display: flex; align-items: flex-end; text-decoration: none; box-shadow: 0 15px 40px rgba(0,0,0,0.12); transition: transform 0.3s ease, box-shadow 0.3s ease;">
                <img src="${featuredNews.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" class="featured-bg" alt="${featuredNews.title}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
                <div class="featured-overlay" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%);"></div>
                <div class="featured-content" style="position: relative; z-index: 2; padding: clamp(2rem, 5vw, 3.5rem); color: #fff; max-width: 800px;">
                    <div class="featured-meta" style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem;">
                        <span class="category" style="background: #64b000; color: #fff; padding: 5px 14px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Utvald Nyhet</span>
                        <span style="color: rgba(255,255,255,0.85); font-weight: 500; font-size: 0.95rem;">${dStr}</span>
                    </div>
                    <h2 style="font-size: clamp(1.85rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 0.75rem; color: #fff; line-height: 1.25; font-family: 'Outfit', sans-serif;">${featuredNews.title}</h2>
                    ${featuredNews.excerpt ? `<p style="font-size: 1.15rem; margin-bottom: 1.5rem; color: rgba(255,255,255,0.9); line-height: 1.6; max-width: 650px;">${featuredNews.excerpt}</p>` : ''}
                    <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #fff; color: #111; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 0.95rem; margin-top: 0.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                        <span>Läs hela artikeln</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                </div>
            </a>`;
      nyheterHtml = nyheterHtml.replace(featuredRegex, featuredHtml);
    }
    
    // News grid: display other news (excluding the featured news[0] to avoid duplicates)
    const otherNews = news.slice(1);
    let newNewsList = '';
    for (const n of otherNews) {
      // Format date: "24 sep 2026"
      const dateObj = n.createdAt || new Date();
      const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
      const dateStr = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      
      newNewsList += `
                    <!-- Dynamisk Nyhet: ${n.title} -->
                    <a href="${n.slug}" class="news-card-v2" style="background: #fff; border-radius: 18px; border: 1px solid rgba(0,0,0,0.07); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); display: flex; flex-direction: column; text-decoration: none; transition: transform 0.25s ease, box-shadow 0.25s ease;">
                        <div class="news-img" style="height: 240px; overflow: hidden; position: relative;">
                            <img src="${n.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${n.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                            <span style="position: absolute; top: 1rem; left: 1rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); color: #15803d; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 50px;">Nyhet</span>
                        </div>
                        <div class="news-content" style="padding: 1.75rem; display: flex; flex-direction: column; flex-grow: 1;">
                            <div class="news-meta" style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.75rem; display: flex; gap: 0.5rem; align-items: center; font-weight: 500;">
                                <span>${dateStr}</span>
                            </div>
                            <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.75rem; color: #111827; line-height: 1.35; font-family: 'Outfit', sans-serif;">${n.title}</h3>
                            ${n.excerpt ? `<p style="color: #4b5563; margin-bottom: 1.5rem; line-height: 1.6; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${n.excerpt}</p>` : ''}
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: #4d8e00; font-weight: 700; font-size: 0.95rem; margin-top: auto; padding-top: 1rem;">
                                <span>Läs hela artikeln</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </div>
                        </div>
                    </a>\n`;
    }
    
    const gridRegex = /(<div class="news-grid-layout"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/main>)/i;
    const gridDisplay = otherNews.length > 0 ? '' : ' style="display: none;"';
    if (gridRegex.test(nyheterHtml)) {
      nyheterHtml = nyheterHtml.replace(gridRegex, `<div class="news-grid-layout"${gridDisplay}>\n${newNewsList}            $2`);
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
        let pInfo: any = { manufacturingCountry: '', manufacturer: '', specialDiets: '', leadTime: '', properties: [], packaging: { bag: { count: '', weight: '', artNr: '', ean: '' }, box: { count: '', weight: '', artNr: '', ean: '' }, pallet: { count: '', weight: '', artNr: '', ean: '' } } };
        let nInfo = { energy: '', fat: '', saturatedFat: '', carbs: '', sugar: '', protein: '', salt: '' };
        let iInfo = { dough: '', filling: '', allergens: '' };
        let cInfo = { general: '', oven: '', airfryer: '', pan: '' };
        
        try { pInfo = JSON.parse(p.productInfo || '{}'); } catch(e) {}
        try { nInfo = JSON.parse(p.nutritionInfo || '{}'); } catch(e) {}
        try { iInfo = JSON.parse(p.ingredients || '{}'); } catch(e) {}
        try { cInfo = JSON.parse(p.cookingInstructions || '{}'); } catch(e) {}

        const bagArtNr = pInfo.packaging?.bag?.artNr || p.artNr || '';
        const bagEan = pInfo.packaging?.bag?.ean || p.ean || '';
        const bagCount = pInfo.packaging?.bag?.count || '';
        const bagWeight = pInfo.packaging?.bag?.weight || '';

        const boxArtNr = pInfo.packaging?.box?.artNr || p.artNr || '';
        const boxEan = pInfo.packaging?.box?.ean || p.ean || '';
        const boxCount = pInfo.packaging?.box?.count || '';
        const boxWeight = pInfo.packaging?.box?.weight || '';

        const palletArtNr = pInfo.packaging?.pallet?.artNr || p.artNr || '';
        const palletEan = pInfo.packaging?.pallet?.ean || p.ean || '';
        const palletCount = pInfo.packaging?.pallet?.count || '';
        const palletWeight = pInfo.packaging?.pallet?.weight || '';

        const productHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} | Mathörnet</title>
    <meta name="description" content="Köp ${p.title} från Mathörnet.">
    <meta property="og:title" content="${p.title} | Mathörnet">
    <meta property="og:description" content="Köp ${p.title} från Mathörnet.">
    <meta property="og:image" content="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}">
    <meta property="og:type" content="product">
    <link rel="stylesheet" href="style_v5.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${headerStr}

    <main>
        <section class="product-detail-layout container" style="margin-top: 0; padding-bottom: 4rem;">
            <div class="mobile-product-header">
                <div class="breadcrumbs" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                    <a href="mathornet" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.title}
                </div>
                <h1 style="font-size: 1.8rem; font-weight: 800; color: #111; margin-bottom: 1rem; line-height: 1.2;">${p.title}</h1>
            </div>

            <div class="product-detail-img" style="overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: 16px; padding: 2.5rem 1.5rem; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); min-height: 400px;">
                <img src="${p.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${p.title}" style="max-width: 100%; max-height: 380px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.12));">
            </div>
            
            <div class="product-detail-info">
                <div class="breadcrumbs desktop-only" style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #666;">
                    <a href="mathornet" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="produkter" style="color: #666; text-decoration: none;">Produkter</a> &gt; ${p.title}
                </div>
                
                <h1 class="desktop-only">${p.title}</h1>

                <div class="pack-type-selector">
                    <span>Typ</span>
                    <button class="pack-btn active" data-type="bag" 
                            data-artnr="${bagArtNr}" 
                            data-ean="${bagEan}" 
                            data-antal-label="Antal/påse:" data-antal-value="${bagCount}" 
                            data-vikt-label="Vikt/påse:" data-vikt-value="${bagWeight}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><rect x="9" y="11" width="6" height="4" rx="1"></rect></svg>
                        <span class="pack-label">Påse</span>
                    </button>
                    <button class="pack-btn" data-type="box" 
                            data-artnr="${boxArtNr}" 
                            data-ean="${boxEan}" 
                            data-antal-label="Antal påsar/låda:" data-antal-value="${boxCount}" 
                            data-vikt-label="Nettovikt/låda:" data-vikt-value="${boxWeight}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span class="pack-label">Kartong</span>
                    </button>
                    <button class="pack-btn" data-type="pallet" 
                            data-artnr="${palletArtNr}" 
                            data-ean="${palletEan}" 
                            data-antal-label="Antal lådor/pall:" data-antal-value="${palletCount}" 
                            data-vikt-label="Nettovikt/pall:" data-vikt-value="${palletWeight}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="21" x2="22" y2="21"></line><line x1="4" y1="21" x2="4" y2="18"></line><line x1="12" y1="21" x2="12" y2="18"></line><line x1="20" y1="21" x2="20" y2="18"></line><line x1="2" y1="18" x2="22" y2="18"></line><rect x="4" y="12" width="7" height="6"></rect><rect x="13" y="12" width="7" height="6"></rect><rect x="8" y="6" width="8" height="6"></rect></svg>
                        <span class="pack-label">Pall</span>
                    </button>
                </div>

                <table class="product-data-table">
                    <tbody>
                        <tr><td>Art. nr:</td><td id="td-artnr">${bagArtNr}</td></tr>
                        <tr><td>Benämning:</td><td>${p.title}</td></tr>
                        <tr><td>EAN:</td><td id="td-ean">${bagEan}</td></tr>
                        <tr><td id="td-antal-label">Antal/påse:</td><td id="td-antal-value">${bagCount}</td></tr>
                        <tr><td id="td-vikt-label">Vikt/påse:</td><td id="td-vikt-value">${bagWeight}</td></tr>
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
        
        const opSlug = cleanSlug(op.slug);
        return `
                            <a href="${opSlug}" class="product-card carousel-card" style="text-decoration: none;">
                                <div class="product-img-wrapper">
                                    <img src="${op.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${op.title}" loading="lazy">
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
                    <a href="produkter" class="btn btn-primary" style="background: #64b000; color: white; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Se alla produkter &rarr;</a>
                </div>
            </div>
        </section>
    </main>

    ${footerStr}
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
        const targetSlug = cleanSlug(p.slug);
        if (targetSlug) {
            fs.writeFileSync(path.join(publicDir, `${targetSlug}.html`), productHtml);
        }
    }

    // --- BUILD INDIVIDUAL NEWS PAGES ---
    for (const n of news) {
        const dateObj = n.createdAt || new Date();
        const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        
        let blocksHtml = '';
        try {
            const rawBlocks = JSON.parse(n.content || '[]');
            // Filter out empty blocks completely
            const validBlocks = rawBlocks.filter((b: any) => {
                if (!b || !b.content) return false;
                if (b.type === 'image') return b.content.trim().length > 0;
                const textOnly = b.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                return textOnly.length > 0;
            });

            blocksHtml = validBlocks.map((b: any, bIdx: number) => {
                if (b.type === 'h2') {
                    const cleanH2 = b.content.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
                    return `<h2 style="font-size: 2rem; font-weight: 800; color: #111827; margin-top: ${bIdx === 0 ? '0' : '2.5rem'}; margin-bottom: 0.85rem; font-family: 'Outfit', sans-serif; line-height: 1.3;">${cleanH2}</h2>`;
                }
                if (b.type === 'h3') {
                    const cleanH3 = b.content.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
                    return `<h3 style="font-size: 1.4rem; font-weight: 700; color: #111827; margin-top: ${bIdx === 0 ? '0' : '2rem'}; margin-bottom: 0.75rem; font-family: 'Outfit', sans-serif; line-height: 1.35;">${cleanH3}</h3>`;
                }
                if (b.type === 'text') {
                    let textHtml = b.content;
                    // Strip empty paragraphs and breaks
                    textHtml = textHtml.replace(/<p[^>]*>\s*(<strong>\s*)?(<br\s*\/?>|&nbsp;|\s*)*(<\/strong>\s*)?<\/p>/gi, '');
                    textHtml = textHtml.replace(/\s*class=["']isSelectedEnd["']/gi, '');
                    // Convert double <br> into paragraph breaks
                    textHtml = textHtml.replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p>');
                    return `<div class="text-block" style="font-size: 1.15rem; color: #374151; line-height: 1.85; margin-bottom: 1.5rem;">${textHtml}</div>`;
                }
                if (b.type === 'image') {
                    return `<figure style="margin: 2.5rem 0; text-align: center;"><img src="${b.content}" alt="${b.caption || n.title}" loading="lazy" style="width: 100%; max-height: 550px; object-fit: cover; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">${b.caption ? `<figcaption style="font-size: 0.9rem; color: #6b7280; margin-top: 0.75rem; text-align: center; font-style: italic;">${b.caption}</figcaption>` : ''}</figure>`;
                }
                return '';
            }).filter(Boolean).join('\n');
        } catch(e) {}

        // Other news recommendations (2 items)
        const otherNews = news.filter(item => item.id !== n.id).slice(0, 2);
        let recommendationsHtml = '';
        if (otherNews.length > 0) {
            recommendationsHtml = `
            <div style="margin-top: 5rem; padding-top: 3.5rem; border-top: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <span style="font-size: 0.85rem; font-weight: 700; color: #64b000; text-transform: uppercase; letter-spacing: 0.5px;">Fler artiklar</span>
                        <h3 style="font-size: 1.75rem; font-weight: 800; color: #111827; font-family: 'Outfit', sans-serif; margin-top: 0.25rem;">Läs mer från Mathörnet</h3>
                    </div>
                    <a href="nyheter" style="color: #64b000; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
                        <span>Visa alla nyheter</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${otherNews.map(o => {
                        const oDate = o.createdAt || new Date();
                        const oDateStr = `${oDate.getDate().toString().padStart(2, '0')} ${months[oDate.getMonth()]} ${oDate.getFullYear()}`;
                        return `
                        <a href="${o.slug}" style="background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; text-decoration: none; transition: transform 0.2s ease;">
                            <div style="height: 180px; overflow: hidden;">
                                <img src="${o.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${o.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                            </div>
                            <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
                                <span style="font-size: 0.8rem; color: #6b7280; margin-bottom: 0.5rem;">${oDateStr}</span>
                                <h4 style="font-size: 1.2rem; font-weight: 700; color: #111827; line-height: 1.35; font-family: 'Outfit', sans-serif; margin-bottom: 0.5rem;">${o.title}</h4>
                                <span style="color: #64b000; font-weight: 700; font-size: 0.9rem; margin-top: auto; display: inline-flex; align-items: center; gap: 4px;">Läs inlägg →</span>
                            </div>
                        </a>`;
                    }).join('')}
                </div>
            </div>`;
        }

        const newsHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${n.title} | Mathörnet</title>
    <meta name="description" content="${n.metaDescription || n.excerpt || ''}">
    <meta property="og:title" content="${n.title} | Mathörnet">
    <meta property="og:description" content="${n.metaDescription || n.excerpt || ''}">
    <meta property="og:image" content="${n.featuredImage || 'img/mathornet_logo_ny_transparent.png'}">
    <meta property="og:type" content="article">
    <link rel="stylesheet" href="style_v5.css?v=8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .news-article-container {
            max-width: 860px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }
        .copy-link-btn:hover {
            background-color: #f3f4f6 !important;
            border-color: #d1d5db !important;
        }
    </style>
</head>
<body style="background-color: #f9fafb;">
    ${headerStr}

    <main style="padding-top: 2.5rem; padding-bottom: 6rem;">
        <div class="news-article-container">
            <!-- Navigation bar / Breadcrumbs -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <a href="nyheter" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #4b5563; text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 8px 16px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 50px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.2s ease;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                    <span>Tillbaka till alla nyheter</span>
                </a>
                <div style="font-size: 0.85rem; color: #9ca3af; display: flex; align-items: center; gap: 0.4rem;">
                    <a href="mathornet" style="color: #6b7280; text-decoration: none;">Hem</a>
                    <span>/</span>
                    <a href="nyheter" style="color: #6b7280; text-decoration: none;">Nyheter</a>
                </div>
            </div>

            <!-- Article Main Card -->
            <article style="background: #ffffff; padding: clamp(2rem, 5vw, 4rem); border-radius: 28px; box-shadow: 0 4px 25px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);">
                <!-- Meta tags row -->
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
                    <span style="background: rgba(100, 176, 0, 0.12); color: #4d8e00; padding: 4px 14px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Nyhet</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; color: #6b7280; font-size: 0.95rem; font-weight: 500;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                        ${dateStr}
                    </span>
                    <span style="color: #d1d5db;">•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; color: #6b7280; font-size: 0.95rem; font-weight: 500;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        2 min läsning
                    </span>
                </div>

                <!-- Title -->
                <h1 style="font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; line-height: 1.2; color: #111827; margin: 0 0 1.5rem 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em;">
                    ${n.title}
                </h1>

                <!-- Ingress / Excerpt (styled lead quote) -->
                ${n.excerpt ? `
                <div style="font-size: 1.25rem; line-height: 1.7; color: #374151; font-weight: 500; border-left: 4px solid #64b000; padding: 1.25rem 1.5rem; background: #fbfdf9; border-radius: 0 14px 14px 0; margin-bottom: 2.5rem;">
                    ${n.excerpt}
                </div>` : ''}

                <!-- Featured Image -->
                ${n.featuredImage ? `
                <div style="margin: 2rem 0 3rem; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); max-height: 500px;">
                    <img src="${n.featuredImage}" alt="${n.title}" style="width: 100%; height: 100%; max-height: 500px; object-fit: cover; display: block;">
                </div>` : ''}

                <!-- Article Content Blocks -->
                <div class="article-content">
                    ${blocksHtml}
                </div>

                <!-- Article Bottom Share & Actions -->
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 0.9rem; font-weight: 700; color: #374151;">Dela inlägg:</span>
                        <button class="copy-link-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Länk kopierad till urklipp!');" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 7px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #4b5563; cursor: pointer; transition: all 0.2s;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            Kopiera länk
                        </button>
                    </div>

                    <a href="nyheter" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #64b000; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        <span>Alla nyheter</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                </div>
            </article>

            <!-- More news recommendations -->
            ${recommendationsHtml}
        </div>
    </main>

    ${footerStr}
    <!-- Google Translate Script & Custom Logic -->
    <div id="google_translate_element" style="display:none;"></div>
    <script src="js/translate.js"></script>
    <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <script src="main_v5.js"></script>
</body>
</html>`;
        fs.writeFileSync(path.join(publicDir, `${n.slug}.html`), newsHtml);
    }

    // --- REBUILD RECEPT.HTML ---
    const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
    const publishedRecipes = recipes.filter(r => r.published !== false);
    const receptPath = path.join(publicDir, 'recept.html');
    let receptHtml = fs.readFileSync(receptPath, 'utf8');
    const featuredRegex = /<a [^>]*class="featured-post"[^>]*>[\s\S]*?<\/a>/i;

    if (publishedRecipes.length > 0) {
      const featuredRecipe = publishedRecipes[0];
      const otherRecipes = publishedRecipes;
      
      const featuredHtml = `
            <a href="${featuredRecipe.slug}" class="featured-post">
                <img src="${featuredRecipe.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" class="featured-bg" alt="${featuredRecipe.title}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: -1;">
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
      let newRecipesList = '';
      for (const r of otherRecipes) {
        newRecipesList += `
            <a href="${r.slug}" class="news-card-v2" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div class="news-img" style="height: 250px; overflow: hidden; position: relative;">
                    <img src="${r.featuredImage || 'img/mathornet_logo_ny_transparent.png'}" alt="${r.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                    <span style="position: absolute; bottom: 10px; right: 10px; background: var(--navy-bg); color: white; padding: 4px 10px; border-radius: 5px; font-weight: 600; font-size: 0.85rem;">⏱️ ${r.prepTime || ''}</span>
                </div>
                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${r.title}</h3>
                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${r.description || ''}</p>
                    <span class="btn" style="background: #64b000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; width: 100%; text-align: center; font-weight: bold; margin-top: auto;">Till receptet</span>
                </div>
            </a>\n`;
      }
      
      const gridRegex = /(<div class="news-grid-layout"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/main>)/i;
      const gridDisplay = otherRecipes.length > 0 ? '' : ' style="display: none;"';
      if (gridRegex.test(receptHtml)) {
        receptHtml = receptHtml.replace(gridRegex, `<div class="news-grid-layout"${gridDisplay}>\n${newRecipesList}            $2`);
      }
    } else {
      // Empty state: remove featured post and show friendly message in grid
      receptHtml = receptHtml.replace(featuredRegex, '');
      const emptyStateHtml = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; background: #fff; border-radius: 20px; border: 1px dashed #cbd5e1; margin-bottom: 3rem;">
                <div style="width: 64px; height: 64px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.75rem;">
                    🍽️
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; font-family: 'Outfit', sans-serif;">Inga recept publicerade just nu</h3>
                <p style="font-size: 1.05rem; color: #64748b; max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">Vi fyller snart på med läckra och autentiska recept från Mellanöstern. Håll utkik!</p>
                <a href="produkter" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #64b000; color: #fff; padding: 12px 24px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Utforska våra produkter</a>
            </div>\n`;
      const gridRegex = /(<div class="news-grid-layout"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/main>)/i;
      if (gridRegex.test(receptHtml)) {
        receptHtml = receptHtml.replace(gridRegex, `<div class="news-grid-layout">\n${emptyStateHtml}            $2`);
      }
    }
    fs.writeFileSync(receptPath, receptHtml);

    // Clean up any stale recipe html files that no longer exist in DB
    const activeRecipeFiles = new Set(recipes.map(r => `${r.slug}.html`));
    const allPublicFiles = fs.readdirSync(publicDir);
    const knownOldRecipeFiles = ['oxhj-rta.html', 'hummua.html', 'test.html'];
    for (const f of allPublicFiles) {
      if ((f.startsWith('recept-') || knownOldRecipeFiles.includes(f)) && f.endsWith('.html') && f !== 'recept.html') {
        if (!activeRecipeFiles.has(f)) {
          console.log(`Cleaning up deleted recipe static file: ${f}`);
          try { fs.unlinkSync(path.join(publicDir, f)); } catch(e) {}
        }
      }
    }

    // Clean up stale product files
    const activeProductFiles = new Set(products.map(p => `${cleanSlug(p.slug)}.html`));
    const knownOldProductFiles = [
      '17-5865468.html',
      'ahalna-jesper-testar-123.html',
      'fwefwefwe.html',
      'jesper-testar-123.html',
      'kuttle.html',
      'testarTESTAR123.html'
    ];
    for (const f of knownOldProductFiles) {
      if (!activeProductFiles.has(f) && fs.existsSync(path.join(publicDir, f))) {
        console.log(`Cleaning up stale product file: ${f}`);
        try { fs.unlinkSync(path.join(publicDir, f)); } catch(e) {}
      }
    }

    // Clean up stale news files
    const activeNewsFiles = new Set(news.map(n => `${n.slug}.html`));
    const knownOldNewsFiles = [
      'nyhet-arets-leverantor-2026.html',
      'nyhet-blu-grossist.html',
      'nyhet-hallbar-framtid.html',
      'nyhet-hostens-sortiment.html',
      'nyhet-ica-maxi-avtal.html',
      'nyhet-ny-produktionsanlaggning.html',
      'nyhet-ny-vd-utsedd.html',
      'nyhet-okad-produktion-veganskt.html',
      'nyhet-perfekta-falafeln.html',
      'nyhet-sommarbuffe.html',
      'nyhet-sponsrar-fotbollslag.html',
      'nyhet-staller-ut-pa-massa.html',
      'nytt-samarbete-med-webix.html'
    ];
    for (const f of knownOldNewsFiles) {
      if (!activeNewsFiles.has(f) && fs.existsSync(path.join(publicDir, f))) {
        console.log(`Cleaning up stale news file: ${f}`);
        try { fs.unlinkSync(path.join(publicDir, f)); } catch(e) {}
      }
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
    <meta name="description" content="Laga ${r.title}. ${r.prepTime ? 'Tid: ' + r.prepTime : ''}">
    <meta property="og:title" content="${r.title} | Mathörnet Recept">
    <meta property="og:description" content="Laga ${r.title}. ${r.prepTime ? 'Tid: ' + r.prepTime : ''}">
    <meta property="og:image" content="${r.featuredImage || 'img/mathornet_logo_ny_transparent.png'}">
    <meta property="og:type" content="article">
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
                <a href="mathornet" style="color: #666; text-decoration: none;">Hemsida</a> &gt; <a href="recept" style="color: #666; text-decoration: none;">Recept</a> &gt; <span style="color: #111; font-weight: 600;">${r.title}</span>
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
                    <a href="recept" class="btn btn-primary" style="background: #64b000; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold;">&larr; Tillbaka till alla recept</a>
                </div>
            </div>
        </article>
    </main>

    ${footerStr}
    <!-- Google Translate Script & Custom Logic -->
    <div id="google_translate_element" style="display:none;"></div>
    <script src="js/translate.js"></script>
    <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

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

    // --- BUILD SITEMAP & ROBOTS.TXT ---
    const siteUrl = 'https://www.mathornet.se'; // Change to actual production URL
    const sitemapUrls = [
        '/', '/mathornet', '/produkter', '/nyheter', '/recept', '/om-oss', '/aterforsaljare', '/hitta-oss', '/kontakt', '/jobba-hos-oss', '/faq', '/kopvillkor'
    ];
    products.forEach(p => sitemapUrls.push(`/${cleanSlug(p.slug)}`));
    news.forEach(n => sitemapUrls.push(`/${n.slug}`));
    recipes.forEach(r => sitemapUrls.push(`/${r.slug}`));

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
    
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml`;
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

    console.log('Website rebuilt successfully');
  } catch (error) {
    console.error('Failed to rebuild website:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
