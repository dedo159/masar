import { NextResponse } from "next/server";
import { getEnrolledCourses } from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await getEnrolledCourses();
    return NextResponse.json(courses, {
      
    });
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
