import { NextResponse } from "next/server";
import { getStudentProfile, DEFAULT_STUDENT_ID } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const student = await getStudentProfile();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET /api/students/me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { major, name } = body;

    const updated = await prisma.student.updateMany({
      where: {
        OR: [
          { id: DEFAULT_STUDENT_ID },
          { id: "s-001" },
        ],
      },
      data: {
        ...(major && typeof major === "string" ? { major: major.trim() } : {}),
        ...(name && typeof name === "string" ? { name: name.trim() } : {}),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("PATCH /api/students/me error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
