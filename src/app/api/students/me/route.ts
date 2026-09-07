import { NextResponse } from "next/server";
import { getStudentProfile } from "@/lib/db-queries";

export async function GET() {
  try {
    const student = await getStudentProfile();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    // Return exact Student object shape
    return NextResponse.json(student);
  } catch (error) {
    console.error("GET /api/students/me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
