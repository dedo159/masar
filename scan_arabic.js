const fs = require('fs');
const path = require('path');
let count = 0;
function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (/[\u0600-\u06FF]/.test(content)) {
                count++;
            }
        }
    }
}
scanDir('src');
console.log("Files with Arabic text: " + count);