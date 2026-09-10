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
    const { major, name, skills, github, portfolio } = body;

    const dataToUpdate: Record<string, unknown> = {};
    if (major && typeof major === "string") dataToUpdate.major = major.trim();
    if (name && typeof name === "string") dataToUpdate.name = name.trim();
    if (skills && Array.isArray(skills)) dataToUpdate.skills = JSON.stringify(skills);
    if (github !== undefined && typeof github === "string") dataToUpdate.github = github.trim();
    if (portfolio !== undefined && typeof portfolio === "string") dataToUpdate.portfolio = portfolio.trim();

    const updated = await prisma.student.updateMany({
      where: {
        OR: [
          { id: DEFAULT_STUDENT_ID },
          { id: "s-001" },
        ],
      },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("PATCH /api/students/me error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
