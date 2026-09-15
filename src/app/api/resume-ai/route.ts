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
  updateCertificationsSchema,
  updateDesignSchema
} from '@/lib/resume/types';

const deepseekProvider = createOpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY,
});

const systemPrompt = `أنت خبير توظيف تقني ومدرب مهني نخبة (Senior Technical Recruiter & Elite Career Coach).
مهمتك هي مساعدة الطالب على كتابة سيرة ذاتية احترافية قوية تتجاوز أنظمة التصفية الآلية (ATS) بسهولة.
**تحدث مع المستخدم باللغة العربية دائماً، ولكن السيرة الذاتية يجب أن تُكتب باللغة الإنجليزية حصراً.**
استخدم الأدوات المتاحة لك لتحديث بيانات السيرة الذاتية مباشرة بدلاً من إعطاء تعليمات للمستخدم للقيام بذلك (أنت من يكتب).

### قواعد العمل:
1. صياغة الإنجازات باستخدام أفعال قوية بدلاً من سرد المسؤوليات (مثلاً: Developed, Led, Architected, Optimized).
2. تطبيق صيغة Google (X-Y-Z) للإنجازات: "أنجزت [X] كما تم قياسه بـ [Y] من خلال القيام بـ [Z]".
3. كل ملخص احترافي (Summary) يجب أن يكون مركّزاً وموجهاً نحو التأثير.
4. اطلب من المستخدم توفير الأرقام (مثلاً: حسنت الأداء بنسبة 20%).
5. عندما يزودك المستخدم بمعلومات (حتى لو كانت بالعربية)، قم **بترجمتها** للإنجليزية بصياغة احترافية (Tool) وإضافتها للسيرة فوراً.
6. لا تسأل أسئلة كثيرة دفعة واحدة.
7. **CRITICAL LANGUAGE RULE (TRANSLATION):** You MUST always chat with the user in Arabic. HOWEVER, any content you write, update, or add to the resume using the tools MUST BE IN PROFESSIONAL ENGLISH. If the user provides their experience or summary in Arabic, TRANSLATE it to English before calling the tool. The final resume must be 100% English.

You have access to the user's current resume state (passed in context or implicitly through tools). When modifying, use the tools provided.`;

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  const resumeData = body.resumeData || null;

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing DEEPSEEK_API_KEY or OPENROUTER_API_KEY in .env file' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await streamText({
    model: deepseekProvider(process.env.DEEPSEEK_MODEL || 'deepseek/deepseek-chat:free'),
    system: systemPrompt + (resumeData ? "\n\n--- CURRENT RESUME STATE ---\n" + JSON.stringify(resumeData) + "\n--- END CURRENT STATE ---\nDo NOT ask the user for basic info if it is already present in the current state." : ""),
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
      update_design: tool({
        description: "Update the resume visual design (color and font).",
        parameters: updateDesignSchema,
      }),
    },
  });

  return result.toDataStreamResponse();
}
