import { NextResponse } from "next/server";
import { getCourseById } from "@/lib/db-queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await getCourseById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    // Return exact CourseGrade object shape or null
    return NextResponse.json(course.grade || null);
  } catch (error) {
    console.error("GET /api/courses/[id]/grades error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
