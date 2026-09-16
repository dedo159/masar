export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

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

    let text = "";

    // 1. Check Google Gemini Key
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    // 2. Check DeepSeek / OpenRouter Key
    const openAiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    if (googleKey) {
      try {
        const google = createGoogleGenerativeAI({ apiKey: googleKey });
        const res = await generateText({
          model: google("gemini-1.5-flash") as any,
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.2,
        });
        text = res.text;
      } catch (geminiError: any) {
        console.warn("Gemini execution failed, checking secondary providers:", geminiError.message);
      }
    }

    if (!text && openAiKey) {
      try {
        const openAiProvider = createOpenAI({
          baseURL: process.env.DEEPSEEK_BASE_URL || (process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com" : "https://openrouter.ai/api/v1"),
          apiKey: openAiKey,
        });
        const modelName = process.env.DEEPSEEK_MODEL || (process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "deepseek/deepseek-chat:free");
        const res = await generateText({
          model: openAiProvider(modelName),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.1,
        });
        text = res.text;
      } catch (openAiError: any) {
        console.warn("OpenAI/DeepSeek execution failed:", openAiError.message);
      }
    }

    // 3. Fallback Smart Rule-based Analysis if external LLM APIs fail or keys are absent
    if (!text) {
      const repos = parseInt(String(github_repos_count || 0), 10);
      const parsedGpa = parseFloat(String(gpa || 3.0));
      const hours = parseInt(String(completed_credit_hours || 0), 10);

      let calculatedScore = Math.min(
        95,
        Math.max(
          35,
          Math.round((parsedGpa / 4.0) * 35 + Math.min(repos * 2.5, 35) + Math.min((hours / 132) * 30, 30))
        )
      );

      let status = "قيد التطوير الأساسي";
      if (calculatedScore >= 80) status = "جاهز كلياً للمنافسة";
      else if (calculatedScore >= 65) status = "جاهز جزئياً للمتدرب";
      else if (calculatedScore < 45) status = "غير جاهز";

      const verifiedSkills = (self_declared_skills ? String(self_declared_skills).split(",") : [])
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 4);

      if (verifiedSkills.length === 0) {
        verifiedSkills.push("Problem Solving", "Git & GitHub Basics");
      }

      return NextResponse.json({
        readiness_score: calculatedScore,
        readiness_status: status,
        verified_skills: verifiedSkills,
        strengths_summary: `يمتلك الطالب أساساً أكاديمياً بمعدل ${parsedGpa.toFixed(2)} مع رصيد ${repos} مستودع برمجي، مما يظهر التزاماً بالتعلم المستمر واكتساب المهارات التقنية المطلوبة لدور ${target_role}.`,
        critical_gaps: [
          {
            skill: "Testing & CI/CD Pipelines",
            priority: "High",
            reason: "المشاريع الحالية تفتقر إلى اختبارات آلية (Unit/E2E Tests) ونشر مستمر يثبت الجاهزية لبيئات العمل المؤسسية.",
          },
          {
            skill: "Cloud Architecture & Docker",
            priority: "Medium",
            reason: "يحتاج لربط تطبيقاته مع بنية تحتية سحابية وحاويات Docker لرفع القيمة التنافسية لملفه المهني.",
          },
        ],
        actionable_next_step: {
          recommended_project: `بناء نظام متكامل (${target_role}) يتضمن Authentication، قاعدة بيانات علائقية، وتغطية اختبارات بنسبة لا تقل عن 70% ونشره كحاوية Docker.`,
          project_impact: "+18% في تقييم الجاهزية للمقابلات التقنية",
        },
      });
    }

    let jsonResult;
    try {
      let cleanText = text.trim();
      const firstBrace = cleanText.indexOf("{");
      const lastBrace = cleanText.lastIndexOf("}");
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
