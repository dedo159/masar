const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

content = content.replace(
`const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});`,
`const google = createGoogleGenerativeAI();`
);

fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');