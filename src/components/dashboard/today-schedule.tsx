import { getTodayClasses } from "@/lib/db-queries";
import { getSession } from "@/lib/auth";
import { TodayScheduleClient } from "./today-schedule-client";
import type { TodayClass } from "@/lib/types";

export async function TodayScheduleSection() {
  let todayClasses: TodayClass[] = [];
  let studentId = "";
  try {
    todayClasses = await getTodayClasses();
    const session = await getSession();
    if (session?.userId) {
      studentId = session.userId;
    }
  } catch (error) {
    console.error("TodayScheduleSection fetch error:", error);
    todayClasses = [];
  }

  return <TodayScheduleClient todayClasses={todayClasses} studentId={studentId} />;
}

