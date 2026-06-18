const fs = require('fs');

const recipeData = [
    {
        id: 'libanesisk-toum',
        title: 'Äkta Libanesisk Toum (Vitlökskräm)',
        img: 'recipe_toum_1781120942496.png',
        date: '10 jun 2026',
        category: 'Recept',
        time: '15 min',
        excerpt: 'Den perfekta fluffiga vitlökskrämen som är ett absolut måste till kyckling och våra färdiga grillprodukter.',
        content: '<p>Toum är magi i en skål. Hemligheten ligger i att hälla oljan extremt långsamt...</p>'
    },
    {
        id: 'kramig-hummus',
        title: 'Krämig Hummus från grunden',
        img: 'recipe_hummus_1781120953317.png',
        date: '08 jun 2026',
        category: 'Recept',
        time: '30 min',
        excerpt: 'Silkeslen hummus med tahini och citron. Det självklara tillbehöret till nyfriterad falafel och varmt pitabröd.',
        content: '<p>Blötlägg kikärterna över natten för bäst resultat...</p>'
    },
    {
        id: 'shish-taouk-marinad',
        title: 'Shish Taouk – Kycklingmarinad',
        img: 'recipe_chicken_1781120971006.png',
        date: '05 jun 2026',
        category: 'Recept',
        time: '10 min',
        excerpt: 'En fräsch och smakrik marinad på yoghurt, vitlök, citron och tomatpuré som gör grillkycklingen oslagbar.',
        content: '<p>Låt kycklingen marinera i minst 4 timmar...</p>'
    },
    {
        id: 'tabbouleh',
        title: 'Fräsch Tabbouleh (Persiljesallad)',
        img: 'recipe_tabbouleh_1781120980903.png',
        date: '01 jun 2026',
        category: 'Recept',
        time: '20 min',
        excerpt: 'En explosion av smak med finhackad persilja, mynta, citron och bulgur. Det perfekta fräscha tillbehöret.',
        content: '<p>Nyckeln är att inte fuska med hackandet...</p>'
    },
    {
        id: 'baba-ganoush',
        title: 'Rökig Baba Ganoush',
        img: 'recipe_babaganoush_1781120991044.png',
        date: '28 maj 2026',
        category: 'Recept',
        time: '45 min',
        excerpt: 'Grillad aubergine, tahini och vitlök i en krämig och rökig röra. Passar fantastiskt till grillat kött och bröd.',
        content: '<p>Bränn auberginen över öppen låga för den rätta smaken...</p>'
    },
    {
        id: 'tarator',
        title: 'Tarator (Sesamsås till Falafel)',
        img: 'recipe_tarator_1781121000889.png',
        date: '20 maj 2026',
        category: 'Recept',
        time: '5 min',
        excerpt: 'En snabb och nötig sås gjord på tahini, citron och vitlök som är klassikern att ringla över nygjord falafel.',
        content: '<p>Blanda tahini och citron först, det kommer att tjockna innan du tillsätter vatten...</p>'
    },
    {
        id: 'batata-harra',
        title: 'Batata Harra (Kryddig Potatis)',
        img: 'recipe_potatoes_1781121019492.png',
        date: '15 maj 2026',
        category: 'Recept',
        time: '35 min',
        excerpt: 'Krispiga potatiskuber slungade i vitlök, koriander, chili och citron. En garanterad succé på middagsbordet.',
        content: '<p>Fritera potatisen först för bäst textur...</p>'
    },
    {
        id: 'hembakat-pitabrod',
        title: 'Hembakat fluffigt Pitabröd',
        img: 'recipe_pita_1781121029267.png',
        date: '10 maj 2026',
        category: 'Recept',
        time: '90 min',
        excerpt: 'Inget slår ett varmt, nygräddat pitabröd att doppa i din hummus eller att fylla med frasig falafel och grönsaker.',
        content: '<p>Grädda på hög värme så att de blåser upp sig som bollar...</p>'
    },
    {
        id: 'krispig-fattoush',
        title: 'Krispig Fattoush (Brödsallad)',
        img: 'recipe_fattoush_1781121468759.png',
        date: '02 maj 2026',
        category: 'Recept',
        time: '20 min',
        excerpt: 'Mellanösterns godaste sallad! Fylld med färska grönsaker, sumak och toppad med krispiga pitabrödskrutonger.',
        content: '<p>Fritera gärna dina pitabrödskrutonger för extra mycket krisp...</p>'
    }
];

let indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');
const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const featured = recipeData[0];
const others = recipeData.slice(1);

let othersHtml = '';
others.forEach(recipe => {
    othersHtml += `
            <a href="recept-${recipe.id}.html" class="news-card-v2" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div class="news-img" style="height: 250px; overflow: hidden; position: relative;">
                    <img src="img/${recipe.img}" alt="${recipe.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 10px; right: 10px; background: var(--navy-bg); color: white; padding: 4px 10px; border-radius: 5px; font-weight: 600; font-size: 0.85rem;">⏱️ ${recipe.time}</span>
                </div>
                <div class="news-content" style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #000;">${recipe.title}</h3>
                    <p style="color: #555; margin-bottom: 2rem; flex-grow: 1; line-height: 1.6;">${recipe.excerpt}</p>
                    <span class="btn btn-primary" style="text-align: center; width: 100%; background: var(--navy-bg); color: #fff; border: none;">Till receptet</span>
                </div>
            </a>`;
});

const receptHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recept | Mathörnet - Autentisk mat från Mellanöstern</title>
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
        .featured-content h2 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .featured-content p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
        .featured-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; font-weight: 600; }
        
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
                <h1>Våra Recept</h1>
                <p>Upptäck hjärtat i Mellanösterns matkultur. Här har vi samlat våra absolut bästa och mest autentiska recept – från fluffig toum till perfekt hummus. Perfekta tillbehör till våra produkter!</p>
            </div>
            
            <a href="recept-${featured.id}.html" class="featured-post">
                <img src="img/${featured.img}" class="featured-bg" alt="${featured.title}">
                <div class="featured-overlay"></div>
                <div class="featured-content">
                    <div class="featured-meta">
                        <span class="category" style="background: var(--navy-bg); color: #fff; padding: 6px 16px; border-radius: 50px; font-size: 0.95rem;">Veckans utvalda</span>
                        <span>⏱️ ${featured.time}</span>
                    </div>
                    <h2>${featured.title}</h2>
                    <p>${featured.excerpt}</p>
                    <span class="btn btn-primary" style="border: none; padding: 0.8rem 2rem;">Till receptet</span>
                </div>
            </a>
            
            <div class="news-grid-layout">
                ${othersHtml}
            </div>
        </div>
    </main>
    
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;

fs.writeFileSync('f:/Antigravity/Mathörnet/public/recept.html', receptHtml);

// Generate individual recipe pages
recipeData.forEach(recipe => {
    const postHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${recipe.title} | Mathörnet</title>
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
            <img src="img/${recipe.img}" class="post-hero-bg" alt="${recipe.title}">
            <div class="post-overlay"></div>
            <div class="post-hero-content">
                <h1 class="post-title">${recipe.title}</h1>
                <div class="post-meta">Tillagningstid: ${recipe.time}</div>
            </div>
        </section>
        
        <div class="post-content-container">
            <p class="lead" style="font-size: 1.4rem; font-weight: 500; margin-bottom: 2rem;">${recipe.excerpt}</p>
            ${recipe.content}
            
            <div style="margin-top: 4rem; text-align: center;">
                <a href="recept.html" class="btn btn-navy">&larr; Tillbaka till alla recept</a>
            </div>
        </div>
    </main>
    
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;
    fs.writeFileSync(`f:/Antigravity/Mathörnet/public/recept-${recipe.id}.html`, postHtml);
});

console.log("Recipe pages generated successfully.");
