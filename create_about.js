const fs = require('fs');

const indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');
const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const aboutContent = `
    <!-- Om Oss Hero -->
    <section class="about-hero">
        <div class="container">
            <h1>En passion för mat som gått i arv sedan 1945</h1>
            <p>Mathörnet i Strängnäs är en förlängning av årtionden av familjeerfarenhet inom livsmedelsproduktion. Vi förenar ett genuint mathantverk med modern tillverkning för att erbjuda Sverige de absolut bästa smakerna från Mellanöstern.</p>
        </div>
    </section>

    <!-- Historien (3 block) -->
    <section class="zigzag-section">
        <div class="container">
            <!-- Block 1: 1945 -->
            <div class="zigzag-row">
                <div class="zigzag-text">
                    <h2>Rötterna i Irak (1945)</h2>
                    <p>Vår resa började redan 1945 i Irak, när morföräldrarna Selma Hanna Dawood och Raouf Rassam lade grunden till familjens livsmedelstillverkning. Selmas djupa förståelse för smaker och Raoufs orubbliga krav på råvarukvalitet skapade produkter som snabbt blev älskade av folket. Det var kompromisslös kärlek till bra mat, för vanligt folk.</p>
                </div>
                <div class="zigzag-img">
                    <img src="img/mathörnet historia.png" alt="Mathörnet historia">
                </div>
            </div>
            <!-- Block 2: Expansion -->
            <div class="zigzag-row reverse">
                <div class="zigzag-text">
                    <h2>Från familjekök till världsledande aktör</h2>
                    <p>Med tiden klev sonen Nabil Rassam in och transformerade verksamheten till vad som idag är Nabil Foods – en världsledande miljardkoncern. Nabil Foods levererar inte bara mat av högsta kvalitet till stora delar av världen, utan är också djupt engagerade i samhällsutveckling och mänskliga rättigheter. Mathörnet i Strängnäs bygger stolt vidare på detta arv, med fullt stöd och löpande samarbete från Nabil och hans team.</p>
                </div>
                <div class="zigzag-img">
                    <img src="img/hist_exp.png" alt="Expansion och Nabil Foods">
                </div>
            </div>
            <!-- Block 3: Nutid -->
            <div class="zigzag-row">
                <div class="zigzag-text">
                    <h2>Mathörnet i Strängnäs (Nutid)</h2>
                    <p>Den 1 juni 2026 slår vi upp portarna till vår nya produktionsanläggning i Strängnäs. Med toppmodern utrustning bygger vi en effektiv produktionslinje med en fantastisk arbetsmiljö. Vår matexpert Fade Allose och brodern Yousif står redo att blanda ingredienserna, förfina klassikerna och experimentera fram helt nya, spännande produkter för den svenska marknaden.</p>
                </div>
                <div class="zigzag-img">
                    <img src="img/hist_mod.png" alt="Mathörnet i Strängnäs">
                </div>
            </div>
        </div>
    </section>

    <!-- Företag, Ekonomi & Hållbarhet (3 kort) -->
    <section class="vision-cards-section">
        <div class="container">
            <h2 class="section-title">Nutid, Företag & Miljö</h2>
            <div class="vision-cards-grid">
                <div class="vision-card">
                    <img src="img/about_vision.png" alt="Produkter">
                    <div class="vision-card-content">
                        <h3>Våra Produkter</h3>
                        <p>Vi tillverkar och färdiglagar autentisk mat såsom Kubbah Traboulsie, ostrullar, piroger och minipizzor. Utöver våra älskade klassiker lanserar vi även en helt ny vegetarisk linje baserad på nyskapande falafelvarianter. Allt tillagas på plats och fryses in direkt för maximal fräschör.</p>
                    </div>
                </div>
                <div class="vision-card">
                    <img src="img/about_partner.png" alt="Företag och Ekonomi">
                    <div class="vision-card-content">
                        <h3>Företag & Framtidstro</h3>
                        <p>Mathörnet i Strängnäs AB drivs av Yosef Fidan. Med ett starkt driv, en kompetent personalstyrka och värdefull stöttning från Almi har vi skapat de bästa förutsättningarna för att växa. Vår ambition är att förse närområdet med kvalitetsmat, och på sikt även exportera våra innovationer.</p>
                    </div>
                </div>
                <div class="vision-card">
                    <img src="img/card_val.png" alt="Miljö och Säkerhet">
                    <div class="vision-card-content">
                        <h3>Miljö & Säkerhet</h3>
                        <p>Kvalitet innebär trygghet. Genom ett tätt samarbete med ledande miljö- och livsmedelskonsulter säkerställer vi att vår produktion, hantering av råvaror och restprodukter inte bara följer regelverken, utan håller den absolut högsta standarden för framtida certifieringar.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Ny CTA Section -->
    <section class="cta-section">
        <div class="container">
            <h2>Välkommen till Mathörnet!</h2>
            <p>Detta är vår historia och vår framtid. Vi finns alltid tillgängliga för dialog, och när vi väl är igång är du varmt välkommen att besöka oss i Strängnäs. Redo att växa med oss?</p>
            <a href="kontakt.html" class="btn btn-navy">Kontakta oss</a>
        </div>
    </section>
`;

const html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Om oss | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=${Date.now()}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${header}
    <main>
        ${aboutContent}
    </main>
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;

fs.writeFileSync('f:/Antigravity/Mathörnet/public/om-oss.html', html);
console.log("Skapade om-oss.html");
