const fs = require('fs');
const path = require('path');

const recipeData = [
    {
        id: 'libanesisk-toum',
        title: 'Äkta Libanesisk Toum (Vitlökskräm)',
        img: 'recipe_toum_1781120942496.png',
        date: '10 jun 2026',
        category: 'Recept',
        time: '15 min',
        portions: '4 portioner',
        difficulty: 'Medel',
        excerpt: 'Den perfekta fluffiga vitlökskrämen som är ett absolut måste till kyckling och våra färdiga grillprodukter.',
        ingredients: [
            '4 vitlöksklyftor (gärna unga)',
            '1 tsk salt',
            '3 msk nypressad citronsaft',
            '3 dl neutral olja (t.ex. rapsolja)'
        ],
        instructions: [
            'Skala vitlöksklyftorna och ta bort eventuella gröna groddar.',
            'Lägg vitlök och salt i en matberedare. Mixa tills det blir en slät pasta.',
            'Tillsätt 1 msk citronsaft och mixa ytterligare.',
            'Börja hälla i oljan i en extremt tunn stråle medan maskinen är igång. Det är superviktigt att hälla långsamt för att emulsionen ska sätta sig!',
            'Varva försiktigt med resten av citronsaften tills du får en fluffig, vit kräm.'
        ]
    },
    {
        id: 'kramig-hummus',
        title: 'Krämig Hummus från grunden',
        img: 'recipe_hummus_1781120953317.png',
        date: '08 jun 2026',
        category: 'Recept',
        time: '30 min',
        portions: '6 portioner',
        difficulty: 'Enkel',
        excerpt: 'Silkeslen hummus med tahini och citron. Det självklara tillbehöret till nyfriterad falafel och varmt pitabröd.',
        ingredients: [
            '250 g torkade kikärtor (blötlagda över natten)',
            '1 tsk bikarbonat (till kokning)',
            '1,5 dl ljus tahini',
            '3 msk nypressad citronsaft',
            '2 vitlöksklyftor, pressade',
            '1 dl isvatten',
            'Salt efter smak'
        ],
        instructions: [
            'Skölj de blötlagda kikärtorna och koka dem mjuka tillsammans med bikarbonat i ca 1-2 timmar tills de är riktigt mjuka.',
            'Låt svalna. Mixa tahini, citronsaft och vitlök i en matberedare tills det ljusnar och blir fluffigt.',
            'Tillsätt isvattnet lite i taget under mixning.',
            'Vänd ner kikärtorna i tahiniblandningen och mixa i flera minuter tills du får en otroligt silkeslen kräm.',
            'Smaka av med salt och eventuellt mer citron.'
        ]
    },
    {
        id: 'shish-taouk-marinad',
        title: 'Shish Taouk – Kycklingmarinad',
        img: 'recipe_chicken_1781120971006.png',
        date: '05 jun 2026',
        category: 'Recept',
        time: '10 min',
        portions: '4 portioner',
        difficulty: 'Enkel',
        excerpt: 'En fräsch och smakrik marinad på yoghurt, vitlök, citron och tomatpuré som gör grillkycklingen oslagbar.',
        ingredients: [
            '800 g kycklingfilé eller lårfilé i bitar',
            '2 dl turkisk yoghurt',
            '3 msk olivolja',
            '4 pressade vitlöksklyftor',
            '1 msk tomatpuré',
            '1 tsk paprikapulver',
            '1 msk citronsaft',
            'Salt och svartpeppar'
        ],
        instructions: [
            'Skär kycklingen i jämna bitar, lämpliga för grillspett.',
            'Blanda yoghurt, olivolja, vitlök, tomatpuré, paprikapulver, citronsaft, salt och peppar i en stor skål.',
            'Vänd ner kycklingen i marinaden och se till att alla bitar är täckta.',
            'Täck skålen och låt marinera i kylen i minst 4 timmar, gärna över natten.',
            'Trä upp på spett och grilla tills kycklingen är helt genomstekt.'
        ]
    },
    {
        id: 'tabbouleh',
        title: 'Fräsch Tabbouleh (Persiljesallad)',
        img: 'recipe_tabbouleh_1781120980903.png',
        date: '01 jun 2026',
        category: 'Recept',
        time: '20 min',
        portions: '4 portioner',
        difficulty: 'Medel',
        excerpt: 'En explosion av smak med finhackad persilja, mynta, citron och bulgur. Det perfekta fräscha tillbehöret.',
        ingredients: [
            '3 stora knippen bladpersilja',
            '1 knippe färsk mynta',
            '0,5 dl fin bulgur',
            '4 fasta tomater',
            '3 salladslökar',
            '4 msk nypressad citronsaft',
            '4 msk god olivolja',
            'Salt och svartpeppar'
        ],
        instructions: [
            'Skölj bulgurn och blötlägg i kallt vatten i 10 minuter. Krama ur allt vatten.',
            'Finhacka persilja och mynta extremt fint. Använd en vass kniv (inga matberedare!).',
            'Finhacka tomater och salladslök i små, jämna tärningar.',
            'Blanda alla grönsaker och bulgur i en stor skål.',
            'Tillsätt olivolja, citronsaft, salt och peppar precis innan servering. Blanda väl.'
        ]
    },
    {
        id: 'baba-ganoush',
        title: 'Rökig Baba Ganoush',
        img: 'recipe_babaganoush_1781120991044.png',
        date: '28 maj 2026',
        category: 'Recept',
        time: '45 min',
        portions: '4 portioner',
        difficulty: 'Medel',
        excerpt: 'Grillad aubergine, tahini och vitlök i en krämig och rökig röra. Passar fantastiskt till grillat kött och bröd.',
        ingredients: [
            '2 stora auberginer',
            '2 msk ljus tahini',
            '1-2 vitlöksklyftor, pressade',
            '2 msk nypressad citronsaft',
            '2 msk olivolja',
            'Salt',
            'Persilja och granatäpplekärnor till garnering'
        ],
        instructions: [
            'Bränn auberginerna hela över öppen låga (gasspis eller grill) eller baka högt upp i ugnen (250°C) tills skalet är helt svart och innanmätet mjukt.',
            'Låt svalna något och gröp sedan ur köttet. Kassera skalet.',
            'Låt aubergineköttet rinna av i en sil i 10 minuter.',
            'Hacka eller mosa köttet grovt med en gaffel (mixa inte, baba ganoush ska ha textur).',
            'Rör i tahini, vitlök, citronsaft, olivolja och salt. Garnera med persilja och granatäpple.'
        ]
    },
    {
        id: 'tarator',
        title: 'Tarator (Sesamsås till Falafel)',
        img: 'recipe_tarator_1781121000889.png',
        date: '20 maj 2026',
        category: 'Recept',
        time: '5 min',
        portions: '4 portioner',
        difficulty: 'Enkel',
        excerpt: 'En snabb och nötig sås gjord på tahini, citron och vitlök som är klassikern att ringla över nygjord falafel.',
        ingredients: [
            '1 dl ljus tahini (sesampasta)',
            '0,5 dl nypressad citronsaft',
            '1 vitlöksklyfta, pressad',
            '0,5-1 dl vatten',
            'En nypa salt'
        ],
        instructions: [
            'Vispa ihop tahini, citronsaft och vitlök i en skål. Blandningen kommer först att tjockna och bli grynig.',
            'Tillsätt vattnet gradvis, lite i taget, medan du vispar konstant.',
            'Fortsätt vispa tills såsen ljusnar och får en slät, krämig och ringelbar konsistens.',
            'Smaka av med salt och eventuellt lite mer citron.'
        ]
    },
    {
        id: 'batata-harra',
        title: 'Batata Harra (Kryddig Potatis)',
        img: 'recipe_potatoes_1781121019492.png',
        date: '15 maj 2026',
        category: 'Recept',
        time: '35 min',
        portions: '4 portioner',
        difficulty: 'Medel',
        excerpt: 'Krispiga potatiskuber slungade i vitlök, koriander, chili och citron. En garanterad succé på middagsbordet.',
        ingredients: [
            '800 g fast potatis',
            'Neutral olja till fritering',
            '4 vitlöksklyftor, pressade',
            '1 röd chili, finhackad (eller 1 tsk chiliflakes)',
            '1 stor knippe färsk koriander, grovhackad',
            '3 msk olivolja',
            '2 msk nypressad citronsaft',
            'Salt'
        ],
        instructions: [
            'Skala och skär potatisen i jämna kuber, ca 2x2 cm.',
            'Fritera potatiskuberna i varm olja tills de är gyllene och krispiga. Låt rinna av på hushållspapper.',
            'Värm olivoljan i en stor stekpanna. Fräs vitlök och chili i någon minut utan att de tar färg.',
            'Vänd ner den friterade potatisen och rör om så de täcks av vitlöksoljan.',
            'Stäng av värmen, tillsätt koriander, citronsaft och salt. Blanda väl och servera genast.'
        ]
    },
    {
        id: 'hembakat-pitabrod',
        title: 'Hembakat fluffigt Pitabröd',
        img: 'recipe_pita_1781121029267.png',
        date: '10 maj 2026',
        category: 'Recept',
        time: '90 min',
        portions: '8 bröd',
        difficulty: 'Svår',
        excerpt: 'Inget slår ett varmt, nygräddat pitabröd att doppa i din hummus eller att fylla med frasig falafel och grönsaker.',
        ingredients: [
            '25 g färsk jäst',
            '3 dl fingervarmt vatten',
            '1 tsk socker',
            '1 tsk salt',
            '2 msk olivolja',
            '7-8 dl vetemjöl special'
        ],
        instructions: [
            'Smula jästen i en bunke. Häll över det fingervarma vattnet och rör tills jästen lösts upp. Tillsätt socker och olivolja.',
            'Arbeta in vetemjölet och saltet lite i taget. Knåda degen smidig i maskin i ca 8-10 minuter.',
            'Låt degen jäsa övertäckt till dubbel storlek i ca 45 minuter.',
            'Sätt ugnen på 250°C (gärna med en pizzasten eller en uppochnedvänd plåt inne i ugnen).',
            'Dela degen i 8 bitar. Rulla till bollar och kavla ut varje boll till en tunn cirkel (ca 3-4 mm tjock).',
            'Grädda bröden 1-2 i taget i mitten av ugnen i 4-5 minuter. De kommer att blåsa upp sig som bollar! Låt svalna under bakduk.'
        ]
    },
    {
        id: 'krispig-fattoush',
        title: 'Krispig Fattoush (Brödsallad)',
        img: 'recipe_fattoush_1781121468759.png',
        date: '02 maj 2026',
        category: 'Recept',
        time: '20 min',
        portions: '4 portioner',
        difficulty: 'Enkel',
        excerpt: 'Mellanösterns godaste sallad! Fylld med färska grönsaker, sumak och toppad med krispiga pitabrödskrutonger.',
        ingredients: [
            '2 st libabröd (eller pitabröd)',
            '2 hjärtsalladshuvuden',
            '4 salladstomater',
            '1 gurka',
            '1 röd paprika',
            '4 rädisor',
            '1 knippe persilja och mynta',
            '2 tsk sumak (krydda)',
            '3 msk granatäppelsirap',
            '3 msk olivolja',
            '1 msk citronsaft',
            'Salt och peppar'
        ],
        instructions: [
            'Klipp pitabrödet i fyrkanter och fritera dem krispiga i olja (eller rosta dem i ugnen med lite olivolja).',
            'Skär grönsakerna i grova bitar. Finhacka örterna.',
            'Blanda en dressing av granatäppelsirap, olivolja, citronsaft, sumak, salt och peppar i botten av en stor skål.',
            'Vänd ner alla grönsaker och örter i dressingen.',
            'Toppa salladen med det friterade brödet strax innan servering så det behåller sin krispighet.'
        ]
    }
];

