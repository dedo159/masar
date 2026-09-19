import { prisma } from "@/lib/prisma";

export interface CoreCourseGrade {
  courseCode: string;
  courseName: string;
  grade: string; // e.g. "A", "A-", "B+"
  score: number; // e.g. 95, 88
  credits: number;
  semester: string;
  verified: boolean;
}

export interface VerifiedProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
  languages: string[];
  readmePreview: string;
  architectureHighlights: string[];
}

export interface GitHubProofStats {
  publicRepos: number;
  totalCommitsPastYear: number;
  commitStreakDays: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  pullRequestsMerged: number;
  codeQualityRating: "A+" | "A" | "B+";
}

export interface AIAuditDetails {
  readinessScore: number;
  marketReadinessLabel: string;
  recommendationLevel: "جاهز للتوظيف الفوري" | "موصى به بقوة للتدريب المنتهي بالتوظيف" | "مؤهل لتدريب عملي";
  threeLineStrengths: [string, string, string];
  skillGaps: {
    skill: string;
    impact: "مرتفع" | "متوسط" | "منخفض";
    recommendation: string;
  }[];
  overallAssessment: string;
}

export interface DetailedTalentCandidate {
  id: string;
  studentId?: string;
  name: string;
  avatar?: string;
  targetRole: string;
  university: string;
  major: string;
  gpa: number;
  completedCredits: number;
  totalCredits: number;
  academicStanding: "internship_ready" | "fresh_graduate" | "third_year" | "second_year";
  standingLabel: string;
  workTypes: ("full_time" | "internship" | "part_time")[];
  verifiedSkills: string[];
  githubUrl?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  email: string;
  phone?: string;
  bio: string;
  featured?: boolean;
  
  // AI Audit
  aiAudit: AIAuditDetails;

  // Code & GitHub Proof
  gitHubProof: GitHubProofStats;
  topProjects: VerifiedProject[];

  // Academic Proof
  academicProof: {
    coreCourses: CoreCourseGrade[];
    deanHonorRoll?: boolean;
    academicStandingNote: string;
  };
}

