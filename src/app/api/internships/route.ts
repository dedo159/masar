import { NextResponse } from "next/server";
import { getInternships } from "@/lib/db-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const internships = await getInternships();
    return NextResponse.json(internships, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/internships error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
