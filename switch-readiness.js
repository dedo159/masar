const fs = require('fs');
const file = 'src/app/api/student/readiness/route.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('import { createGoogleGenerativeAI } from "@ai-sdk/google";', 'import { createOpenAI } from "@ai-sdk/openai";');

c = c.replace(/const apiKey = process\.env\.GOOGLE_GENERATIVE_AI_API_KEY;/g, 'const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY;');
c = c.replace(/Missing GOOGLE_GENERATIVE_AI_API_KEY/g, 'Missing DEEPSEEK_API_KEY or OPENROUTER_API_KEY');

c = c.replace(/const google = createGoogleGenerativeAI\(\{ apiKey \}\);/g, const deepseekProvider = createOpenAI({
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    }););

c = c.replace(/model: google\('gemini-2\.5-flash'\),/g, "model: deepseekProvider(process.env.DEEPSEEK_MODEL || 'deepseek/deepseek-chat:free'),");

fs.writeFileSync(file, c);
console.log('Switched Readiness to DeepSeek!');
