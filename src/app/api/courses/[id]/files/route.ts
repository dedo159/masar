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
    // Return exact CourseFile[] array shape
    return NextResponse.json(course.files);
  } catch (error) {
    console.error("GET /api/courses/[id]/files error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
