const fs = require('fs');
const path = require('path');

// Fix mathornet.html and index.html by removing inline margin-right and fixing flex properties
const files = ['public/mathornet.html', 'public/index.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove margin-right: 32px from carousel-card
    content = content.replace(/margin-right:\s*32px;/g, '');
    
    // Remove gap from track inline styles if any
    content = content.replace(/gap:\s*2rem;/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed inline styles in ${file}`);
}

// Fix style_v5.css
const cssFile = 'public/style_v5.css';
let css = fs.readFileSync(cssFile, 'utf8');
// Remove margin-right from .carousel-card.news-card-v2
css = css.replace(/margin-right:\s*16px\s*!important;/g, '');
fs.writeFileSync(cssFile, css, 'utf8');
console.log('Fixed style_v5.css');

// Fix main_v5.js
const jsFile = 'public/main_v5.js';
let js = fs.readFileSync(jsFile, 'utf8');

// The gap calculation should add BOTH gap and margin-right if both exist!
// Let's modify updateCarousel to correctly measure the actual distance to the next element.
// Instead of calculating gap manually, we can just measure the distance between the left edge of item 0 and item 1!

let newJs = js.replace(/let gap = parseFloat\(trackStyle\.gap\) \|\| parseFloat\(itemStyle\.marginRight\) \|\| 0;/g, 
`let gap = 0;
            if (items.length > 1) {
                // The most reliable way to find the stride is measuring the distance between item 0 and item 1
                gap = items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().right;
            }`);

newJs = newJs.replace(/item\.style\.marginRight = "16px";/g, 'item.style.marginRight = "0px";');

fs.writeFileSync(jsFile, newJs, 'utf8');
console.log('Fixed main_v5.js');
