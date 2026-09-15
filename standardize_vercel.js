const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Standardize shapes
            content = content.replace(/\brounded-2xl\b/g, 'rounded-lg');
            content = content.replace(/\brounded-xl\b/g, 'rounded-lg');
            
            // Standardize colors
            content = content.replaceAll('#3B82F6', '#0070f3');
            content = content.replaceAll('#EF4444', '#ff5b4f');
            content = content.replaceAll('#059669', '#0070f3'); // replace old emerald with Vercel Blue
            content = content.replaceAll('#10B981', '#0070f3');
            
            // Some specific Vercel UI tweaks (like thin borders instead of thick ones)
            content = content.replaceAll('border-2 ', 'border ');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}
processDir('./src');