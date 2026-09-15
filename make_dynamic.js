const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

// Ensure dynamic
if (!content.includes('export const dynamic')) {
    content = 'export const dynamic = "force-dynamic";\n' + content;
}

fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');