const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}
fs.writeFileSync('src/app/globals.css', content, 'utf8');