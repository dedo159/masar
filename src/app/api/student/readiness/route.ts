export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getStudentProfile } from "@/lib/db-queries";
import { getSession } from "@/lib/auth";
import { scanGitHubUser } from "@/lib/github-scanner";
import { prisma } from "@/lib/prisma";

const systemPrompt = `أنت مدقق مسار مهني تقني (Technical Career Auditor) لتقييم جاهزية طلاب هندسة البرمجيات وتكنولوجيا المعلومات لسوق العمل وفرص التدريب (Internships / Junior Roles).

مهمتك:
تقييم ملف الطالب بدقة وبواقعية بناءً على المسمى الوظيفي المستهدف، مواده الجامعية، لغاته البرمجية، إحصائيات مستودعات GitHub، وأبرز مشاريعه.
يجب أن ترجع حصراً كائن JSON صالح (Valid JSON Object) بدون أي كود ماركداون أو نصوص خارج JSON وبدون أسوار كود.
جميع النصوص التوضيحية داخل الـ JSON (ملخص القوة، أسباب الفجوات، المشروع المقترح) يجب أن تكون باللغة العربية السليمة والمهنية.

المخطط المطلوب لكائن JSON بدقة:
{
  "readiness_score": 75,
  "readiness_status": "جاهز جزئياً للمتدرب",
  "verified_skills": ["React", "TypeScript", "Tailwind CSS"],
  "strengths_summary": "يمتلك الطالب أساساً عملياً جيداً في...",
  "critical_gaps": [
    {
      "skill": "Testing & CI/CD",
      "priority": "High",
      "reason": "تفتقر المشاريع لاختبارات آلية ونشر مستمر يثبت الجاهزية للعمل المؤسسي."
    }
  ],
  "actionable_next_step": {
    "recommended_project": "بناء تطبيق متكامل في دور ... يتضمن ...",
    "project_impact": "+15% في تقييم المقابلات التقنية"
  }
}

قواعد التقييم:
1. التقييم يجب أن يرتبط مباشرة وبدقة بالمسمى المستهدف (Target Role).
2. إذا كانت التقنيات والمشاريع المدخلة لا تناسب المسمى المستهدف (مثلاً: يستهدف Mobile App Developer ولم يذكر أي تقنية للموبايل كـ Flutter أو React Native أو Swift)، يتم تخفيض التقييم (30-45%) وتحديد الفجوات الحرجة بدقة.
3. استخرج المهارات المحققة (verified_skills) من اللغات والمشاريع التي ذكرها الطالب وتتناسب مع المسمى.
4. حدد الفجوات الأساسية المفقودة بالنسبة لذلك المسمى الوظيفي بعينه مع تحديد الأولوية (High, Medium, Low) والسبب بالعربية.
5. اقترح مشروعاً عملياً محدداً ومتقدماً يجمع المهارات الناقصة ويعزز فرصه في التوظيف.`;

interface RoleBlueprint {
  keywords: string[];
  expectedSkills: string[];
  gapTemplates: { skill: string; priority: "High" | "Medium" | "Low"; reason: string }[];
  projectIdea: (inputs: { langs: string; projects: string }) => string;
}

