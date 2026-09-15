const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/deals/page.tsx', 'utf8');
content = content.replace('</Badge>', '</span>');
content = content.replace('</Badge>', '</span>');
content = content.replace('</Badge>', '</span>');
content = content.replace('</Badge>', '</span>');
fs.writeFileSync('src/app/(dashboard)/deals/page.tsx', content, 'utf8');