const publicDir = path.join(__dirname, 'public');
let indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
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

fs.writeFileSync(path.join(publicDir, 'recept.html'), receptHtml);

// Generate individual recipe pages (Arla-inspired redesign)
recipeData.forEach(recipe => {
    
    const ingredientsHtml = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('\n                    ');
    const instructionsHtml = recipe.instructions.map((inst, idx) => `
                <div class="instruction-step">
                    <div class="step-number">${idx + 1}</div>
                    <div class="step-text">${inst}</div>
                </div>`).join('');

    const postHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${recipe.title} | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=6">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #faf9f6; margin: 0; padding: 0; }
        
        /* Hero Section */
        .post-hero { 
            position: relative; 
            height: 70vh; 
            min-height: 500px; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: flex-end;
        }
        .post-hero-bg { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            object-fit: cover; z-index: 0; 
        }
        .post-overlay { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)); 
            z-index: 1; 
        }
        
        /* Overlapping Glassmorphism Card */
        .recipe-header-card {
            position: relative;
            z-index: 2;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 3rem 4rem;
            border-radius: 24px;
            text-align: center;
            max-width: 900px;
            width: 90%;
            transform: translateY(30%);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .recipe-title {
            font-family: 'Outfit', sans-serif;
            font-size: 3.5rem;
            font-weight: 700;
            color: #111;
            margin-bottom: 1.5rem;
            line-height: 1.1;
        }
        .recipe-excerpt {
            font-size: 1.25rem;
            color: #555;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        .recipe-meta-tags {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            font-weight: 600;
            color: #333;
            flex-wrap: wrap;
        }
        .recipe-meta-tag {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #f0f0f0;
            padding: 0.6rem 1.2rem;
            border-radius: 50px;
            font-size: 0.95rem;
        }

        /* 2-Column Layout */
        .recipe-content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4rem;
            max-width: 1200px;
            margin: 12rem auto 6rem;
            padding: 0 2rem;
        }
        @media(min-width: 992px) {
            .recipe-content-grid {
                grid-template-columns: 350px 1fr;
            }
        }

        /* Ingredients */
        .ingredients-panel {
            background: #fff;
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            border-top: 5px solid var(--navy-bg, #0b2545);
            height: fit-content;
            position: sticky;
            top: 100px;
        }
        .ingredients-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #111;
        }
        .ingredients-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .ingredients-list li {
            padding: 1rem 0;
            border-bottom: 1px solid #eaeaea;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1.1rem;
            color: #333;
        }
        .ingredients-list li:last-child {
            border-bottom: none;
        }
        .ingredients-list li::before {
            content: '✓';
            color: #27ae60;
            font-weight: bold;
        }

        /* Instructions */
        .instructions-panel {
            padding-top: 1rem;
        }
        .instructions-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: #111;
        }
        .instruction-step {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }
        .step-number {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            background: var(--navy-bg, #0b2545);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
        }
        .step-text {
            font-size: 1.25rem;
            line-height: 1.8;
            color: #333;
            padding-top: 0.5rem;
        }
        
        /* Action buttons */
        .recipe-actions {
            margin-top: 6rem;
            text-align: center;
            padding-bottom: 4rem;
        }
        .btn-outline {
            display: inline-block;
            border: 2px solid var(--navy-bg, #0b2545);
            color: var(--navy-bg, #0b2545);
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1.1rem;
        }
        .btn-outline:hover {
            background: var(--navy-bg, #0b2545);
            color: white;
        }
        
        /* Header Fix for absolute positioned hero */
        .main-header {
            position: absolute !important;
            width: 100%;
            z-index: 100;
            background: transparent !important;
        }
        .main-header.scrolled {
            position: fixed !important;
            background: var(--navy-bg, #0b2545) !important;
        }
        
        @media(max-width: 768px) {
            .recipe-header-card {
                padding: 2rem;
                transform: translateY(20%);
                width: 95%;
            }
            .recipe-title { font-size: 2.2rem; }
            .recipe-content-grid { margin-top: 8rem; gap: 3rem; }
            .post-hero { height: 60vh; }
        }
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
            
            <div class="recipe-header-card">
                <h1 class="recipe-title">${recipe.title}</h1>
                <p class="recipe-excerpt">${recipe.excerpt}</p>
                <div class="recipe-meta-tags">
                    <span class="recipe-meta-tag">⏱️ ${recipe.time}</span>
                    <span class="recipe-meta-tag">🍽️ ${recipe.portions}</span>
                    <span class="recipe-meta-tag">👨‍🍳 ${recipe.difficulty}</span>
                </div>
            </div>
        </section>
        
        <div class="recipe-content-grid">
            <aside class="ingredients-panel">
                <h2 class="ingredients-title">Ingredienser</h2>
                <ul class="ingredients-list">
                    ${ingredientsHtml}
                </ul>
            </aside>
            
            <section class="instructions-panel">
                <h2 class="instructions-title">Gör så här</h2>
                ${instructionsHtml}
                
                <div class="recipe-actions">
                    <a href="recept.html" class="btn-outline">&larr; Tillbaka till alla recept</a>
                </div>
            </section>
        </div>
    </main>
    
    ${footer}
    <script src="main.js"></script>
    <script>
        // Make header solid on scroll
        window.addEventListener('scroll', function() {
            var header = document.querySelector('.main-header');
            if(window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    </script>
</body>
</html>`;
    fs.writeFileSync(path.join(publicDir, `recept-${recipe.id}.html`), postHtml);
});

console.log("Recipe pages generated successfully with new Arla-inspired design.");
