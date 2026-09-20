import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export interface OutreachMessage {
  id: string;
  candidateId: string;
  sender: "recruiter" | "candidate";
  text: string;
  timestamp: string;
  read: boolean;
}

// In-memory message store with initial mock messages
const MESSAGES_STORE: Record<string, OutreachMessage[]> = {
  "cand-deyaa": [
    {
      id: "m-1",
      candidateId: "cand-deyaa",
      sender: "recruiter",
      text: "مرحباً ضياء، اطلعنا على ملفك البرمجي ومشاريعك على منصة مسار، مشروع مسار ونظام الـ Passkeys مثير للإعجاب جداً.",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: "m-2",
      candidateId: "cand-deyaa",
      sender: "candidate",
      text: "أهلاً بكم! شكراً جزيلاً، يسعدني مناقشة انضمامي لفريق التدريب والمساهمة في بيئة العمل لديكم.",
      timestamp: "10:45 AM",
      read: true,
    },
  ],
  "cand-001": [
    {
      id: "m-3",
      candidateId: "cand-001",
      sender: "recruiter",
      text: "مرحباً ليان، تم ترشيحك للمقابلة التقنية غداً في تمام الساعة 11:00 صباحاً عبر الرابط المرفق.",
      timestamp: "أمس",
      read: true,
    },
    {
      id: "m-4",
      candidateId: "cand-001",
      sender: "candidate",
      text: "تم الاستلام وتأكيد الموعد، شكراً لكم.",
      timestamp: "أمس",
      read: true,
    },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");

    if (!candidateId) {
      return NextResponse.json({ error: "معرف المرشح مطلوب" }, { status: 400 });
    }

    const messages = MESSAGES_STORE[candidateId] || [
      {
        id: `m-init-${Date.now()}`,
        candidateId,
        sender: "recruiter",
        text: "مرحباً، يمكنك التواصل مع المرشح هنا مباشرة وتوجيه أي استفسارات أو تفاصيل خاصة بالتدريب.",
        timestamp: "الآن",
        read: true,
      },
    ];

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    console.error("Outreach GET error:", error);
    return NextResponse.json({ error: "فشل تحميل المحادثات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لإرسال الرسائل" }, { status: 401 });
    }

    const body = await request.json();
    const { candidateId, text, sender: requestedSender } = body;
    const sender = session.userType === "recruiter" ? "recruiter" : (requestedSender || "candidate");

    if (!candidateId || !text) {
      return NextResponse.json({ error: "المرشح ونص الرسالة مطلوبان" }, { status: 400 });
    }

    if (!MESSAGES_STORE[candidateId]) {
      MESSAGES_STORE[candidateId] = [];
    }

    const newMsg: OutreachMessage = {
      id: `msg-${Date.now()}`,
      candidateId,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };

    MESSAGES_STORE[candidateId].push(newMsg);

    return NextResponse.json({
      success: true,
      message: newMsg,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Outreach POST error:", error);
    return NextResponse.json({ error: "فشل إرسال الرسالة" }, { status: 500 });
  }
}
