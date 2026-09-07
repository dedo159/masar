import { NextResponse } from "next/server";
import { getDegreeRequirements } from "@/lib/db-queries";

export async function GET() {
  try {
    const requirements = await getDegreeRequirements();
    // Return exact DegreeRequirement[] array shape
    return NextResponse.json(requirements);
  } catch (error) {
    console.error("GET /api/degree-progress error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
