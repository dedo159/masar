import { NextResponse } from "next/server";
import { getEnrolledCourses } from "@/lib/db-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const courses = await getEnrolledCourses();
    return NextResponse.json(courses, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
