const fs = require('fs');

function fixFile(filePath, regex, replacement) {
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(regex, replacement);
  fs.writeFileSync(filePath, c);
}

fixFile('src/app/(dashboard)/page.tsx', /title="[^"]+"/, 'title="مرحباً"');
