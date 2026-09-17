import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface ATSCandidate {
  id: string;
  studentId?: string;
  name: string;
  avatar?: string;
  university: string;
  major: string;
  gpa: number;
  readinessScore: number;
  topSkills: string[];
  appliedDate: string;
  status: "applied" | "technical_review" | "interview_scheduled" | "accepted" | "rejected";
  interviewDetails?: {
    type: "technical" | "hr";
    date: string;
    time: string;
    meetingUrl: string;
    codingNotes?: string;
  };
  rejectionReason?: string;
  constructiveFeedback?: string;
  email: string;
  phone?: string;
}

export interface ATSVacancy {
  id: string;
  title: string;
  workType: "onsite" | "hybrid" | "remote";
  department: string;
  slots: number;
  deadline: string;
  requirements: string[];
  candidates: ATSCandidate[];
}

// In-memory store initialized with rich data (synced with DB student & benchmarks)
export let INITIAL_VACANCIES: ATSVacancy[] = [
  {
    id: "vac-001",
    title: "متدرب تطوير واجهات وتطبيقات الويب (React / Next.js) — صيف 2026",
    workType: "hybrid",
    department: "Frontend Engineering",
    slots: 3,
    deadline: "2026-06-30",
    requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    candidates: [
      {
        id: "cand-deyaa",
        studentId: "202510377",
        name: "ضياء الدين عبدالرحمن",
        university: "جامعة عمان الأهلية",
        major: "علم الحاسوب وتكنولوجيا المعلومات",
        gpa: 3.5,
        readinessScore: 92,
        topSkills: ["Next.js", "TypeScript", "WebAuthn"],
        appliedDate: "منذ 3 ساعات",
        status: "technical_review",
        email: "deyaa@example.com",
        phone: "+962 7 9000 1234",
      },
      {
        id: "cand-001",
        name: "ليان أحمد الرواشدة",
        university: "الجامعة الأردنية (JU)",
        major: "هندسة البرمجيات",
        gpa: 3.82,
        readinessScore: 94,
        topSkills: ["React", "TypeScript", "Tailwind CSS"],
        appliedDate: "منذ يومين",
        status: "interview_scheduled",
        interviewDetails: {
          type: "technical",
          date: "2026-09-20",
          time: "11:00 AM",
          meetingUrl: "https://meet.google.com/abc-frontend-screen",
          codingNotes: "حل تمرين React State Management وبناء Custom Hook",
        },
        email: "layan.r@example.com",
        phone: "+962 7 9123 4567",
      },
      {
        id: "cand-007",
        name: "مايا يوسف الشريف",
        university: "جامعة الأميرة سمية (PSUT)",
        major: "هندسة البرمجيات",
        gpa: 3.55,
        readinessScore: 89,
        topSkills: ["Figma", "React", "Design Systems"],
        appliedDate: "منذ 5 أيام",
        status: "applied",
        email: "maya.s@example.com",
        phone: "+962 7 9333 4444",
      },
      {
        id: "cand-008",
        name: "عمر ناصر الطراونة",
        university: "جامعة مؤتة",
        major: "علوم الحاسوب",
        gpa: 3.45,
        readinessScore: 81,
        topSkills: ["JavaScript", "HTML5", "CSS3"],
        appliedDate: "منذ أسبوع",
        status: "applied",
        email: "omar.t@example.com",
      },
      {
        id: "cand-009",
        name: "رامي فهد المجالي",
        university: "الجامعة الهاشمية",
        major: "هندسة البرمجيات",
        gpa: 3.6,
        readinessScore: 88,
        topSkills: ["React", "Redux", "TypeScript"],
        appliedDate: "منذ أسبوعين",
        status: "accepted",
        email: "rami.m@example.com",
      },
    ],
  },
  {
    id: "vac-002",
    title: "متدرب هندسة الأنظمة الخلفية والخدمات المصغرة (Go / Node.js) — 2026",
    workType: "onsite",
    department: "Backend Infrastructure",
    slots: 2,
    deadline: "2026-07-15",
    requirements: ["Go", "Docker", "PostgreSQL", "Kafka"],
    candidates: [
      {
        id: "cand-002",
        name: "حمزة قاسم النعيمات",
        university: "جامعة العلوم والتكنولوجيا (JUST)",
        major: "علوم الحاسوب",
        gpa: 3.65,
        readinessScore: 91,
        topSkills: ["Go", "Docker", "PostgreSQL"],
        appliedDate: "أمس",
        status: "interview_scheduled",
        interviewDetails: {
          type: "technical",
          date: "2026-09-22",
          time: "02:00 PM",
          meetingUrl: "https://meet.google.com/xyz-backend-screen",
          codingNotes: "مناقشة بنية PulsePay المصغرة والتعامل مع Redis Locks",
        },
        email: "hamza.n@example.com",
        phone: "+962 7 8888 1234",
      },
      {
        id: "cand-006",
        name: "كريم خالد المصري",
        university: "الجامعة الهاشمية (HU)",
        major: "هندسة الحاسوب",
        gpa: 3.15,
        readinessScore: 78,
        topSkills: ["Java", "Spring Boot", "SQL"],
        appliedDate: "منذ 4 أيام",
        status: "technical_review",
        email: "kareem.m@example.com",
      },
    ],
  },
  {
    id: "vac-003",
    title: "متدرب تطوير تطبيقات الهواتف الذكية (Flutter / Dart) — 2026",
    workType: "remote",
    department: "Mobile Engineering",
    slots: 2,
    deadline: "2026-08-01",
    requirements: ["Flutter", "Dart", "Firebase", "Bloc"],
    candidates: [
      {
        id: "cand-003",
        name: "فرح إبراهيم الكردي",
        university: "جامعة الأميرة سمية (PSUT)",
        major: "علم البيانات والذكاء الاصطناعي",
        gpa: 3.91,
        readinessScore: 96,
        topSkills: ["Flutter", "Dart", "Bloc Pattern"],
        appliedDate: "اليوم",
        status: "accepted",
        email: "farah.k@example.com",
        phone: "+962 7 9991 9992",
      },
    ],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vacancyId = searchParams.get("vacancyId");

    // Also sync with real DB students if exists
    try {
      const dbStudent = await prisma.student.findFirst({
        where: { studentId: "202510377" },
      });
      if (dbStudent) {
        // Ensure deyaa is in vac-001 candidates
        const vac = INITIAL_VACANCIES.find((v) => v.id === "vac-001");
        if (vac) {
          const exists = vac.candidates.find((c) => c.id === "cand-deyaa");
          if (exists) {
            exists.name = dbStudent.name;
            exists.gpa = dbStudent.gpa || 3.5;
          }
        }
      }
    } catch {
      // Ignore DB sync error in fallback
    }

    if (vacancyId) {
      const vacancy = INITIAL_VACANCIES.find((v) => v.id === vacancyId);
      if (!vacancy) {
        return NextResponse.json({ error: "الشاغر غير موجود" }, { status: 404 });
      }
      return NextResponse.json({ success: true, vacancy });
    }

    return NextResponse.json({
      success: true,
      vacancies: INITIAL_VACANCIES.map((v) => ({
        id: v.id,
        title: v.title,
        workType: v.workType,
        department: v.department,
        slots: v.slots,
        deadline: v.deadline,
        totalApplicants: v.candidates.length,
      })),
      selectedVacancy: INITIAL_VACANCIES[0],
    });
  } catch (error: any) {
    console.error("ATS GET error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات المتقدمين" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { vacancyId, candidateId, newStatus, interviewDetails, rejectionReason, constructiveFeedback } = body;

    if (!vacancyId || !candidateId || !newStatus) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    const vacancy = INITIAL_VACANCIES.find((v) => v.id === vacancyId);
    if (!vacancy) {
      return NextResponse.json({ error: "الشاغر غير موجود" }, { status: 404 });
    }

    const candidate = vacancy.candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return NextResponse.json({ error: "المرشح غير موجود في هذا الشاغر" }, { status: 404 });
    }

    candidate.status = newStatus;
    if (interviewDetails) {
      candidate.interviewDetails = interviewDetails;
    }
    if (rejectionReason) {
      candidate.rejectionReason = rejectionReason;
    }
    if (constructiveFeedback) {
      candidate.constructiveFeedback = constructiveFeedback;
    }

    return NextResponse.json({
      success: true,
      candidate,
      message: "تم تحديث حالة المرشح بنجاح",
    });
  } catch (error: any) {
    console.error("ATS PATCH error:", error);
    return NextResponse.json({ error: "فشل تحديث حالة المرشح" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, workType, department, slots, deadline, requirements } = body;

    if (!title) {
      return NextResponse.json({ error: "عنوان الشاغر مطلوب" }, { status: 400 });
    }

    const newVac: ATSVacancy = {
      id: `vac-${Date.now()}`,
      title,
      workType: workType || "hybrid",
      department: department || "الهندسة والبرمجيات",
      slots: Number(slots) || 1,
      deadline: deadline || "2026-08-30",
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(",").map((s: string) => s.trim()) : ["React", "TypeScript"]),
      candidates: [],
    };

    INITIAL_VACANCIES.unshift(newVac);

    return NextResponse.json({
      success: true,
      vacancy: newVac,
      message: "تمت إضافة الشاغر التدريبي الجديد بنجاح",
    }, { status: 201 });
  } catch (error: any) {
    console.error("ATS POST error:", error);
    return NextResponse.json({ error: "فشل إنشاء الشاغر التدريبي" }, { status: 500 });
  }
}
