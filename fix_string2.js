const fs = require('fs');

function fixFile(filePath, regex, replacement) {
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(regex, replacement);
  fs.writeFileSync(filePath, c);
}

fixFile('src/components/layout/navigation.tsx', /label: "[^"]+"/g, (match) => {
  if (match.includes("label: \"")) {
    if (!match.includes("t.nav")) { // Only replace hardcoded strings like "?????????"
      return 'label: "الإعلانات"';
    }
  }
  return match;
});
