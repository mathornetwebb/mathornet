const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Använd en flexibel regex som hanterar ev. encoding-tecken för "ö" och "ä" i Återförsäljare
    const regex1 = /<a href="#">([^<]*?terf[^<]*?ljare)<\/a>/gi;
    
    // Även "Nyheter" och "Om Oss" i footern kanske är "#" ?
    const regex2 = /<a href="#">([^<]*?m [Oo]ss)<\/a>/gi;
    const regex3 = /<a href="#">(Nyheter)<\/a>/gi;
    
    let changed = false;
    
    if (regex1.test(content)) {
        content = content.replace(regex1, '<a href="aterforsaljare.html">$1</a>');
        changed = true;
    }
    if (regex2.test(content)) {
        content = content.replace(regex2, '<a href="om-oss.html">$1</a>');
        changed = true;
    }
    if (regex3.test(content)) {
        content = content.replace(regex3, '<a href="nyheter.html">$1</a>');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated links in ${file}`);
    }
}

console.log(`\nSuccessfully updated ${updatedCount} files.`);