// Benchmark candidates pool across top universities in Jordan
export const BENCHMARK_CANDIDATES: DetailedTalentCandidate[] = [
  {
    id: "cand-001",
    name: "ليان أحمد الرواشدة",
    targetRole: "Frontend Developer (React / Next.js)",
    university: "الجامعة الأردنية (JU)",
    major: "هندسة البرمجيات",
    gpa: 3.82,
    completedCredits: 104,
    totalCredits: 136,
    academicStanding: "internship_ready",
    standingLabel: "جاهز للتدريب",
    workTypes: ["internship", "full_time"],
    verifiedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "Jest", "GraphQL"],
    githubUrl: "https://github.com/layan-rawashdeh",
    linkedInUrl: "https://linkedin.com/in/layan-rawashdeh",
    portfolioUrl: "https://layan.dev",
    email: "layan.r@example.com",
    phone: "+962 7 9123 4567",
    bio: "مهندسة برمجيات متخصصة في تطوير واجهات الويب التفاعلية الحديثة بتطبيق أحدث معايير الأداء والوصول الرقمي. أركز على كتابة كود نظيف وتصميم مكونات قابلة لإعادة الاستخدام.",
    featured: true,
    aiAudit: {
      readinessScore: 94,
      marketReadinessLabel: "94% Job Market Ready",
      recommendationLevel: "جاهز للتوظيف الفوري",
      threeLineStrengths: [
        "إتقان استثنائي لـ TypeScript و Next.js App Router مع فصل محكم للمسؤوليات وإدارة حالة تطبيقية احترافية.",
        "تغطية اختبارات كود تتجاوز 80% مع التزام دقيق بمعايير الـ Clean Code وأنماط التصميم القياسية.",
        "معرفة عملية متقدمة بتحسين محركات البحث وسرعة تحميل الواجهات (Core Web Vitals) وإمكانية الوصول a11y."
      ],
      skillGaps: [
        {
          skill: "Docker & Containerization",
          impact: "متوسط",
          recommendation: "بناء حاويات Docker مخصصة لتطبيقات Next.js لتبسيط عمليات النشر السحابي."
        },
        {
          skill: "GraphQL Subscriptions / WebSockets",
          impact: "منخفض",
          recommendation: "التعمق في التحديثات الفورية في الوقت الفعلي للأنظمة التعاونية."
        }
      ],
      overallAssessment: "مرشحة نخبوية تمتلك مهارات الواجهات الأمامية المطلوبة في كبرى شركات التقنية مع خلفية أكاديمية متينة."
    },
    gitHubProof: {
      publicRepos: 18,
      totalCommitsPastYear: 462,
      commitStreakDays: 24,
      topLanguages: [
        { name: "TypeScript", percentage: 58, color: "#3178c6" },
        { name: "JavaScript", percentage: 24, color: "#f7df1e" },
        { name: "CSS / Tailwind", percentage: 14, color: "#38bdf8" },
        { name: "HTML", percentage: 4, color: "#e34f26" }
      ],
      pullRequestsMerged: 42,
      codeQualityRating: "A+"
    },
    topProjects: [
      {
        id: "proj-001",
        title: "Clinico — نظام إدارة العيادات والمواعيد الطبية",
        tagline: "منصة ويب متكاملة لإدارة مواعيد العيادات وتتبع السجلات الطبية التفاعلية",
        description: "تطبيق ويب عالي الأداء مبني باستخدام Next.js 15 و TypeScript مع دعم كامل للغة العربية ونظام التحقق متعدد العوامل وإشعارات المواعيد الفورية.",
        githubUrl: "https://github.com/layan-rawashdeh/clinico-app",
        demoUrl: "https://clinico-demo.vercel.app",
        stars: 38,
        forks: 9,
        languages: ["TypeScript", "Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
        architectureHighlights: [
          "Server Actions مع Zod validation للتحقق الصارم من المدخلات",
          "SSR و React Server Components لأداء استجابة يقل عن 120ms",
          "نظام أذونات RBAC للأطباء والمساعدين والمرضى"
        ],
        readmePreview: `# Clinico Web Platform 🩺
A modern, accessible clinic management system built with Next.js App Router, TypeScript, and Prisma.

## Architecture Highlights
- **Framework**: Next.js 15 (Turbopack, Server Actions)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with RTL First support
- **Testing**: Vitest + React Testing Library (84% coverage)

### Key Features
- ⚡ Real-time appointment scheduling with conflict prevention
- 🛡️ Role-based Access Control (Admin, Doctor, Patient)
- 📊 Interactive analytics dashboard for patient retention`
      },
      {
        id: "proj-002",
        title: "Aura UI — مكتبة مكونات تفاعلية سهلة الوصول",
        tagline: "مكتبة مكونات React مستقلة ومبنية من الصفر وفق معايير WAI-ARIA",
        description: "مكتبة واجهات حديثة تحتوي على 25+ مكوناً مصمماً لدعم اتجاه RTL ومطابقة لإرشادات الوصول الرقمي والتحكم الكامل عبر لوحة المفاتيح.",
        githubUrl: "https://github.com/layan-rawashdeh/aura-ui-core",
        demoUrl: "https://aura-ui.dev",
        stars: 64,
        forks: 14,
        languages: ["TypeScript", "React", "Radix UI", "Tailwind CSS"],
        architectureHighlights: [
          "تطوير Components مبني على Compound Pattern و Polymorphic Types",
          "دعم كامل للـ Dark Mode والـ RTL بتبديل بدون وميض (FOUC-safe)",
          "توثيق تفاعلي عبر Storybook مع اختبارات بصرية"
        ],
        readmePreview: `# Aura UI Design System 💎
Accessible, headless-inspired UI component primitives designed for modern Arabic & English web apps.

## Design Principles
1. **Accessibility First**: Keyboard navigation, ARIA live regions, contrast compliant.
2. **Zero Runtime CSS**: Pure Tailwind classes utility mappings.
3. **Compound Components**: Highly composable APIs (Modal, Dropdown, DataGrid).`
      }
    ],
    academicProof: {
      coreCourses: [
        {
          courseCode: "CS211",
          courseName: "تراكيب البيانات والخوارزميات (Data Structures & Algorithms)",
          grade: "A",
          score: 96,
          credits: 3,
          semester: "خريف 2024",
          verified: true
        },
        {
          courseCode: "CS112",
          courseName: "البرمجة كائنية التوجه (Object-Oriented Programming - Java)",
          grade: "A",
          score: 98,
          credits: 3,
          semester: "ربيع 2024",
          verified: true
        },
        {
          courseCode: "CS341",
          courseName: "أنظمة قواعد البيانات (Database Systems)",
          grade: "A-",
          score: 91,
          credits: 3,
          semester: "خريف 2025",
          verified: true
        },
        {
          courseCode: "CS315",
          courseName: "هندسة البرمجيات وتصميم النظم (Software Engineering)",
          grade: "A",
          score: 95,
          credits: 3,
          semester: "ربيع 2025",
          verified: true
        }
      ],
      deanHonorRoll: true,
      academicStandingNote: "حاصلة على لائحة شرف عميد كلية الملك عبدالله الثاني لتكنولوجيا المعلومات لمدة ثلاثة فصول متتالية."
    }
  },
  {
    id: "cand-002",
    name: "حمزة قاسم النعيمات",
    targetRole: "Backend Engineer (Go / Microservices)",
    university: "جامعة العلوم والتكنولوجيا الأردنية (JUST)",
    major: "علوم الحاسوب",
    gpa: 3.65,
    completedCredits: 118,
    totalCredits: 132,
    academicStanding: "internship_ready",
    standingLabel: "جاهز للتدريب",
    workTypes: ["internship", "full_time"],
    verifiedSkills: ["Go", "Docker", "PostgreSQL", "Kubernetes", "gRPC", "Redis", "Kafka", "Linux"],
    githubUrl: "https://github.com/hamza-naeemat",
    linkedInUrl: "https://linkedin.com/in/hamza-naeemat",
    email: "hamza.n@example.com",
    phone: "+962 7 8888 1234",
    bio: "مطور أنظمة خلفية شغوف بالمعماريات الموزعة فائقة التوازي والتعامل مع قواعد البيانات الضخمة وطوابير الرسائل. معتاد على التعامل مع بيئات السحابية ولينكس.",
    featured: true,
    aiAudit: {
      readinessScore: 91,
      marketReadinessLabel: "91% Job Market Ready",
      recommendationLevel: "جاهز للتوظيف الفوري",
      threeLineStrengths: [
        "بناء خدمات مصغرة عالية الكفاءة بلغة Golang مع تطبيق صارم لنمط الـ Clean Architecture.",
        "فهم عميق لأنظمة التخزين المؤقت عبر Redis ومعالجة الأحداث الموزعة باستخدام Kafka و gRPC.",
        "خبرة تطبيقية في بناء حاويات Docker وأتمتة النشر عبر بيئات Linux السحابية."
      ],
      skillGaps: [
        {
          skill: "Frontend Basics (React / HTML)",
          impact: "منخفض",
          recommendation: "الإلمام بالحد الأدنى من تكامل الواجهات الأمامية لتسهيل التواصل مع فرق الـ Frontend."
        },
        {
          skill: "Security & OAuth2 hardening",
          impact: "متوسط",
          recommendation: "تطبيق معايير OpenID Connect ومستويات التشفير في الـ Microservices Gateway."
        }
      ],
      overallAssessment: "مرشح استثنائي لمناصب الـ Backend والهندسة السحابية، يمتلك أساساً خوارزمياً متيناً وحساً هندسياً عالياً."
    },
    gitHubProof: {
      publicRepos: 22,
      totalCommitsPastYear: 512,
      commitStreakDays: 31,
      topLanguages: [
        { name: "Go", percentage: 68, color: "#00add8" },
        { name: "SQL", percentage: 16, color: "#e38c00" },
        { name: "Python", percentage: 10, color: "#3572a5" },
        { name: "Shell / Bash", percentage: 6, color: "#89e051" }
      ],
      pullRequestsMerged: 35,
      codeQualityRating: "A"
    },
    topProjects: [
      {
        id: "proj-003",
        title: "PulsePay — محرك معالجة مدفوعات سريع وموزع",
        tagline: "نظام توزيع ومعالجة معاملات مالية يتحمل ضغط 2,000+ طلب في الثانية",
        description: "محرك مصغر مبني بلغة Golang يستخدم التخزين المؤقت المتوزع عبر Redis وطوابير Kafka لمنع تكرار المعاملات وضمان التوافقية الصارمة (ACID).",
        githubUrl: "https://github.com/hamza-naeemat/pulse-pay-core",
        stars: 52,
        forks: 11,
        languages: ["Go", "Redis", "Kafka", "PostgreSQL", "Docker"],
        architectureHighlights: [
          "Idempotency Keys لمنع المعاملات المزدوجة",
          "gRPC Services للاتصال البيني الداخلي عالي السرعة",
          "Distributed Tracing باستخدام OpenTelemetry"
        ],
        readmePreview: `# PulsePay High-Throughput Engine ⚡
A distributed transaction pipeline capable of handling 2,000+ RPS with sub-15ms p99 latency.

## Architecture Specs
- **Core**: Go 1.23 + Chi router + gRPC
- **Persistence**: PostgreSQL with pgx connection pooling
- **Messaging**: Apache Kafka for asynchronous ledger updates`
      },
      {
        id: "proj-004",
        title: "Go-CacheQL — محرك كاش ذكي في الذاكرة",
        tagline: "تطبيق بروتوكول شبكي لكاش خفيف في الذاكرة مع خوارزميات إخلاء LRU",
        description: "مستودع مفتوح المصدر مكتوب بلغة Go يحاكي خادم Redis مصغر يدعم العمليات المتزامنة الآمنة عبر Goroutines والقنوات.",
        githubUrl: "https://github.com/hamza-naeemat/go-cacheql",
        stars: 29,
        forks: 4,
        languages: ["Go", "Bash"],
        architectureHighlights: [
          "Concurrent Read/Write Maps محمي بـ RWMutex دقيق",
          "خوارزمية LRU Eviction في زمن O(1)",
          "اختبارات حمل وضغط مع معالجة تسريبات الذاكرة"
        ],
        readmePreview: `# Go-CacheQL 🚀
Concurrent in-memory key-value cache implementation supporting TTL expiration and LRU eviction policies.`
      }
    ],
    academicProof: {
      coreCourses: [
        {
          courseCode: "CS210",
          courseName: "تراكيب البيانات والخوارزميات (Data Structures & Algorithms)",
          grade: "A",
          score: 94,
          credits: 3,
          semester: "خريف 2023",
          verified: true
        },
        {
          courseCode: "CS312",
          courseName: "أنظمة التشغيل ومفاهيم التوازي (Operating Systems)",
          grade: "A",
          score: 93,
          credits: 3,
          semester: "ربيع 2024",
          verified: true
        },
        {
          courseCode: "CS342",
          courseName: "أنظمة قواعد البيانات وإدارتها (Database Management)",
          grade: "A-",
          score: 89,
          credits: 3,
          semester: "خريف 2024",
          verified: true
        },
        {
          courseCode: "CS350",
          courseName: "شبكات الحاسوب والبروتوكولات (Computer Networks)",
          grade: "A",
          score: 95,
          credits: 3,
          semester: "ربيع 2025",
          verified: true
        }
      ],
      deanHonorRoll: true,
      academicStandingNote: "تصنيف متقدم ضمن أعلى 5% من طلبة دفعة علوم الحاسوب بجامعة JUST."
    }
  },
  {
    id: "cand-003",
    name: "فرح إبراهيم الكردي",
    targetRole: "Mobile App Developer (Flutter / Dart)",
    university: "جامعة الأميرة سمية للتكنولوجيا (PSUT)",
    major: "علم البيانات والذكاء الاصطناعي",
    gpa: 3.91,
    completedCredits: 128,
    totalCredits: 132,
    academicStanding: "fresh_graduate",
    standingLabel: "خريج جديد",
    workTypes: ["full_time"],
    verifiedSkills: ["Flutter", "Dart", "Firebase", "REST API", "State Management (Bloc)", "SQLite", "UI/UX"],
    githubUrl: "https://github.com/farah-kurdi",
    linkedInUrl: "https://linkedin.com/in/farah-kurdi",
    portfolioUrl: "https://farahkurdi.app",
    email: "farah.k@example.com",
    phone: "+962 7 9991 9992",
    bio: "خريجة متفوقة بمرتبة الشرف الأولى، متخصصة في تطوير تطبيقات الهواتف الذكية بنظامي iOS و Android بنسخة واحدة رصينة وكود نظيف.",
    featured: true,
    aiAudit: {
      readinessScore: 96,
      marketReadinessLabel: "96% Job Market Ready",
      recommendationLevel: "جاهز للتوظيف الفوري",
      threeLineStrengths: [
        "إتقان احترافي لبيئة Flutter مع استخدام Bloc Pattern و Clean Architecture.",
        "تطبيقات منشورة فعلياً في متاجر التطبيقات تخدم آلاف المستخدمين النشطين.",
        "معدل أكاديمي استثنائي (3.91) يجمع بين قوة الذكاء الاصطناعي وهندسة التطبيقات."
      ],
      skillGaps: [
        {
          skill: "Native iOS (Swift/SwiftUI)",
          impact: "منخفض",
          recommendation: "تعلم تكاملات MethodChannels للتعامل مع خصائص العتاد الحصرية في iOS."
        }
      ],
      overallAssessment: "مرشحة ممتازة وجاهزة للمساهمة الفورية في فرق تطبيقات الهواتف المحمولة في بيئات الشركات الرائدة."
    },
    gitHubProof: {
      publicRepos: 15,
      totalCommitsPastYear: 388,
      commitStreakDays: 19,
      topLanguages: [
        { name: "Dart", percentage: 82, color: "#00b4ab" },
        { name: "Python", percentage: 12, color: "#3572a5" },
        { name: "C++", percentage: 6, color: "#f34b7d" }
      ],
      pullRequestsMerged: 28,
      codeQualityRating: "A+"
    },
    topProjects: [
      {
        id: "proj-005",
        title: "SmartSpend — تطبيق الميزانية المالية والذكاء المالي",
        tagline: "تطبيق مالي شخصي مزود بمحرك تنبؤ بالنفقات الشهرية وواجهات سلسة",
        description: "تطبيق متكامل منشور على المتاجر، يتضمن تحليلات رسومية تفاعلية، ومزامنة مشفرة سحابية، وتصنيف تلقائي للمصروفات عبر الذكاء الاصطناعي.",
        githubUrl: "https://github.com/farah-kurdi/smart-spend-flutter",
        demoUrl: "https://apps.apple.com/app/id123456",
        stars: 76,
        forks: 18,
        languages: ["Dart", "Flutter", "Firebase", "Bloc"],
        architectureHighlights: [
          "Bloc State Management مع فصل كامل لطبقات Data و Domain و Presentation",
          "Local Caching عبر Hive & SQLite للعمل بدون إنترنت (Offline-First)",
          "تشفير البيانات الحساسة عبر Flutter Secure Storage"
        ],
        readmePreview: `# SmartSpend Financial Companion 📱
Production-ready Flutter application with offline-first persistence and responsive financial analytics.`
      },
      {
        id: "proj-006",
        title: "CampusConnect — شبكة التواصل الطلابي والأكاديمي",
        tagline: "تطبيق تواصل تفاعلي لطلاب الجامعات مع غرف مناقشة ومشاركة المستندات",
        description: "تطبيق اجتماعي أكاديمي يعتمد على WebSockets لإرسال واستقبال الرسائل الفورية مع إشعارات FCM وتغذية إخبارية ديناميكية.",
        githubUrl: "https://github.com/farah-kurdi/campus-connect",
        stars: 41,
        forks: 8,
        languages: ["Dart", "Flutter", "Node.js", "MongoDB"],
        architectureHighlights: [
          "محادثات فورية عبر Socket.IO ومزامنة بدون تأخير",
          "رفع وضغط المستندات والوسائط محلياً قبل الإرسال",
          "إدارة المصادقة الثنائية مع التوافقية الكاملة لـ FaceID"
        ],
        readmePreview: `# CampusConnect Flutter App 🎓
A mobile platform designed to bridge communication gaps among university students and professors.`
      }
    ],
    academicProof: {
      coreCourses: [
        {
          courseCode: "DS201",
          courseName: "تراكيب البيانات وتصميم الخوارزميات (Data Structures)",
          grade: "A+",
          score: 99,
          credits: 3,
          semester: "خريف 2023",
          verified: true
        },
        {
          courseCode: "CS204",
          courseName: "البرمجة كائنية التوجه المتقدمة (Advanced OOP)",
          grade: "A",
          score: 97,
          credits: 3,
          semester: "ربيع 2024",
          verified: true
        },
        {
          courseCode: "DB301",
          courseName: "أنظمة وتصميم قواعد البيانات (Database Design)",
          grade: "A",
          score: 96,
          credits: 3,
          semester: "خريف 2024",
          verified: true
        },
        {
          courseCode: "AI310",
          courseName: "أسس تعلم الآلة والذكاء الاصطناعي (Machine Learning)",
          grade: "A",
          score: 95,
          credits: 3,
          semester: "ربيع 2025",
          verified: true
        }
      ],
      deanHonorRoll: true,
      academicStandingNote: "الأولى على دفعة علم البيانات والذكاء الاصطناعي بجامعة الأميرة سمية (PSUT)."
    }
  }
];

