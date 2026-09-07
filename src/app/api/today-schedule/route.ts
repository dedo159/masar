import { NextResponse } from "next/server";
import { getTodayClasses } from "@/lib/db-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const todayClasses = await getTodayClasses();
    return NextResponse.json(todayClasses, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/today-schedule error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
