import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { 
  updateBasicsSchema, 
  updateSummarySchema, 
  updateSkillsSchema, 
  addOrUpdateProjectSchema, 
  deleteProjectSchema, 
  updateBulletPointSchema,
  updateEducationSchema,
  updateCertificationsSchema
} from '@/lib/resume/types';

// Depending on the key, we can use openai or gemini. Using openai format since we installed @ai-sdk/openai.
// In reality, this requires OPENAI_API_KEY. We'll use a placeholder or assume it's in the environment.
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

const systemPrompt = `You are a Senior Technical Recruiter & Elite Career Coach specializing in IT and Software Engineering.
Your goal is to help the user build an ATS-friendly, highly impactful resume.
You interact conversationally, but you ALSO proactively call tools to modify the user's resume JSON state.

### strict Rules:
1. Use Google's X-Y-Z formula for bullet points: "Accomplished [X] as measured by [Y], by doing [Z]".
2. NO FLUFF. Remove weak words like "passionate", "team player", "hard worker".
3. NO PROGRESS BARS for skills. Just list technical skills by category (Languages, Frameworks, Databases, Tools).
4. Proactively ask for and invent (if user agrees) technical metrics (e.g., "improved query speed by 40%", "reduced latency by 200ms", "scaled to 10k users").
5. When the user asks to update something, ALWAYS call the appropriate tool to update the JSON state immediately, then reply confirming the change.
6. Keep your conversational responses concise, encouraging, and focused on actionable improvements.

You have access to the user's current resume state (passed in context or implicitly through tools). When modifying, use the tools provided.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'), // Or any capable model
    system: systemPrompt,
    messages,
    tools: {
      update_basics: tool({
        description: "Update the user's basic contact and target role information.",
        parameters: updateBasicsSchema,
      }),
      update_summary: tool({
        description: "Update the professional summary. Max 3 lines. Impact-driven.",
        parameters: updateSummarySchema,
      }),
      update_skills: tool({
        description: "Update the technical skills list by categories.",
        parameters: updateSkillsSchema,
      }),
      add_or_update_project: tool({
        description: "Add a new project or update an existing one. Use strong X-Y-Z bullets.",
        parameters: addOrUpdateProjectSchema,
      }),
      delete_project: tool({
        description: "Delete a project by its ID.",
        parameters: deleteProjectSchema,
      }),
      update_bullet_point: tool({
        description: "Targeted update for a single bullet point inside a project.",
        parameters: updateBulletPointSchema,
      }),
      update_education: tool({
        description: "Update the education history.",
        parameters: updateEducationSchema,
      }),
      update_certifications: tool({
        description: "Update the certifications.",
        parameters: updateCertificationsSchema,
      }),
    },
  });

  return result.toDataStreamResponse();
}
