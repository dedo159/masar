const fs = require('fs');
const content = `import { NextResponse } from "next/server";
import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const systemPrompt = \`أنت مدقق مهني وتقني واقعي وصارم (Technical Career Auditor) متخصص في تقييم طلاب وخريجي كليات تقنية المعلومات لفرص التدريب (Internships) ووظائف المطورين المبتدئين (Junior Roles).

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
  "readiness_score": <رقم صحيح بين 0 و 100>,
  "readiness_status": "<واحدة فقط من: غير جاهز | في مرحلة التطوير | جاهز لسوق العمل | إمكانيات عالية>",
  "verified_skills": ["<مهارة معتمدة 1>", "<مهارة معتمدة 2>", "<مهارة معتمدة 3>"],
  "strengths_summary": "<فقرة واحدة موجزة تلخص نقاط القوة المثبتة عملياً وأكاديمياً>",
  "critical_gaps": [
    {
      "skill": "<المهارة أو التقنية أو المفهوم الناقص>",
      "priority": "<High أو Medium أو Low>",
      "reason": "<سبب واقعي مباشر لأهميتها في سوق العمل الحالي للوظيفة المحددة>"
    }
  ],
  "actionable_next_step": {
    "recommended_project": "<فكرة مشروع تطبيقي محدد وعملي لسد الفجوة المهارية الأهم>",
    "project_impact": "<الزيادة التقديرية في نسبة الجاهزية، مثل: +15%>"
  }
}\`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      target_role, 
      completed_courses_list, 
      gpa, 
      completed_credit_hours, 
      total_credit_hours, 
      github_languages, 
      github_repos_count, 
      top_projects_descriptions, 
      self_declared_skills 
    } = body;

    const userPrompt = \`المسمى الوظيفي المستهدف: \${target_role}

السجل الأكاديمي:
- المساقات المنجزة: \${completed_courses_list}
- المعدل التراكمي: \${gpa} من 4.00
- الساعات المعتمدة المنجزة: \${completed_credit_hours} من أصل \${total_credit_hours}

بيانات GitHub والمشاريع:
- اللغات والتقنيات المستخدمة: \${github_languages}
- عدد المستودعات العامة: \${github_repos_count}
- ملخص أبرز المشاريع: \${top_projects_descriptions}
- المهارات التقنية المدخلة: \${self_declared_skills}

قم بالتدقيق الفوري وأرجع مصفوفة الـ JSON مباشرة.\`;

    // Using generateText because the prompt strictly tells the model to output JSON without formatting tags
    // We will parse it on our end
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1, // Low temperature for consistent JSON
    });

    let jsonResult;
    try {
      // In case the model accidentally outputs markdown tags despite instructions
      const cleanText = text.replace(/^\\s*\`\`\`json\\s*/i, '').replace(/\\s*\`\`\`\\s*$/, '').trim();
      jsonResult = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON from AI response", text);
      return NextResponse.json({ error: "Invalid JSON format from AI" }, { status: 500 });
    }

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("Readiness AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
`;
fs.writeFileSync('src/app/api/student/readiness/route.ts', content, 'utf8');
console.log('Created route.ts');