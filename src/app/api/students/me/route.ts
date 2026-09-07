import { NextResponse } from "next/server";
import { getStudentProfile } from "@/lib/db-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const student = await getStudentProfile();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/students/me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
