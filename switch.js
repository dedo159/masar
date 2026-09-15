const fs = require('fs');
const file = 'src/app/api/resume-ai/route.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace("import { createGoogleGenerativeAI } from '@ai-sdk/google';", "import { createOpenAI } from '@ai-sdk/openai';");
c = c.replace(/const google = createGoogleGenerativeAI\(\{\s*apiKey: process\.env\.GOOGLE_GENERATIVE_AI_API_KEY,\s*\}\);/g, const deepseekProvider = createOpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY,
}););
c = c.replace("const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;", "const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY;");
c = c.replace("Missing GOOGLE_GENERATIVE_AI_API_KEY in .env file", "Missing DEEPSEEK_API_KEY or OPENROUTER_API_KEY in .env file");
c = c.replace("model: google('gemini-2.5-flash'), // Using Gemini 2.5 Flash", "model: deepseekProvider(process.env.DEEPSEEK_MODEL || 'deepseek/deepseek-chat:free'), // Using DeepSeek Free");

fs.writeFileSync(file, c);
console.log('Switched to DeepSeek!');
