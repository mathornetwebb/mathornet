const fs = require('fs');

const products = [
    {
        id: 'sandwich-kubbe',
        title: 'Sandwich Kubbe',
        img: 'sandwich kubbe.png',
        desc: 'Bulgur varvat med färs och tillagat i ugnen. En fantastiskt god rätt som hela familjen älskar.',
        nyhet: true,
        deg: 'Nötrulle 30%, bulgur-vete 35%, durumvete 35%, vatten, salt',
        fyllning: 'Nötfärs 40%, sojaprotein 30%, lök 30%, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '450 gram'
    },
    {
        id: 'kubbe-trabolsie',
        title: 'Kubbe Trabolsie',
        img: 'kubbe trabolsie.png',
        desc: 'Klassisk friterad kött- och bulgurkroketter. Fyllda med en smakrik blandning av lök och kryddor.',
        nyhet: false,
        deg: 'Bulgur-Vete 40%, lök 20%, nötrulle 20%, paprikapuré (mild capiapaprika), salt, vatten',
        fyllning: 'Nötfärs 40%, sojaprotein 30%, lök 30%, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '500 gram'
    },
    {
        id: 'kubbe-halab',
        title: 'Kubbe Halab',
        img: 'kubbe halab.png',
        desc: 'Gyllene riskroketter fyllda med välsmakande färs. Perfekta till meze-bordet.',
        nyhet: false,
        deg: 'Ris 100%, Gurkmeja, Salt, Vatten',
        fyllning: 'Nötfärs 45%, sojaprotein 25%, lök 30%, persilja, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '500 gram'
    },
    {
        id: 'potatis-kubbe',
        title: 'Potatis Kubbe',
        img: 'potatis kubbe.png',
        desc: 'Hemlagade potatiskroketter med kryddig fyllning. Krispiga på utsidan och mjuka inuti.',
        nyhet: false,
        deg: 'Potatis 70%, ströbröd 20%, rismjöl 10%, salt, vatten',
        fyllning: 'Nötfärs 40%, sojaprotein 30%, lök 30%, persilja, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '500 gram'
    },
    {
        id: 'ris-kubbe',
        title: 'Ris Kubbe',
        img: 'ris kubbe.png',
        desc: 'Fantastiskt goda och frasiga riskroketter. En klassiker från det orientaliska köket.',
        nyhet: false,
        deg: 'Ris 65%, nötrulle 35%, salt, vatten',
        fyllning: 'Nötfärs 40%, sojaprotein 30%, lök 30%, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '500 gram'
    },
    {
        id: 'kubbe-mosel',
        title: 'Kubbe Mosel',
        img: 'kubbe mosel.png',
        desc: 'Klassiska kokta Kubbe för en fyllig smak. Ett måste för den som älskar äkta husmanskost från Mellanöstern.',
        nyhet: false,
        deg: 'Nötrulle 40%, bulgur-vete 30%, durumvete 30%, vatten, salt',
        fyllning: 'Nötfärs 70%, lök 30%, salt, svartpeppar, kanel, nejlika, muskotnöt, kardemumma, E621, kryddpeppar, ingefära',
        allergener: 'Nötter, sesamfrön och gluten',
        vikt: '450 gram'
    }
];

const indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');

const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';

const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

products.forEach(p => {
    const otherProducts = products.filter(prod => prod.id !== p.id);
    let carouselHtml = '';
    otherProducts.forEach(prod => {
        let badge = prod.nyhet ? '<span class="badge">Nyhet</span>' : '';
        carouselHtml += `
                    <a href="${prod.id}.html" class="product-card carousel-card">
                        ${badge}
                        <div class="product-img-wrapper">
                            <img src="img/${prod.img}" alt="${prod.title}">
                        </div>
                        <div class="product-info">
                            <h3>${prod.title}</h3>
                            <div class="product-meta">
                                <span class="weight">${prod.vikt}</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>`;
    });

    let badgeHtml = p.nyhet ? '<span class="badge" style="position: absolute; top: 2rem; right: 2rem;">Nyhet</span>' : '';
    let html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=3">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${header}

    <main>
        <section class="product-page-layout">
            <div class="product-image-col">
                ${badgeHtml}
                <img src="img/${p.img}" alt="${p.title}">
            </div>
            
            <div class="product-info-col">
                <div class="breadcrumbs">
                    <a href="index.html">Hemsida</a> &gt; <a href="index.html">Produkter</a> &gt; ${p.title}
                </div>
                
                <h1 class="product-title">${p.title}</h1>
                
                <p class="product-desc">${p.desc}</p>
                
                <div class="product-specs">
                    <span class="spec-label">Kvantitet/förpackning:</span>
                    <span class="spec-value">-</span>
                </div>
                
                <div class="product-specs" style="border-bottom: 1px solid #eee; margin-bottom: 3rem;">
                    <span class="spec-label">Nettovikt:</span>
                    <span class="spec-value">${p.vikt}</span>
                </div>
                
                <div class="accordion">
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Ingredienser
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-inner">
                                <p style="margin-bottom: 0.5rem"><strong>Deg:</strong> ${p.deg}</p>
                                <p style="margin-bottom: 0.5rem"><strong>Fyllning:</strong> ${p.fyllning}</p>
                                <p><strong>Allergener:</strong> ${p.allergener}</p>
                                <div class="warning-text">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    Se alltid produktinformationen på förpackningen.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Näringsinnehåll per 100g
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-inner">
                                Energi: 1200 kJ / 285 kcal<br>
                                Fett: 12g<br>
                                varav mättat fett: 4g<br>
                                Kolhydrater: 30g<br>
                                varav sockerarter: 1g<br>
                                Protein: 14g<br>
                                Salt: 1.2g
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Fler produkter Karusell -->
        <section class="products-section carousel-section" style="background-color: #fcfcfc;">
            <div class="container">
                <div class="section-header">
                    <h2>Fler produkter</h2>
                    <a href="index.html" class="btn btn-red">Se alla produkter &rarr;</a>
                </div>
                
                <div class="carousel-wrapper">
                    <div class="carousel-viewport">
                        <div class="carousel-track">
                            ${carouselHtml}
                        </div>
                    </div>
                    
                    <div class="carousel-controls">
                        <button class="carousel-btn prev-btn" aria-label="Föregående">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="carousel-dots">
                            <button class="dot active" data-index="0" aria-label="Sida 1"></button>
                            <button class="dot" data-index="1" aria-label="Sida 2"></button>
                            <button class="dot" data-index="2" aria-label="Sida 3"></button>
                        </div>
                        <button class="carousel-btn next-btn" aria-label="Nästa">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    ${footer}
    <script src="main.js"></script>
</body>
</html>`;

    fs.writeFileSync('f:/Antigravity/Mathörnet/public/' + p.id + '.html', html);
});

console.log("Uppdaterade alla sidor.");
