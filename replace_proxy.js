const fs = require('fs');
let content = fs.readFileSync('src/proxy.ts', 'utf8');
content = content.replace('export async function middleware', 'export async function proxy');
fs.writeFileSync('src/proxy.ts', content, 'utf8');