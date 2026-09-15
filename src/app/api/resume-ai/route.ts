import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
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

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const systemPrompt = `أنت خبير توظيف تقني ومدرب مهني (Senior Technical Recruiter & Elite Career Coach).
هدفك هو مساعدة الطالب على بناء سيرة ذاتية احترافية، متوافقة مع أنظمة التوظيف (ATS) وقوية جداً.
**يجب أن تتحدث مع المستخدم باللغة العربية دائماً وبأسلوب مشجع واحترافي.**
لديك القدرة على تحديث بيانات السيرة الذاتية لحظياً بالإضافة إلى القدرة على تغيير تصميم السيرة الذاتية (اللون والخط).

### قواعد صارمة:
1. التحدث باللغة العربية فقط في ردودك، ولكن يمكنك كتابة المصطلحات التقنية بالإنجليزية.
2. استخدم صيغة Google (X-Y-Z) لكتابة الإنجازات: "أنجزت [X] كما يقاس بـ [Y] من خلال فعل [Z]".
3. لا تستخدم الكلمات الإنشائية الضعيفة، وركز على الأرقام والنتائج.
4. اطلب من المستخدم أرقاماً (مثال: تقليل وقت التحميل 20٪).
5. عندما يطلب المستخدم تعديلاً (حتى لو كان تغيير لون أو خط السيرة)، قم **دائماً** باستدعاء الأداة (Tool) المناسبة لتنفيذ التعديل على الفور.
6. اجعل ردودك قصيرة، مركزة، ومحفزة.
7. **CRITICAL LANGUAGE RULE (TRANSLATION):** You MUST always chat with the user in Arabic. HOWEVER, any content you write, update, or add to the resume using the tools MUST BE IN PROFESSIONAL ENGLISH. If the user provides their experience or summary in Arabic, TRANSLATE it to English before calling the tool. The final resume must be 100% English.

You have access to the user's current resume state (passed in context or implicitly through tools). When modifying, use the tools provided.`;

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  const resumeData = body.resumeData || null;

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY in .env file' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await streamText({
    // @ts-expect-error - Interface mismatch between older ai package and new @ai-sdk/google
    model: google('gemini-2.5-flash'), // Using Gemini 2.5 Flash
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
