const fs = require('fs');

const newsData = [
    {
        id: 'hostens-sortiment',
        title: 'Höstens utvalda sortiment',
        img: 'news_1_1780604259746.png',
        date: '24 sep 2026',
        category: 'Nyhet',
        excerpt: 'Vi är stolta över att presentera vårt uppdaterade sortiment inför hösten, med fokus på värmande och smakrika klassiker för restauranger.',
        content: '<p>Här kommer hela artikeln om sortimentet...</p>'
    },
    {
        id: 'sponsrar-fotbollslag',
        title: 'Mathörnet sponsrar lokala FC',
        img: 'news_2_1780604270066.png',
        date: '12 aug 2026',
        category: 'Nyhet',
        excerpt: 'Vi är oerhört stolta över att gå in som huvudsponsor för den lokala fotbollsklubben och stötta ungdomsidrotten i regionen.',
        content: '<p>Vi på Mathörnet brinner för lokalsamhället...</p>'
    },
    {
        id: 'blu-grossist',
        title: 'Nu hittar ni oss hos BLU Grossist!',
        img: 'retailer_1_1780604249865.png',
        date: '01 jul 2026',
        category: 'Nyhet',
        excerpt: 'Vi är glada att meddela att BLU Grossist nu erbjuder Mathörnets fulla sortiment för restaurang och storkök.',
        content: '<p>Nu kan restauranger i hela landet...</p>'
    },
    {
        id: 'ny-produktionsanlaggning',
        title: 'Vi utökar med ny produktionsanläggning',
        img: 'hero_feast_1780604012322.png',
        date: '15 jun 2026',
        category: 'Nyhet',
        excerpt: 'För att möta den enorma efterfrågan från landets grossister slår vi nu upp portarna till en ny toppmodern anläggning.',
        content: '<p>I den nya anläggningen...</p>'
    },
    {
        id: 'arets-leverantor-2026',
        title: 'Mathörnet nominerade till Årets Leverantör',
        img: 'award_ceremony.png',
        date: '28 maj 2026',
        category: 'Nyhet',
        excerpt: 'Det är med stor glädje vi kan meddela att vi blivit nominerade till det prestigefyllda priset Årets Leverantör 2026 i livsmedelsbranschen.',
        content: '<p>Tack till alla våra samarbetspartners...</p>'
    },
    {
        id: 'hallbar-framtid',
        title: 'Vårt nya hållbarhetslöfte: 100% grön energi',
        img: 'green_energy_factory.png',
        date: '14 apr 2026',
        category: 'Nyhet',
        excerpt: 'Som ett led i vårt miljöarbete övergår samtliga av våra produktionsanläggningar till att drivas helt på förnybar sol- och vindkraft.',
        content: '<p>Miljön är viktig för oss...</p>'
    },
    {
        id: 'ica-maxi-avtal',
        title: 'Rikstäckande avtal med ICA Maxi klart',
        img: 'retailer_1_1780604249865.png',
        date: '02 mar 2026',
        category: 'Nyhet',
        excerpt: 'Nu blir våra populära färdigrätter ännu mer lättillgängliga. Ett nytt avtal innebär att Mathörnet snart finns i kyldiskarna hos alla ICA Maxi i Sverige.',
        content: '<p>Detta är en stor milstolpe...</p>'
    },
    {
        id: 'staller-ut-pa-massa',
        title: 'Träffa Mathörnet på årets stora matmässa',
        img: 'food_exhibition.png',
        date: '18 feb 2026',
        category: 'Nyhet',
        excerpt: 'Kom förbi vår monter på branschens största fackmässa! Vi bjuder på smakprov från hela vårt sortiment och presenterar flera nyheter.',
        content: '<p>Vi ser fram emot att träffa er...</p>'
    },
    {
        id: 'okad-produktion-veganskt',
        title: 'Vi fördubblar produktionen av våra veganska alternativ',
        img: 'vegan_production.png',
        date: '05 jan 2026',
        category: 'Nyhet',
        excerpt: 'Efterfrågan på plantbaserat fortsätter att skjuta i höjden. Nu fördubblar vi kapaciteten för vår veganska produktlinje.',
        content: '<p>Detta innebär att...</p>'
    }
];

// Sort by date could be complex, assuming array is pre-sorted (latest first).

// 1. Generate index.html carousel
let indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');

let carouselHtml = `
                <div class="carousel-wrapper">
                    <div class="carousel-viewport" style="overflow: hidden;">
                        <div class="carousel-track" style="display: flex; transition: transform 0.5s ease-in-out;">`;

newsData.forEach(news => {
    carouselHtml += `
                            <a href="nyhet-${news.id}.html" class="carousel-card news-card-v2" style="flex: 0 0 calc(33.333% - 22px); min-width: 300px; margin-right: 32px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                                <div class="news-img" style="height: 250px; overflow: hidden;">
                                    <img src="img/${news.img}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                                    <div class="news-meta" style="font-size: 0.85rem; color: #666; margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
                                        <span class="date">${news.date}</span>
                                        <span class="divider">|</span>
                                        <span class="category" style="color: var(--navy-bg); font-weight: 600;">${news.category}</span>
                                    </div>
                                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${news.title}</h3>
                                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${news.excerpt}</p>
                                    <span class="btn btn-navy" style="text-align: center; width: 100%;">Läs inlägg</span>
                                </div>
                            </a>`;
});

