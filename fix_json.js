const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

const oldTryCatch = `    try {
      // In case the model accidentally outputs markdown tags despite instructions
      const cleanText = text.replace(/^\\s*\`\`\`json\\s*/i, '').replace(/\\s*\`\`\`\\s*$/, '').trim();
      jsonResult = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON from AI response", text);
      return NextResponse.json({ error: "Invalid JSON format from AI" }, { status: 500 });
    }`;

const newTryCatch = `    try {
      let cleanText = text.trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      jsonResult = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON from AI response", text);
      return NextResponse.json({ error: "Invalid JSON format from AI: " + e.message }, { status: 500 });
    }`;

content = content.replace(oldTryCatch, newTryCatch);
fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');