const ROLE_BLUEPRINTS: Record<string, RoleBlueprint> = {
  frontend: {
    keywords: ["front", "web", "react", "vue", "angular", "واجهات"],
    expectedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5/CSS3", "State Management (Zustand/Redux)", "Testing (Jest/Playwright)"],
    gapTemplates: [
      { skill: "Testing & E2E Verification", priority: "High", reason: "المشاريع تفتقر إلى اختبارات واجهة المستخدم الآلية (Unit & E2E Tests) لضمان استقرار التطبيقات قبل النشر." },
      { skill: "Advanced State Management & SSR", priority: "High", reason: "سوق العمل يتطلب إتقان أطر العمل الحديثة مثل Next.js مع إدارة حالة معقدة وتحسين الأداء ومحركات البحث (Core Web Vitals)." },
      { skill: "Web Performance & Accessibility (a11y)", priority: "Medium", reason: "يحتاج لتعميق ممارسات سرعة التحميل وتوافق المعايير القياسية للوصول الرقمي." }
    ],
    projectIdea: () => "بناء متجر إلكتروني أو منصة تفاعلية متكاملة باستخدام Next.js 15 وTypeScript وTailwind CSS، مدعومة بإدارة حالة عبر Zustand وتغطية شاملة باختبارات Playwright ونشرها عبر Vercel."
  },
  backend: {
    keywords: ["back", "خوادم", "api", "node", "express", "django", "spring", "قواعد بيانات"],
    expectedSkills: ["Node.js / Express", "PostgreSQL / MySQL", "RESTful & GraphQL APIs", "Docker", "Authentication (JWT / OAuth)", "Redis Caching", "Unit & Integration Testing"],
    gapTemplates: [
      { skill: "Containerization (Docker) & Deployment", priority: "High", reason: "تطبيقات الخادم الحديثة تتطلب حزم الخدمات كحاويات Docker وربطها بمسارات CI/CD للاعتماد المؤسسي." },
      { skill: "Database Optimization & Caching", priority: "High", reason: "يحتاج لإثبات كفاءته في كتابة استعلامات SQL متقدمة، الفهرسة، واستخدام Redis للتخزين المؤقت تحت الضغط العالي." },
      { skill: "API Security & Rate Limiting", priority: "Medium", reason: "ضرورة تطبيق حماية ضد هجمات OWASP ومعايير تأمين نقاط النهاية وتحديد معدل الطلبات." }
    ],
    projectIdea: () => "بناء واجهة برمجية مصغرة (Microservices-ready REST/gRPC API) تدعم التوثيق والمصادقة متعددة المستويات، مع قاعدة بيانات PostgreSQL مدعومة بـ Redis Caching ومغلفة بالكامل داخل Docker Compose."
  },
  fullstack: {
    keywords: ["full", "شامل", "مطور شامل", "stack"],
    expectedSkills: ["TypeScript", "Next.js / React", "Node.js", "PostgreSQL", "Prisma / ORM", "Docker", "RESTful APIs", "CI/CD"],
    gapTemplates: [
      { skill: "System Architecture & Scalability", priority: "High", reason: "المطور الشامل يحتاج لإثبات فهم عميق لتصميم الأنظمة وقابلية التوسع وليس مجرد ربط واجهة بنقطة نهاية بسيطة." },
      { skill: "Automated Testing Across Stack", priority: "High", reason: "غياب اختبارات التكامل بين الواجهة الأمامية والخلفية يقلل من الثقة بجهوزية الكود لبيئات الإنتاج الحقيقية." },
      { skill: "DevOps & Cloud Deployment", priority: "Medium", reason: "سوق العمل يفضل المطور الشامل القادر على إدارة البنية التحتية السحابية ونشر الحاويات." }
    ],
    projectIdea: () => "تطوير تطبيق SaaS لإدارة المشاريع الجماعية بنظام الاشتراكات، يدمج Next.js مع معالجة خادم سريعة، ويب سوكت للتنبيهات الحية (WebSockets)، ونظام أذونات متقدم (RBAC) وقاعدة بيانات PostgreSQL."
  },
  mobile: {
    keywords: ["mobile", "flutter", "dart", "react native", "swift", "kotlin", "ios", "android", "هواتف", "جوال"],
    expectedSkills: ["Flutter / Dart", "State Management (BLoC / Riverpod)", "REST APIs & WebSocket", "Local Database (SQLite / Hive)", "Push Notifications", "App Performance & Profiling"],
    gapTemplates: [
      { skill: "Advanced State Management & Architecture", priority: "High", reason: "بناء تطبيقات احترافية يتطلب إتقان معمارية نظيفة (Clean Architecture) وفصل منطق الأعمال باستخدام BLoC أو Riverpod." },
      { skill: "Offline-First Sync & Local Storage", priority: "High", reason: "المشاريع الحالية بحاجة لإظهار معالجة انقطاع الاتصال والمزامنة التلقائية مع الخادم عبر التخزين المحلي." },
      { skill: "Native Device APIs & Notifications", priority: "Medium", reason: "الاستفادة من ميزات الجهاز الأصلية كالإشعارات الخلفية وتحديد المواقع والكاميرا ترفع من القيمة السوقية للملف." }
    ],
    projectIdea: () => "تطوير تطبيق جوال متكامل بنظام Offline-First يدعم إدارة الحالة المعمارية (Clean Architecture)، التخزين المحلي المشفر، وتنبيهات الدفع (Push Notifications) مع رفع نسخة تجريبية حية."
  },
  ai: {
    keywords: ["ai", "machine learning", "deep learning", "ذكاء", "تعلم آلة", "بيانات", "data science"],
    expectedSkills: ["Python", "PyTorch / TensorFlow", "Pandas & NumPy", "Scikit-learn", "MLOps & Model Serving", "FastAPI", "Data Preprocessing", "Evaluation Metrics"],
    gapTemplates: [
      { skill: "MLOps & Model Serving", priority: "High", reason: "سوق الذكاء الاصطناعي لم يعد يكتفي بتدريب النماذج في Notebooks، بل يطلب نشرها كخدمات ويب عالية الأداء ومراقبتها في الإنتاج." },
      { skill: "Data Pipelines & Feature Engineering", priority: "High", reason: "المهارة في معالجة البيانات غير النظيفة وبناء خطوط معالجة مؤتمتة هي الفارق الرئيسي بين الهواة والمحترفين." },
      { skill: "Model Optimization & Quantization", priority: "Medium", reason: "يحتاج لفهم تقنيات تقليص أحجام النماذج وتسريع الاستدلال (Inference) لتعمل على خوادم اقتصادية." }
    ],
    projectIdea: () => "بناء خط أنابيب MLOps كامل: جمع وتجهيز بيانات حقيقية، تدريب نموذج تصنيف أو معالجة لغات، تغليفه كخدمة API عبر FastAPI داخل Docker، ونشره مع لوحة مراقبة للأداء."
  },
  data_analyst: {
    keywords: ["data analyst", "تحليل بيانات", "data analytics", "power bi", "tableau", "محلل بيانات"],
    expectedSkills: ["SQL (Window Functions, CTEs)", "Python (Pandas, Seaborn)", "Power BI / Tableau", "Advanced Excel", "Data Storytelling", "Statistical Analysis"],
    gapTemplates: [
      { skill: "Advanced SQL & Data Modeling", priority: "High", reason: "يحتاج لإثبات القدرة على التعامل مع استعلامات معقدة ومخططات نجمية (Star Schemas) في قواعد بيانات تحليلية ضخمة." },
      { skill: "Interactive Executive Dashboards", priority: "High", reason: "الشركات تبحث عن محلل يستطيع تحويل البيانات الخام إلى لوحات تفاعلية تقدم إجابات واضحة لمتخذي القرار." },
      { skill: "A/B Testing & Hypothesis Testing", priority: "Medium", reason: "تطبيق الأساليب الإحصائية للتحقق من القرارات التسويقية والتشغيلية يرفع من مصداقية التحليلات." }
    ],
    projectIdea: () => "إجراء دراسة تحليلية عميقة لمجموعة بيانات تجارية ضخمة باستخدام SQL وPandas، وبناء لوحة معلومات تفاعلية تنفيذية على Power BI مع توثيق التوصيات الاستراتيجية."
  },
  systems_analyst: {
    keywords: ["systems analyst", "محلل أنظمة", "نظم معلومات", "system analyst", "أنظمة"],
    expectedSkills: ["Requirements Elicitation", "UML / BPMN Diagrams", "Database Modeling (ERD)", "Agile / Scrum", "System Architecture Analysis", "API Specifications (OpenAPI)"],
    gapTemplates: [
      { skill: "Business Process Modeling (BPMN)", priority: "High", reason: "سوق العمل يتطلب نمذجة تدفقات الأعمال بدقة عبر مخططات BPMN لربط أصحاب المصلحة بالفريق التقني." },
      { skill: "Non-Functional Requirements & Security Specs", priority: "High", reason: "يحتاج لتوثيق معايير الأداء والأمان وقابلية التوسع وتوثيق حالات الاستخدام." },
      { skill: "API Contract Design (OpenAPI / Swagger)", priority: "Medium", reason: "تحديد مواصفات الواجهات البرمجية قبل البدء بالتطوير لضمان دقة التنفيذ والتكامل." }
    ],
    projectIdea: () => "إعداد وثيقة مواصفات متطلبات برمجية متكاملة (SRS) لنظام مصرفي أو لوجستي تشمل مخططات UML، نماذج ERD، ومواصفات OpenAPI كاملة."
  },
  devops: {
    keywords: ["devops", "cloud", "docker", "kubernetes", "ci/cd", "terraform", "بنية"],
    expectedSkills: ["Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Terraform (IaC)", "Linux Administration", "Bash / Python Scripting", "Monitoring (Prometheus & Grafana)"],
    gapTemplates: [
      { skill: "Kubernetes Cluster Orchestration", priority: "High", reason: "إدارة الحاويات على نطاق واسع عبر Kubernetes وفهم الـ Deployments وIngress وServices أساسي لأي مهندس DevOps." },
      { skill: "Infrastructure as Code (Terraform)", priority: "High", reason: "أتمتة بناء الموارد السحابية عبر كود برمجي هي المعيار الصناعي الحديث لتفادي الأخطاء اليدوية." },
      { skill: "Observability & Alerting Pipelines", priority: "Medium", reason: "بناء أنظمة مراقبة حية للسجلات ومعدلات الخطأ والضغط باستخدام برمجيات مفتوحة المصدر." }
    ],
    projectIdea: () => "إنشاء بنية تحتية سحابية كاملة باستخدام Terraform ومسار نشر مستمر (CI/CD) يبني صور Docker وينشرها على عنقود Kubernetes مع مراقبة متكاملة عبر Prometheus وGrafana."
  },
  cybersecurity: {
    keywords: ["cyber", "أمن", "security", "اختراق", "شبكات", "penetration", "soc", "سيبراني"],
    expectedSkills: ["Network Protocols & Wireshark", "OWASP Top 10", "Linux Security & Hardening", "Penetration Testing Tools", "Vulnerability Assessment", "Python Scripting for Security", "SIEM & Log Analysis"],
    gapTemplates: [
      { skill: "Hands-on Penetration Testing & Reporting", priority: "High", reason: "يحتاج لإبراز تقارير عملية مكتوبة لاختبار اختراق بيئات تجريبية واقتراح حلول ترقيع الثغرات بدقة." },
      { skill: "Defensive Security & SIEM Analysis", priority: "High", reason: "القدرة على تحليل الهجمات عبر سجلات الأنظمة وكتابة قواعد كشف التهديدات في أنظمة SIEM مطلوبة بشدة." },
      { skill: "Secure Code Review & DevSecOps", priority: "Medium", reason: "دمج الفحص الأمني الثابت (SAST) في مسارات التطوير لمنع تسريب الثغرات مسبقاً." }
    ],
    projectIdea: () => "إجراء تقييم أمني شامل لتطبيق ويب تجريبي، استغلال ثغرات OWASP Top 10، وكتابة تقرير تدقيق أمني احترافي مفصل يتضمن سبل المعالجة وكود الترقيع وإعداد جدار ناري تطبيقي (WAF)."
  },
  uiux: {
    keywords: ["ui", "ux", "designer", "تصميم", "واجهات", "تجربة مستخدم", "figma"],
    expectedSkills: ["Figma / FigJam", "User Research & Interviews", "Wireframing & Interactive Prototyping", "Design Systems & Component Libraries", "Usability Testing", "Information Architecture"],
    gapTemplates: [
      { skill: "End-to-End UX Case Studies", priority: "High", reason: "الملف المهني بحاجة لدراسات حالة موثقة تشرح 'لماذا' تم اتخاذ قرارات التصميم بناءً على أبحاث المستخدمين وليس مجرد واجهات جميلة." },
      { skill: "Design System Architecture", priority: "High", reason: "بناء مكتبة مكونات تفاعلية متسقة مع متغيرات التصميم (Tokens & Variables) لتسهيل التسليم للمطورين." },
      { skill: "Usability Testing & Iteration", priority: "Medium", reason: "إجراء جلسات اختبار قابلية استخدام موثقة وتعديل النماذج بناءً على ملاحظات مستخدمين حقيقيين." }
    ],
    projectIdea: () => "إعداد دراسة حالة تصميمية شاملة (UX Case Study) لتطبيق يحل مشكلة محلية، تبدأ من أبحاث المستخدمين والمقابلات، مروراً ببناء Design System كامل على Figma، وانتهاءً باختبار قابلية الاستخدام."
  },
  default: {
    keywords: [],
    expectedSkills: ["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "Git & Collaborative Workflows", "Clean Architecture & Design Patterns", "Databases & SQL", "Automated Testing"],
    gapTemplates: [
      { skill: "Automated Software Testing", priority: "High", reason: "المشاريع بحاجة لاختبارات وحدة وتكامل آلية تضمن جودة الكود ومطابقته للمعايير الهندسية المعتمدة." },
      { skill: "Design Patterns & System Modularity", priority: "High", reason: "ضرورة تطبيق نماذج التصميم المعتمدة وفصل الطبقات لتسهيل صيانة وتطوير الأنظمة البرمجية مستقبلاً." },
      { skill: "CI/CD & Modern Deployment", priority: "Medium", reason: "ربط المستودعات بمسارات اختبار ونشر مؤتمتة يثبت الفهم العملي لبيئات العمل الاحترافية." }
    ],
    projectIdea: (inputs) => `بناء نظام برمجي متكامل يخدم دور ${inputs.langs || "هندسة البرمجيات"} يطبق مفاهيم Clean Architecture وقاعدة بيانات علائقية وتغطية اختبارات تتجاوز 70%.`
  }
};

const SPECIFIC_ROLE_ORDER = [
  "cybersecurity",
  "systems_analyst",
  "data_analyst",
  "ai",
  "mobile",
  "uiux",
  "devops",
  "fullstack",
  "frontend",
  "backend"
];

function getRoleBlueprint(targetRole: string): RoleBlueprint {
  const normalized = (targetRole || "").toLowerCase().trim();
  for (const roleKey of SPECIFIC_ROLE_ORDER) {
    const blueprint = ROLE_BLUEPRINTS[roleKey];
    if (blueprint && (normalized.includes(roleKey) || blueprint.keywords.some(kw => normalized.includes(kw)))) {
      return blueprint;
    }
  }
  return ROLE_BLUEPRINTS.default;
}

function generateDynamicFallback(body: any) {
  const {
    target_role = "Software Engineer",
    github_languages = "",
    github_repos_count = 0,
    top_projects_descriptions = "",
    self_declared_skills = "",
    gpa = 3.0,
    completed_credit_hours = 90,
  } = body;

  const blueprint = getRoleBlueprint(target_role);
  const repos = parseInt(String(github_repos_count || 0), 10);
  const parsedGpa = parseFloat(String(gpa || 3.0));
  const hours = parseInt(String(completed_credit_hours || 90), 10);

  const studentSkillsRaw = `${github_languages}, ${self_declared_skills}`
    .split(/[,;\n+&/]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 2 && s.length <= 35 && s.split(" ").length <= 4);

  const studentSkillsUnique = Array.from(new Set(studentSkillsRaw));
  const verified: string[] = [];
  const lowercaseDeclared = `${studentSkillsUnique.join(" ")}, ${top_projects_descriptions}`.toLowerCase();

  blueprint.expectedSkills.forEach(expSkill => {
    const parts = expSkill.toLowerCase().split(/[\s/()]+/);
    if (parts.some(p => p.length > 2 && lowercaseDeclared.includes(p))) {
      verified.push(expSkill);
    }
  });

  studentSkillsUnique.forEach(skill => {
    if (verified.length < 5 && !verified.some(v => v.toLowerCase().includes(skill.toLowerCase()))) {
      verified.push(skill);
    }
  });

  if (verified.length === 0) {
    verified.push("Git & GitHub", "Problem Solving", "Object-Oriented Programming");
  }

  const matchRatio = Math.min(1, verified.length / Math.max(3, blueprint.expectedSkills.length * 0.6));
  const skillScore = matchRatio * 40;
  const gpaScore = Math.min(25, (parsedGpa / 4.0) * 25);
  const reposScore = Math.min(20, (repos / 10) * 20);
  const projectDepth = Math.min(15, (top_projects_descriptions.length / 80) * 15);

  const calculatedScore = Math.min(94, Math.max(32, Math.round(skillScore + gpaScore + reposScore + projectDepth)));

  let status = "قيد التطوير الأساسي";
  if (calculatedScore >= 80) status = "جاهز كلياً للمنافسة";
  else if (calculatedScore >= 65) status = "جاهز جزئياً للمتدرب";
  else if (calculatedScore < 45) status = "غير جاهز";

  const criticalGaps = blueprint.gapTemplates
    .filter(gap => {
      const gapWords = gap.skill.toLowerCase().split(/[\s/()]+/);
      return !gapWords.some(w => w.length > 2 && lowercaseDeclared.includes(w));
    })
    .slice(0, 3);

  if (criticalGaps.length === 0) {
    criticalGaps.push({
      skill: "Production Architecture & Performance",
      priority: "Medium",
      reason: "يحتاج لاختبار التطبيقات تحت أعباء عمل حقيقية وتوثيق مؤشرات الأداء وزمن الاستجابة."
    });
  }

  const primaryLang = String(github_languages).split(",")[0]?.trim() || "التقنيات المذكورة";
  const strengthsSummary = `يمتلك الطالب خلفية برمجية واعدة برصيد ${repos} مستودعاً برمجياً. برهن في مشاريع ${primaryLang} على استيعاب المبادئ التقنية، مما يشكل قاعدة داعمة للتخصص كـ ${target_role}.`;

  const actionableProject = blueprint.projectIdea({
    langs: github_languages,
    projects: top_projects_descriptions
  });

  return {
    readiness_score: calculatedScore,
    readiness_status: status,
    verified_skills: verified.slice(0, 6),
    strengths_summary: strengthsSummary,
    critical_gaps: criticalGaps,
    actionable_next_step: {
      recommended_project: actionableProject,
      project_impact: calculatedScore < 60 ? "+22% في تقييم الجاهزية" : "+15% في الجاهزية للمقابلات الفنية"
    }
  };
}

const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes window

async function cacheStudentReadiness(studentId: string, result: any) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data: {
        readinessData: JSON.stringify(result),
        lastReadinessScanAt: new Date(),
      },
    });
  } catch (err: any) {
    console.warn("Failed to cache student readiness:", err?.message);
  }
}

