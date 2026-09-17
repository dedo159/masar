import { NextResponse } from "next/server";
import { getTalentCandidateById } from "@/lib/talents-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "معرف المرشح مطلوب" }, { status: 400 });
    }

    const candidate = await getTalentCandidateById(id);

    if (!candidate) {
      return NextResponse.json({ error: "لم يتم العثور على ملف المرشح" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      candidate,
    });
  } catch (error: any) {
    console.error("Candidate profile lookup error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب ملف المرشح" },
      { status: 500 }
    );
  }
}
