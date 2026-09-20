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
    candidates: [],
  },
  {
    id: "vac-002",
    title: "متدرب هندسة الأنظمة الخلفية والخدمات المصغرة (Go / Node.js) — 2026",
    workType: "onsite",
    department: "Backend Infrastructure",
    slots: 2,
    deadline: "2026-07-15",
    requirements: ["Go", "Docker", "PostgreSQL", "Kafka"],
    candidates: [],
  },
  {
    id: "vac-003",
    title: "متدرب تطوير تطبيقات الهواتف الذكية (Flutter / Dart) — 2026",
    workType: "remote",
    department: "Mobile Engineering",
    slots: 2,
    deadline: "2026-08-01",
    requirements: ["Flutter", "Dart", "Firebase", "Bloc"],
    candidates: [],
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
