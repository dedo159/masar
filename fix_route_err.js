const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

content = content.replace(
  'return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });',
  'return NextResponse.json({ error: `Internal Server Error: ${error.message || error}` }, { status: 500 });'
);

fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');