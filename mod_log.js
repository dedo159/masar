const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

content = content.replace(
  'console.error("Readiness AI Error:", error);',
  'console.error("Readiness AI Error:", error.message || error);'
);

fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');