export async function GET() {
  const session = await getSession().catch(() => null);
  if (!session || session.userType !== "student" || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id: session.userId },
    select: { readinessData: true, lastReadinessScanAt: true },
  });

  if (!student || !student.readinessData) {
    return NextResponse.json({ hasAudit: false });
  }

  try {
    const data = JSON.parse(student.readinessData);
    const elapsed = student.lastReadinessScanAt ? Date.now() - new Date(student.lastReadinessScanAt).getTime() : Infinity;
    const cooldownRemaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));

    return NextResponse.json({
      hasAudit: true,
      cached: true,
      lastScanAt: student.lastReadinessScanAt,
      cooldownRemainingSeconds: cooldownRemaining,
      data,
    });
  } catch {
    return NextResponse.json({ hasAudit: false });
  }
}

export async function POST(req: Request) {
  const session = await getSession().catch(() => null);
  if (!session || session.userType !== "student" || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
    const isForced = Boolean(body.force);

    // Rate Limiting & Cooldown Check
    const existingStudent = await prisma.student.findUnique({
      where: { id: session.userId },
      select: { readinessData: true, lastReadinessScanAt: true },
    });

    if (!isForced && existingStudent?.lastReadinessScanAt && existingStudent?.readinessData) {
      const elapsed = Date.now() - new Date(existingStudent.lastReadinessScanAt).getTime();
      if (elapsed < COOLDOWN_MS) {
        const cooldownRemaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        try {
          const cachedData = JSON.parse(existingStudent.readinessData);
          return NextResponse.json({
            ...cachedData,
            cached: true,
            cooldownRemainingSeconds: cooldownRemaining,
            notice: `تم استرجاع تقييمك المحفوظ مسبقاً لحماية الرصيد. يمكنك طلب فحص جديد بعد ${Math.ceil(cooldownRemaining / 60)} دقيقة.`,
          });
        } catch {
          // If parse fails, continue to fresh scan
        }
      }
    }

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

    // Auto-resolve from student profile & GitHub if needed
    let resolvedLanguages = github_languages;
    let resolvedReposCount = github_repos_count;
    let resolvedTopProjects = top_projects_descriptions;
    let resolvedSkills = self_declared_skills;

    try {
      const session = await getSession().catch(() => null);
      const studentId = session?.userType === "student" ? session.userId : undefined;
      const studentProfile = await getStudentProfile(studentId).catch(() => null);

      if (studentProfile) {
        if (!resolvedSkills && studentProfile.skills && studentProfile.skills.length > 0) {
          resolvedSkills = studentProfile.skills.join(", ");
        }
        if ((!resolvedLanguages || !resolvedTopProjects) && studentProfile.github) {
          const scan = await scanGitHubUser(studentProfile.github, studentProfile.skills || []);
          if (!resolvedLanguages && scan.languagesString) resolvedLanguages = scan.languagesString;
          if (!resolvedReposCount && scan.reposCount) resolvedReposCount = scan.reposCount;
          if (!resolvedTopProjects && scan.topProjects) resolvedTopProjects = scan.topProjects;
        }
      }
    } catch (e: any) {
      console.warn("Auto-resolution of profile in readiness failed:", e?.message);
    }

    body.github_languages = resolvedLanguages;
    body.github_repos_count = resolvedReposCount;
    body.top_projects_descriptions = resolvedTopProjects;
    body.self_declared_skills = resolvedSkills;

    const userPrompt = `تحليل جاهزية لسوق العمل:
- المسمى المستهدف: ${target_role || "Software Engineer"}
- المقررات الأساسية المعتمدة: ${completed_courses_list || "هياكل بيانات، خوارزميات، قواعد بيانات"}
- لغات وتقنيات GitHub: ${resolvedLanguages || "غير محدد"}
- عدد المستودعات العامة: ${resolvedReposCount || 0}
- ملخص المشاريع المنجزة: ${resolvedTopProjects || "مشاريع جامعية وتطبيقات مبسطة"}
- المهارات المصرح بها: ${resolvedSkills || "برمجة وحل مشكلات"}

قم بإجراء تقييم دقيق ومتفرد لهذه المدخلات تحديداً وأخرج كائن JSON صالح باللغة العربية حصراً بدون ذكر أي معدلات أو ساعات.`;

    let text = "";

    // 1. Primary AI: Google Gemini 2.5 Flash
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (googleKey) {
      try {
        const google = createGoogleGenerativeAI({ apiKey: googleKey });
        const res = await generateText({
          model: google("gemini-2.5-flash") as any,
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.2,
        });
        text = res.text;
      } catch (geminiError: any) {
        console.warn("Gemini 2.5 flash call failed:", geminiError.message);
      }
    }

    // 2. Secondary AI: DeepSeek / OpenRouter / OpenAI
    const openAiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
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
        console.warn("Secondary LLM provider failed:", openAiError.message);
      }
    }

    // Parse and normalize JSON if LLM returned text
    if (text) {
      try {
        let cleanText = text.trim();
        cleanText = cleanText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        const parsed = JSON.parse(cleanText);

        const readinessScore = typeof parsed.readiness_score === "number" ? parsed.readiness_score : parseInt(parsed.readiness_score || "60", 10);
        const readinessStatus = parsed.readiness_status || (readinessScore >= 80 ? "جاهز كلياً للمنافسة" : readinessScore >= 65 ? "جاهز جزئياً للمتدرب" : "قيد التطوير الأساسي");
        const verifiedSkills = Array.isArray(parsed.verified_skills) ? parsed.verified_skills : (parsed.technologies_focus || ["Git", "Problem Solving"]);
        const strengthsSummary = parsed.strengths_summary || parsed.assessment_summary || parsed.strengths?.[0] || "يظهر الطالب استعداداً جيداً ومبادرة مستمرة في التعلم.";
        
        let criticalGaps = parsed.critical_gaps;
        if (!Array.isArray(criticalGaps) || criticalGaps.length === 0) {
          if (Array.isArray(parsed.areas_for_improvement)) {
            criticalGaps = parsed.areas_for_improvement.map((item: any) => ({
              skill: typeof item === "string" ? item.split(":")[0]?.replace(/\*/g, "") : "مهارة برمجية",
              priority: "High",
              reason: typeof item === "string" ? item : "تحتاج لتعميق هذه المهارة لتلبية متطلبات السوق."
            }));
          }
        }

        let actionableNextStep = parsed.actionable_next_step;
        if (!actionableNextStep || !actionableNextStep.recommended_project) {
          const recProj = parsed.next_steps_recommendations?.[0] || `بناء مشروع عملي متكامل يبرز كفاءتك في دور ${target_role}.`;
          actionableNextStep = {
            recommended_project: typeof recProj === "string" ? recProj.replace(/\*/g, "") : "تطوير مشروع شامل يعالج الفجوات التقنية المحددة.",
            project_impact: "+18% في تقييم المقابلات"
          };
        }

        const finalResult = {
          readiness_score: readinessScore,
          readiness_status: readinessStatus,
          verified_skills: verifiedSkills,
          strengths_summary: strengthsSummary,
          critical_gaps: criticalGaps || [],
          actionable_next_step: actionableNextStep
        };

        await cacheStudentReadiness(session.userId, finalResult);

        return NextResponse.json({
          ...finalResult,
          cached: false,
          cooldownRemainingSeconds: Math.ceil(COOLDOWN_MS / 1000),
        });
      } catch (parseError) {
        console.warn("Failed to parse LLM response, falling back to dynamic rule generator:", parseError);
      }
    }

    // 3. Dynamic Rule-Based Analyzer if LLM failed or parsed invalid JSON
    const dynamicResult = generateDynamicFallback(body);
    await cacheStudentReadiness(session.userId, dynamicResult);
    return NextResponse.json({
      ...dynamicResult,
      cached: false,
      cooldownRemainingSeconds: Math.ceil(COOLDOWN_MS / 1000),
    });
  } catch (error: any) {
    console.error("Readiness AI Route Error:", error.message || error);
    const dynamicResult = generateDynamicFallback(body);
    return NextResponse.json({
      ...dynamicResult,
      cached: false,
      cooldownRemainingSeconds: Math.ceil(COOLDOWN_MS / 1000),
    });
  }
}
