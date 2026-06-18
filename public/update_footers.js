const fs = require('fs');
const path = require('path');

const dir = __dirname;
const indexHtmlPath = path.join(dir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Extract footer
const footerRegex = /<footer class="site-footer">[\s\S]*?<\/footer>/;
const match = indexHtmlContent.match(footerRegex);
if (!match) {
    console.error("Could not find footer in index.html");
    process.exit(1);
}
const newFooter = match[0];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
let count = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, () => newFooter); // use function to avoid issues with special replacement patterns
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Uppdaterade footern i ${file}`);
        count++;
    } else {
        console.log(`Hittade ingen footer i ${file}`);
    }
}

console.log(`Klart! Uppdaterade totalt ${count} filer.`);
