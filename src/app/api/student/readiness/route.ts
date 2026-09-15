export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";



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
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env file" }, { status: 500 });
    }
    const google = createGoogleGenerativeAI({ apiKey });
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

    const userPrompt = `المسمى الوظيفي المستهدف: ${target_role}

السجل الأكاديمي:
- المساقات المنجزة: ${completed_courses_list}
- المعدل التراكمي: ${gpa} من 4.00
- الساعات المعتمدة المنجزة: ${completed_credit_hours} من أصل ${total_credit_hours}

بيانات GitHub والمشاريع:
- اللغات والتقنيات المستخدمة: ${github_languages}
- عدد المستودعات العامة: ${github_repos_count}
- ملخص أبرز المشاريع: ${top_projects_descriptions}
- المهارات التقنية المدخلة: ${self_declared_skills}

قم بالتدقيق الفوري وأرجع مصفوفة الـ JSON مباشرة.`;

    // Using generateText because the prompt strictly tells the model to output JSON without formatting tags
    // We will parse it on our end
    const { text } = await generateText({
      // @ts-expect-error
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1, // Low temperature for consistent JSON
    });

    let jsonResult;
    try {
      let cleanText = text.trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      jsonResult = JSON.parse(cleanText);
    } catch (e: any) {
      console.error("Failed to parse JSON from AI response", text);
      return NextResponse.json({ error: "Invalid JSON format from AI: " + e.message }, { status: 500 });
    }

    return NextResponse.json(jsonResult);
  } catch (error: any) {
    console.error("Readiness AI Error:", error.message || error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message || error}` }, { status: 500 });
  }
}
