const fs = require('fs');

const products = [
    { id: 'sandwich-kubbe', title: 'Sandwich Kubbe', weight: '500g', img: 'sandwich kubbe.png', desc: 'Bulgur varvat med färs och tillagat i ugnen. En fantastiskt god rätt som hela familjen älskar.', nyhet: true },
    { id: 'kubbe-trabolsie', title: 'Kubbe Trabolsie', weight: '500g', img: 'kubbe trabolsie.png', desc: 'Klassisk friterad kött- och bulgurkroketter. Fyllda med en smakrik blandning av lök och kryddor.', nyhet: false },
    { id: 'kubbe-halab', title: 'Kubbe Halab', weight: '500g', img: 'kubbe halab.png', desc: 'Gyllene riskroketter fyllda med välsmakande färs. Perfekta till meze-bordet.', nyhet: false },
    { id: 'potatis-kubbe', title: 'Potatis Kubbe', weight: '400g', img: 'potatis kubbe.png', desc: 'Hemlagade potatiskroketter med kryddig fyllning. Krispiga på utsidan och mjuka inuti.', nyhet: false },
    { id: 'ris-kubbe', title: 'Ris Kubbe', weight: '400g', img: 'ris kubbe.png', desc: 'Fantastiskt goda och frasiga riskroketter. En klassiker från det orientaliska köket.', nyhet: false },
    { id: 'kubbe-mosel', title: 'Kubbe Mosel', weight: '600g', img: 'kubbe mosel.png', desc: 'Klassiska kokta Kubbe för en fyllig smak. Ett måste för den som älskar äkta husmanskost från Mellanöstern.', nyhet: false }
];

const indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');

// Extract header
const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';

// Extract footer
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

products.forEach(p => {
    let badgeHtml = p.nyhet ? '<span class="badge" style="position: absolute; top: 2rem; right: 2rem;">Nyhet</span>' : '';
    
    let html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=2">
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
                
                <span class="badge">Mat</span>
                <h1 class="product-title">${p.title}</h1>
                
                <p class="product-desc">${p.desc}</p>
                
                <div class="product-specs">
                    <span class="spec-label">Tillgänglig förpackning och storlek:</span>
                    <span class="spec-value">${p.weight}</span>
                </div>
                
                <div class="product-specs" style="border-bottom: 1px solid #eee; margin-bottom: 3rem;">
                    <span class="spec-label">EAN-kod:</span>
                    <span class="spec-value">7310350505685</span>
                </div>
                
                <div class="accordion">
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Ingredienser
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-inner">
                                Bulgur, nötfärs, lök, orientaliska kryddor, salt, solrosolja.
                                <div class="warning-text">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
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

        <section class="products-section" style="background-color: #fcfcfc;">
            <div class="container">
                <div class="section-header">
                    <h2>Se våra nyheter!</h2>
                    <a href="index.html" class="btn btn-red">Se alla produkter &rarr;</a>
                </div>
                <div class="products-grid">
                    <a href="sandwich-kubbe.html" class="product-card">
                        <span class="badge">Nyhet</span>
                        <div class="product-img-wrapper">
                            <img src="img/sandwich kubbe.png" alt="Sandwich Kubbe">
                        </div>
                        <div class="product-info">
                            <h3>Sandwich Kubbe</h3>
                            <div class="product-meta">
                                <span class="weight">500g</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>
                    
                    <a href="kubbe-trabolsie.html" class="product-card">
                        <div class="product-img-wrapper">
                            <img src="img/kubbe trabolsie.png" alt="Kubbe Trabolsie">
                        </div>
                        <div class="product-info">
                            <h3>Kubbe Trabolsie</h3>
                            <div class="product-meta">
                                <span class="weight">500g</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="kubbe-halab.html" class="product-card">
                        <div class="product-img-wrapper">
                            <img src="img/kubbe halab.png" alt="Kubbe Halab">
                        </div>
                        <div class="product-info">
                            <h3>Kubbe Halab</h3>
                            <div class="product-meta">
                                <span class="weight">500g</span>
                                <span class="read-more">Tryck för att läsa mer &rarr;</span>
                            </div>
                        </div>
                    </a>
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

console.log("Genererade 6 produktsidor.");
