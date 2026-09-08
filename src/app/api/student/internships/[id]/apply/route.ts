import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Default student ID (TODO: replace with real auth session later)
const DEFAULT_STUDENT_ID = "s-001";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: internshipId } = await params;

    // Verify internship exists
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "فرصة التدريب غير موجودة" },
        { status: 404 }
      );
    }

    // Check if already applied
    const existing = await prisma.internshipApplication.findUnique({
      where: {
        studentId_internshipId: {
          studentId: DEFAULT_STUDENT_ID,
          internshipId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "لقد قدمت على هذه الفرصة مسبقاً", application: existing },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.internshipApplication.create({
      data: {
        internshipId,
        studentId: DEFAULT_STUDENT_ID,
        status: "pending",
      },
    });

    return NextResponse.json(
      { success: true, application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء التقديم" },
      { status: 500 }
    );
  }
}
