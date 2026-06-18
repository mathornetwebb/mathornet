const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const hamburgerHtml = `
            <button class="mobile-menu-toggle" aria-label="Öppna meny">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <nav class="main-nav">`;

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has the hamburger menu
    if (content.includes('class="mobile-menu-toggle"')) {
        continue;
    }
    
    // Replace <nav class="main-nav"> with the button + nav
    if (content.includes('<nav class="main-nav">')) {
        content = content.replace(/<nav class="main-nav">/, hamburgerHtml.trim());
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Added hamburger to ${file}`);
    }
}

console.log(`\nSuccessfully updated ${updatedCount} files.`);
