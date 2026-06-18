const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');
const footer = index.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];
let ater = fs.readFileSync('aterforsaljare.html', 'utf8');
ater = ater.replace(/<footer class="main-footer">[\s\S]*?<\/footer>/, footer);
fs.writeFileSync('aterforsaljare.html', ater);
console.log('Fixed aterforsaljare.html');
