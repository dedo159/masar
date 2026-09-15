const { generateText } = require("ai");
const { createGoogleGenerativeAI } = require("@ai-sdk/google");
require("dotenv").config({ path: ".env" });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const systemPrompt = `أنت مدقق مهني وتقني واقعي وصارم (Technical Career Auditor) متخصص في تقييم طلاب وخريجي كليات تقنية المعلومات لفرص التدريب (Internships) ووظائف المطورين المبتدئين (Junior Roles).

مهمتك: تحليل السجل الأكاديمي للطالب، ومستودعات مشاريع GitHub الخاصة به، ومساره المهني المستهدف، ثم حساب "مؤشر الجاهزية لسوق العمل" بدقة وبدون أي مجاملة أو تضخيم.

معايير التقييم:
1. الأساس الأكاديمي (30%): المساقات المنجزة في علوم الحاسوب والبرمجة (OOP، هياكل البيانات، قواعد البيانات، الشبكات، الخوارزميات).
2. الإثبات العملي عبر GitHub ومشاريع الكود (40%): الاستمرارية، واقعية المشاريع ونضجها (ليست مجرد تطبيقات منسوخة من شروحات)، وجود توثيق وهندسة معمارية جيدة للكود.
3. مطابقة متطلبات السوق (30%): الفجوة المهارية الفعلية بين ما يتقنه الطالب حالياً وبين المهارات المطلوبة في شركات التقنية لنفس المسمى المستهدف.

قيود الإخراج الصارمة:
- الإجابة يجب أن تكون حصراً ككائن JSON صالح للقراءة (Valid JSON Object).
- لا تكتب أي مقدمات، خاتمات، أو تعليقات نصية خارج الـ JSON، ولا تستخدم علامات التنسيق (\`\`\`json أو \`\`\`).
- جميع النصوص والشروحات داخل الحقول يجب أن تكون بلغة عربية تقنية، واضحة ومباشرة.

هيكل الـ JSON المطلوب بدقة:
{
  "readiness_score": 85,
  "readiness_status": "جاهز لسوق العمل",
  "verified_skills": ["Skill 1", "Skill 2", "Skill 3"],
  "strengths_summary": "Summary",
  "critical_gaps": [
    {
      "skill": "Skill",
      "priority": "High",
      "reason": "Reason"
    }
  ],
  "actionable_next_step": {
    "recommended_project": "Project",
    "project_impact": "+15%"
  }
}`;

const userPrompt = `المسمى الوظيفي المستهدف: Junior Frontend Developer

السجل الأكاديمي:
- المساقات المنجزة: Math, OOP
- المعدل التراكمي: 3.5 من 4.00
- الساعات المعتمدة المنجزة: 90 من أصل 130

بيانات GitHub والمشاريع:
- اللغات والتقنيات المستخدمة: JS, React
- عدد المستودعات العامة: 5
- ملخص أبرز المشاريع: A simple app
- المهارات التقنية المدخلة: React

قم بالتدقيق الفوري وأرجع مصفوفة الـ JSON مباشرة.`;

async function test() {
  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1,
    });
    console.log("Raw Response:");
    console.log(text);
    const cleanText = text.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/, '').trim();
    JSON.parse(cleanText);
    console.log("\nJSON parsed successfully!");
  } catch(e) {
    console.error("Failed:", e);
  }
}
test();