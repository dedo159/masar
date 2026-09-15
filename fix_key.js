const fs = require('fs');
let content = fs.readFileSync('src/app/api/student/readiness/route.ts', 'utf8');

// Remove top-level google
content = content.replace(
`const google = createGoogleGenerativeAI();`,
``
);

// Add it inside POST
const oldPost = `export async function POST(req: Request) {
  try {`;

const newPost = `export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env file" }, { status: 500 });
    }
    const google = createGoogleGenerativeAI({ apiKey });`;

content = content.replace(oldPost, newPost);

fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');