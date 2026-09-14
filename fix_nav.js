const fs = require('fs');
let c = fs.readFileSync('src/components/layout/navigation.tsx', 'utf8');

// Replace all garbled labels that might exist in navigation.tsx
c = c.replace(/label: "[?]+"|label: "\?\?\?\?\?\?\?\?\?"/g, 'label: "\u0625\u0639\u0644\u0627\u0646\u0627\u062A"');

fs.writeFileSync('src/components/layout/navigation.tsx', c);
