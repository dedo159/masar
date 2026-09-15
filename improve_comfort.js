const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

// Update Light Theme Background to be softer
content = content.replace('--background: #ffffff;', '--background: #fafafa;');

// Smooth the card shadows even more for visual comfort
content = content.replace('shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]', 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]');
content = content.replace('shadow-[0_4px_12px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.05)]', 'shadow-[0_8px_24px_rgba(0,0,0,0.06)]');

fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log('Updated globals.css for visual comfort');