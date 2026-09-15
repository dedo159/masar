export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const systemPrompt = `أنت مدقق مسار مهني تقني (Technical Career Auditor) تقوم من خلاله بتقييم جاهزية طلاب الجامعة الأردنية للتقديم على فرص التدريب (Internships) أو الوظائف المبتدئة (Junior Roles).

مهمتك: تقييم ملف الطالب بدقة وبواقعية بناءً على مواده الجامعية، لغاته البرمجية، إحصائيات حساب GitHub، وأبرز مشاريعه. كن صادقاً "قاسياً لمصلحة الطالب" ولا تعطيه تقييماً عالياً إن لم يكن يستحق ذلك فعلاً.

طريقة الحساب:
1. البنية الأكاديمية (30%): المقررات الدراسية لها وزن (مفاهيم Data Structures, OOP، الخوارزميات، قواعد البيانات تعطي أساساً قوياً).
2. الجانب العملي من GitHub ومشاريع (40%): الاستمرارية وجودة المشاريع (ليس مجرد نسخ ولصق لمشاريع من كورسات)، اللغات المستخدمة وملاءمتها للمسمى الوظيفي.
3. التقييم الذاتي للمهارات (30%): مطابقة المهارات المصرح بها مع المشاريع. إذا ذكر الطالب مهارات معينة ولكنه لم يبرهن عليها في مشاريعه، يتم تخفيض هذه النسبة بشكل كبير.

شروط المخرجات النهائية:
- المخرجات يجب أن تكون فقط و حصراً بصيغة JSON صالح (Valid JSON Object).
- لا تقم بأي إضافات أو تعليقات أو كتابات خارج كود JSON. لا تستخدم علامات توضيحية لبرمجة الكود (\`\`\`json و \`\`\`).
- قيم بموضوعية. الطالب المبتدئ الذي لم يبني شيئاً حقيقياً يجب أن يحصل على تقييم تحت 40. الطالب المتميز لا يتجاوز 90.

شكل كود JSON المطلوب كالتالي:
{
  "readiness_score": <رقم صحيح من 0 إلى 100>,
  "readiness_status": "<تصنيف من أربعة: غير جاهز | قيد التطوير الأساسي | جاهز جزئياً للمتدرب | جاهز كلياً للمنافسة>",
  "verified_skills": ["<اسم المهارة 1>", "<اسم المهارة 2>", "<اسم المهارة 3>"],
  "strengths_summary": "<فقرة قصيرة جداً تمدح فيها أبرز نقطة قوة حقيقية وجدتها بناءً على البيانات>",
  "critical_gaps": [
    {
      "skill": "<المهارة أو الجانب أو التقنية الناقصة>",
      "priority": "<High أو Medium أو Low>",
      "reason": "<سبب النقص: لماذا يحتاجها وما هو دليلك على أنه يفتقدها بناءً على المعطيات>"
    }
  ],
  "actionable_next_step": {
    "recommended_project": "<فكرة مشروع عملي محددة جداً لسد الفجوة الأولى وتكون بمستوى يتحدى الطالب>",
    "project_impact": "<الفائدة المتوقعة من هذا المشروع على ملفه، مثلاً: +15%>"
  }
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing DEEPSEEK_API_KEY or OPENROUTER_API_KEY in .env file" }, { status: 500 });
    }
    const deepseekProvider = createOpenAI({
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });
    
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

    const userPrompt = `تحليل جاهزية لسوق العمل، المسمى المستهدف: ${target_role}

البيانات الأكاديمية:
- المقررات المنجزة: ${completed_courses_list}
- المعدل التراكمي: ${gpa} من 4.00
- الساعات المعتمدة المقطوعة: ${completed_credit_hours} من أصل ${total_credit_hours}

بيانات GitHub والمشاريع:
- اللغات والتقنيات الأساسية: ${github_languages}
- عدد المستودعات العامة: ${github_repos_count}
- ملخص لأبرز المشاريع: ${top_projects_descriptions}
- المهارات المصرح بها: ${self_declared_skills}

قم بتحليلها بدقة وبواقعية ورد بملف JSON فقط.`;

    const { text } = await generateText({
      model: deepseekProvider(process.env.DEEPSEEK_MODEL || 'deepseek/deepseek-chat:free'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1, 
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