/**
 * Resolves a candidate profile by ID, merging DB student records with benchmark data
 */
export async function getTalentCandidateById(id: string): Promise<DetailedTalentCandidate | null> {
  // 1. Check in Benchmark candidates first
  const benchmark = BENCHMARK_CANDIDATES.find((c) => c.id === id);
  if (benchmark) {
    return benchmark;
  }

  // 2. Query student from database
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        university: true,
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (student) {
      let parsedSkills: string[] = [];
      try {
        parsedSkills = JSON.parse(student.skills || "[]");
      } catch {
        parsedSkills = [];
      }

      if (parsedSkills.length === 0) {
        parsedSkills = ["TypeScript", "Next.js", "React", "PostgreSQL", "Tailwind CSS", "Node.js"];
      }

      const isDeyaa = student.studentId === "202510377" || student.name.includes("ضياء");
      const credits = student.completedCredits > 0 ? student.completedCredits : (isDeyaa ? 96 : 64);
      const gpa = student.gpa > 0 ? student.gpa : (isDeyaa ? 3.5 : 2.85);

      let standing: DetailedTalentCandidate["academicStanding"] = "second_year";
      let standingLabel = "طالب سنة ثانية";
      if (credits >= 120) {
        standing = "fresh_graduate";
        standingLabel = "خريج جديد";
      } else if (credits >= 90) {
        standing = "internship_ready";
        standingLabel = "جاهز للتدريب";
      } else if (credits >= 60) {
        standing = "third_year";
        standingLabel = "طالب سنة ثالثة";
      }

      // Map core programming courses
      const coreCourses: CoreCourseGrade[] = [
        {
          courseCode: "CS211",
          courseName: "تراكيب البيانات والخوارزميات (Data Structures & Algorithms)",
          grade: isDeyaa ? "A" : "B+",
          score: isDeyaa ? 94 : 86,
          credits: 3,
          semester: "خريف 2024",
          verified: true,
        },
        {
          courseCode: "CS112",
          courseName: "البرمجة كائنية التوجه (Object-Oriented Programming)",
          grade: isDeyaa ? "A" : "A-",
          score: isDeyaa ? 95 : 90,
          credits: 3,
          semester: "ربيع 2024",
          verified: true,
        },
        {
          courseCode: "CS341",
          courseName: "أنظمة قواعد البيانات (Database Systems)",
          grade: isDeyaa ? "A-" : "B",
          score: isDeyaa ? 91 : 84,
          credits: 3,
          semester: "خريف 2025",
          verified: true,
        },
      ];

      return {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        targetRole: isDeyaa ? "Full Stack Engineer (React / Next.js / Node.js)" : "Software Engineering Trainee",
        university: student.university?.name || "جامعة عمان الأهلية",
        major: student.major || "علم الحاسوب وتكنولوجيا المعلومات",
        gpa,
        completedCredits: credits,
        totalCredits: student.totalCredits || 136,
        academicStanding: standing,
        standingLabel,
        workTypes: ["internship", "part_time", "full_time"],
        verifiedSkills: isDeyaa
          ? ["React", "TypeScript", "Next.js", "Node.js", "Docker", "PostgreSQL", "Tailwind CSS", "Prisma", "WebAuthn"]
          : parsedSkills,
        githubUrl: student.github || (isDeyaa ? "https://github.com/dedo159" : undefined),
        linkedInUrl: isDeyaa ? "https://linkedin.com/in/deyaa-dev" : undefined,
        portfolioUrl: student.portfolio || undefined,
        email: student.email,
        phone: "+962 7 9000 1234",
        bio: isDeyaa
          ? "مطور برمجيات Full-Stack شغوف ببناء منصات الويب الحديثة وحلول الذكاء الاصطناعي التفاعلية، أمتلك خبرة عملية في بنية Next.js 16، معايير الأمان المتقدمة (WebAuthn Passkeys)، وإدارة قواعد البيانات السحابية."
          : "طالب علم حاسوب أسعى للمساهمة في بيئة برمجية وتطوير قدراتي الهندسية في مشاريع حقيقية.",
        featured: isDeyaa,
        aiAudit: {
          readinessScore: isDeyaa ? 92 : 72,
          marketReadinessLabel: isDeyaa ? "92% Job Market Ready" : "72% Job Market Ready",
          recommendationLevel: isDeyaa ? "جاهز للتوظيف الفوري" : "مؤهل لتدريب عملي",
          threeLineStrengths: isDeyaa
            ? [
                "فهم معمق لمعمارية Next.js 16 وتكاملات قواعد البيانات عبر Prisma و Neon PostgreSQL.",
                "بناء ميزات أمان متقدمة وحلول مصادقة بدون كلمات مرور (WebAuthn Passkeys) بمعايير إنتاجية.",
                "كتابة كود TypeScript نموذجي مع التزام بتنسيقات التصميم النظيف وأفضل ممارسات إدارة الحالة."
              ]
            : [
                "استيعاب جيد للمفاهيم الأساسية في البرمجة كائنية التوجه وتصميم قواعد البيانات.",
                "حماس ورغبة مستمرة في التعلم والمشاركة في مشاريع التدريب العملي.",
                "التزام أكاديمي ملحوظ في المواد الهندسية التأسيسية."
              ],
          skillGaps: isDeyaa
            ? [
                {
                  skill: "Kubernetes Cluster Management",
                  impact: "منخفض",
                  recommendation: "التعمق في إدارة العناقيد السحابية وتنسيق الحاويات على نطاق واسع."
                },
                {
                  skill: "Automated E2E Testing (Playwright / Cypress)",
                  impact: "متوسط",
                  recommendation: "أتمتة سيناريوهات الاختبارات الشاملة لواجهات المستخدم."
                }
              ]
            : [
                {
                  skill: "Modern Frontend (React & Next.js)",
                  impact: "مرتفع",
                  recommendation: "بناء مشاريع عملية متكاملة باستخدام React و TypeScript لتوسيع محفظة الأعمال."
                },
                {
                  skill: "Git & Collaborative Workflows",
                  impact: "مرتفع",
                  recommendation: "المشاركة في مستودعات مفتوحة المصدر وتطبيق Git Flow."
                }
              ],
          overallAssessment: isDeyaa
            ? "مرشح استثنائي يمتلك مزيجاً نادراً من المهارات العملية وهندسة البرمجيات المتكاملة، ومشاريع قائمة تبرهن كفاءته."
            : "مرشح واعد مناسب لبرامج التدريب والتأهيل الداخلي في الشركات التقنية."
        },
        gitHubProof: {
          publicRepos: isDeyaa ? 24 : 6,
          totalCommitsPastYear: isDeyaa ? 620 : 84,
          commitStreakDays: isDeyaa ? 38 : 5,
          topLanguages: isDeyaa
            ? [
                { name: "TypeScript", percentage: 65, color: "#3178c6" },
                { name: "JavaScript", percentage: 20, color: "#f7df1e" },
                { name: "CSS / Tailwind", percentage: 10, color: "#38bdf8" },
                { name: "Prisma Schema", percentage: 5, color: "#2d3748" }
              ]
            : [
                { name: "Java", percentage: 60, color: "#b07219" },
                { name: "SQL", percentage: 25, color: "#e38c00" },
                { name: "HTML/CSS", percentage: 15, color: "#e34f26" }
              ],
          pullRequestsMerged: isDeyaa ? 48 : 4,
          codeQualityRating: isDeyaa ? "A+" : "B+"
        },
        topProjects: isDeyaa
          ? [
              {
                id: "proj-deyaa-1",
                title: "منصة مسار الأكاديمية والمهنية (Masar Platform)",
                tagline: "نظام بيئي تعليمي ومهني متكامل يربط الطلاب والجامعات ومسؤولي التوظيف",
                description: "بناء منصة متطورة باستخدام Next.js 16، Prisma، و TypeScript تقدم بوابات مخصصة للطلاب، الشركات، الجامعات، والشركاء التجاريين، مع فحص تدقيق الجاهزية المهنية عبر الذكاء الاصطناعي.",
                githubUrl: "https://github.com/dedo159/masar",
                stars: 45,
                forks: 12,
                languages: ["TypeScript", "Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
                architectureHighlights: [
                  "تطبيق مبادئ Next.js 16 و Turbopack مع أداء استجابة فائق",
                  "نظام مصادقة متقدم يدعم Passkeys (WebAuthn) وجلسات آمنة",
                  "محرك بحث وفلترة متقدم للمواهب التقنية مع مؤشرات الذكاء الاصطناعي"
                ],
                readmePreview: `# Masar Platform — منصة مسار الأكاديمية والمهنية 🚀
A modern academic companion and talent discovery platform for university students and tech recruiters.

## Technical Architecture
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **UI Engine**: Tailwind CSS with OKLCH Monochrome Design System
- **Security**: WebAuthn Passkeys, Session cookies, CSRF protection`
              },
              {
                id: "proj-deyaa-2",
                title: "Career Readiness AI Scanner — مدقق الجاهزية المهنية",
                tagline: "نظام تدقيق ذكي يفحص كود ومستودعات الطلاب ويحدد نقاط القوة والفجوات التقنية",
                description: "نظام مؤتمت يتصل بـ GitHub API و Gemini AI لاستخراج لغات البرمجة والمشاريع وتحليل جاهزية الطالب لسوق العمل دون إدخال يدوي.",
                githubUrl: "https://github.com/dedo159/masar",
                stars: 28,
                forks: 6,
                languages: ["TypeScript", "Node.js", "Gemini API", "Tailwind CSS"],
                architectureHighlights: [
                  "مسح آلي لبيانات ومستودعات GitHub العامة في الوقت الفعلي",
                  "توليد تقارير تقييم ذكية ومقترحات تحسين مخصصة",
                  "تكامل واجهات برمجة التطبيقات بنظام الكاش الذكي"
                ],
                readmePreview: `# Career Readiness AI Scanner 🧠
Autonomous audit module that evaluates student engineering competencies, Git commit habits, and tech stack versatility.`
              }
            ]
          : [
              {
                id: "proj-std-1",
                title: "نظام إدارة المكتبات الإلكتروني (Library Management)",
                tagline: "مشروع أكاديمي متكامل لتنظيم استعارة الكتب وإدارة بيانات الطلاب",
                description: "تطبيق سطح مكتب مكتوب بلغة Java مع واجهات JavaFX وقاعدة بيانات MySQL.",
                githubUrl: "https://github.com/student-demo/library-system",
                languages: ["Java", "MySQL"],
                architectureHighlights: [
                  "تطبيق مبادئ البرمجة كائنية التوجه OOP",
                  "الاتصال بقاعدة البيانات عبر JDBC",
                  "معالجة الاستثناءات والتحقق من صحة المدخلات"
                ],
                readmePreview: `# Academic Library System 📚
Java-based management system managing book lending workflows and student records.`
              }
            ],
        academicProof: {
          coreCourses,
          deanHonorRoll: isDeyaa,
          academicStandingNote: isDeyaa
            ? "سجل أكاديمي متميز مع إنجاز كافة متطلبات المواد البرمجية الأساسية بدرجات متفوقة."
            : "طالب منتظم في الخطة الدراسية مع تقدم مستمر في المواد التخصصية."
        }
      };
    }
  } catch (error) {
    console.warn("Failed to fetch student from DB, falling back to mock:", error);
  }

  return null;
}
