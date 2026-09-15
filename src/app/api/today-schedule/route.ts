import { NextResponse } from "next/server";
import { getTodayClasses } from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const todayClasses = await getTodayClasses();
    return NextResponse.json(todayClasses, {
      
    });
  } catch (error) {
    console.error("GET /api/today-schedule error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
