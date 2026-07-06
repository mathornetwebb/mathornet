const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function updateNav(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateNav(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if it already has 'Hitta oss'
            if (!content.includes('href="hitta-oss.html"')) {
                // Find all instances of: <li><a href="kontakt.html">Kontakt</a></li>
                // and insert <li><a href="hitta-oss.html">Hitta oss</a></li> before it
                content = content.replace(
                    /<li><a href="kontakt\.html">Kontakt<\/a><\/li>/g,
                    '<li><a href="hitta-oss.html">Hitta oss</a></li>\n                    <li><a href="kontakt.html">Kontakt</a></li>'
                );
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', file);
            }
        }
    });
}

updateNav(publicDir);
console.log('Done');
