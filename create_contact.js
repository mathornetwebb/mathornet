const fs = require('fs');

const indexHtml = fs.readFileSync('f:/Antigravity/Mathörnet/public/index.html', 'utf8');
const headerMatch = indexHtml.match(/<header class="main-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '';
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const contactContent = `
    <!-- Hero / Contact Form Section -->
    <section class="contact-form-section contact-hero-wrapper">
        <div class="container" style="width: 100%; display: flex; justify-content: center;">
            <div class="contact-wrapper">
                <h2>Hör av dig till oss!</h2>
                <p>Oavsett om du är intresserad av att bli återförsäljare eller har frågor om våra produkter – hör av dig via formuläret nedan så kontaktar vi dig inom kort.</p>
                
                <form class="about-contact-form" action="#" method="POST">
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="company">Företag (frivilligt)</label>
                            <input type="text" id="company" name="company" placeholder="Företagets namn">
                        </div>
                        <div class="form-group half">
                            <label for="name">Kontaktperson *</label>
                            <input type="text" id="name" name="name" placeholder="Ditt namn" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="email">E-post *</label>
                            <input type="email" id="email" name="email" placeholder="din@email.se" required>
                        </div>
                        <div class="form-group half">
                            <label for="phone">Telefonnr *</label>
                            <input type="tel" id="phone" name="phone" placeholder="+46 70 000 00 00" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address">Adress (frivilligt)</label>
                        <input type="text" id="address" name="address" placeholder="Gatuadress">
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="zip">Postnr (frivilligt)</label>
                            <input type="text" id="zip" name="zip" placeholder="123 45">
                        </div>
                        <div class="form-group half">
                            <label for="city">Ort (frivilligt)</label>
                            <input type="text" id="city" name="city" placeholder="Stad">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="message">Meddelande</label>
                        <textarea id="message" name="message" rows="4" placeholder="Här kan du skriva din fråga eller berätta mer om ditt ärende..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-navy" style="width:100%; padding: 1rem; font-size: 1.1rem; border: none; border-radius: 5px; cursor:pointer;">Skicka förfrågan</button>
                </form>
            </div>
        </div>
    </section>
`;

const html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kontakt | Mathörnet</title>
    <link rel="stylesheet" href="style.css?v=${Date.now()}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    ${header}
    <main>
        ${contactContent}
    </main>
    ${footer}
    <script src="main.js"></script>
</body>
</html>`;

fs.writeFileSync('f:/Antigravity/Mathörnet/public/kontakt.html', html);
console.log("Skapade kontakt.html");
