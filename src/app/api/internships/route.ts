import { NextResponse } from "next/server";
import { getInternships } from "@/lib/db-queries";

export async function GET() {
  try {
    const internships = await getInternships();
    // Return exact Internship[] array shape
    return NextResponse.json(internships);
  } catch (error) {
    console.error("GET /api/internships error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
