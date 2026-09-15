const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

// Replace the problematic backticks with unicode equivalent or properly escaped ones
content = content.replace("علامات التنسيق (```json أو ```)", "علامات التنسيق (\\`\\`\\`json أو \\`\\`\\`)");
// Ensure it's correctly replaced
fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');