carouselHtml += `
                        </div>
                    </div>
                    <div class="carousel-controls" style="display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 3rem;">
                        <button class="carousel-btn prev-btn" aria-label="Föregående" style="background: none; border: 1px solid #ddd; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy-bg);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="carousel-dots" style="display: flex; gap: 0.5rem;">
                            <!-- Dots generated by JS -->
                        </div>
                        <button class="carousel-btn next-btn" aria-label="Nästa" style="background: none; border: 1px solid #ddd; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy-bg);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>`;

// Replace in index.html
const regex = /<!-- NEWS CAROUSEL START -->[\s\S]*?<!-- NEWS CAROUSEL END -->/;
indexHtml = indexHtml.replace(regex, `<!-- NEWS CAROUSEL START -->\n${carouselHtml}\n<!-- NEWS CAROUSEL END -->`);
fs.writeFileSync('f:/Antigravity/Mathörnet/public/index.html', indexHtml);

// 2. Generate nyheter.html
const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const featured = newsData[0];
const others = newsData.slice(1);

let othersHtml = '';
others.forEach(news => {
    othersHtml += `
            <a href="nyhet-${news.id}.html" class="news-card-v2" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div class="news-img" style="height: 250px; overflow: hidden;">
                    <img src="img/${news.img}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                    <div class="news-meta" style="font-size: 0.85rem; color: #666; margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
                        <span class="date">${news.date}</span>
                        <span class="divider">|</span>
                        <span class="category" style="color: var(--navy-bg); font-weight: 600;">${news.category}</span>
                    </div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${news.title}</h3>
                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${news.excerpt}</p>
                    <span class="btn btn-navy" style="text-align: center; width: 100%;">Läs inlägg</span>
                </div>
            </a>`;
});

const nyheterHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nyheter | Mathörnet - Autentisk mat från Mellanöstern</title>
    <link rel="stylesheet" href="style.css?v=4">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .page-header { padding: 60px 0 20px; }
        .page-header h1 { font-size: 3.5rem; font-weight: 800; color: #000; margin-bottom: 1rem; }
        .page-header p { font-size: 1.25rem; color: #555; }
        
        .featured-post { position: relative; border-radius: 24px; overflow: hidden; height: 500px; margin-bottom: 4rem; display: flex; align-items: flex-end; }
        .featured-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .featured-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1; }
        .featured-content { position: relative; z-index: 2; padding: 4rem; color: #fff; max-width: 800px; }
        .featured-content h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .featured-content p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
        .featured-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; font-weight: 600; }
        
        .filter-bar { display: none; } /* Döljer filterraden eftersom sidan endast är för nyheter */
        
        .news-grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 6rem; }
    </style>
</head>
<body>
    <!-- Preloader -->
    <div id="page-preloader" class="preloader">
        <div class="loader"></div>
    </div>
    ${header}
    
    <main>
        <div class="container">
            <div class="page-header">
                <h1>Nyheter</h1>
                <p>Håll dig uppdaterad med det senaste från Mathörnet. Här delar vi spännande produktnyheter, insikter för branschen och uppdateringar kring vårt sortiment av autentisk mat från Mellanöstern.</p>
            </div>
            
            <a href="nyhet-${featured.id}.html" class="featured-post">
                <img src="img/${featured.img}" class="featured-bg" alt="${featured.title}">
                <div class="featured-overlay"></div>
                <div class="featured-content">
                    <div class="featured-meta">
                        <span class="category" style="background: var(--navy-bg); padding: 4px 12px; border-radius: 50px; font-size: 0.85rem;">${featured.category}</span>
                        <span>${featured.date}</span>
                    </div>
                    <h2>${featured.title}</h2>
                    <p>${featured.excerpt}</p>
                    <span class="btn btn-primary" style="border: none; padding: 0.8rem 2rem;">Läs inlägg</span>
                </div>
            </a>
            
            <!-- Filterraden är borttagen -->
            
            <div class="news-grid-layout">
                ${othersHtml}
            </div>
        </div>
    </main>
    
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;

fs.writeFileSync('f:/Antigravity/Mathörnet/public/nyheter.html', nyheterHtml);

// 3. Generate individual post pages
newsData.forEach(news => {
    const postHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${news.title} | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=4">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .post-hero { position: relative; height: 60vh; min-height: 400px; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; }
        .post-hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .post-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.45); z-index: 1; }
        .post-hero-content { position: relative; z-index: 2; max-width: 800px; padding: 0 2rem; }
        .post-title { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; }
        .post-meta { font-size: 1.1rem; font-weight: 500; opacity: 0.9; }
        .post-content-container { max-width: 800px; margin: 4rem auto 6rem; padding: 0 2rem; font-size: 1.2rem; line-height: 1.8; color: #333; }
    </style>
</head>
<body>
    <!-- Preloader -->
    <div id="page-preloader" class="preloader">
        <div class="loader"></div>
    </div>
    ${header}
    
    <main>
        <section class="post-hero">
            <img src="img/${news.img}" class="post-hero-bg" alt="${news.title}">
            <div class="post-overlay"></div>
            <div class="post-hero-content">
                <h1 class="post-title">${news.title}</h1>
                <div class="post-meta">${news.category} | ${news.date}</div>
            </div>
        </section>
        
        <div class="post-content-container">
            <p class="lead" style="font-size: 1.4rem; font-weight: 500; margin-bottom: 2rem;">${news.excerpt}</p>
            ${news.content}
            
            <div style="margin-top: 4rem; text-align: center;">
                <a href="nyheter.html" class="btn btn-navy">&larr; Tillbaka till Nyheter</a>
            </div>
        </div>
    </main>
    
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;
    fs.writeFileSync(`f:/Antigravity/Mathörnet/public/nyhet-${news.id}.html`, postHtml);
});

console.log("News pages and index.html carousel updated successfully.");
