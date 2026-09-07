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
    // Return exact Assignment[] array shape
    return NextResponse.json(course.assignments);
  } catch (error) {
    console.error("GET /api/courses/[id]/assignments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
