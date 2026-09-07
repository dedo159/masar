import { NextResponse } from "next/server";
import { getTodayClasses } from "@/lib/db-queries";

export async function GET() {
  try {
    const todayClasses = await getTodayClasses();
    // Return exact TodayClass[] array shape
    return NextResponse.json(todayClasses);
  } catch (error) {
    console.error("GET /api/today-schedule error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
