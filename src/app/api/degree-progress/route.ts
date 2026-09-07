import { NextResponse } from "next/server";
import { getDegreeRequirements } from "@/lib/db-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const requirements = await getDegreeRequirements();
    return NextResponse.json(requirements, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/degree-progress error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
