const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');
content = content.replace("model: google('gemini-2.5-flash'),", "// @ts-expect-error\n      model: google('gemini-2.5-flash'),");
fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');