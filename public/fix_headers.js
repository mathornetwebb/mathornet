const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const correctLogoHtml = `
            <a href="index.html" class="logo">
                <img src="img/mathörnet logo.png" alt="Mathörnet Logotyp" class="main-logo">
            </a>`;

let updatedCount = 0;

for (const file of files) {
    if (file === 'index.html' || file === 'produkter.html') continue; // Redan korrekt
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Hitta felaktig logo HTML. Den brukar se ut ungefär:
    // <a href="index.html" class="logo">
    //     <!-- Using a text logo... -->
    //     <span ...>Mathörnet</span>
    // </a>
    
    const logoRegex = /<a href="index\.html" class="logo">[\s\S]*?<\/a>/;
    
    if (logoRegex.test(content)) {
        content = content.replace(logoRegex, correctLogoHtml.trim());
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated header logo in ${file}`);
    }
}

console.log(`\nSuccessfully updated ${updatedCount} files.`);
