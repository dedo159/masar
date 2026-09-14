import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DEFAULT_STUDENT_ID } from "@/lib/db-queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const studentId = session?.userType === "student" && session.userId ? session.userId : DEFAULT_STUDENT_ID;

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
          studentId,
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
        studentId,
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
