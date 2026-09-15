const fs = require('fs');
const extracted = JSON.parse(fs.readFileSync('extracted_11.json', 'utf8'));
let indexContent = fs.readFileSync('src/lib/translations/index.ts', 'utf8');

const arStart = indexContent.indexOf('ar: {');
const enStart = indexContent.indexOf('en: {');

if (arStart !== -1 && enStart !== -1) {
    let arAddition = "";
    for (let ns in extracted.ar) {
        arAddition += `\n    ${ns}: ` + JSON.stringify(extracted.ar[ns], null, 6) + ",";
    }
    let enAddition = "";
    for (let ns in extracted.en) {
        enAddition += `\n    ${ns}: ` + JSON.stringify(extracted.en[ns], null, 6) + ",";
    }
    
    indexContent = indexContent.replace('ar: {', 'ar: {' + arAddition);
    indexContent = indexContent.replace('en: {', 'en: {' + enAddition);
    
    fs.writeFileSync('src/lib/translations/index.ts', indexContent, 'utf8');
    console.log("Merged translations into index.ts");
} else {
    console.log("Error merging");
}