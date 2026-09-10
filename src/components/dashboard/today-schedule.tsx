import { getTodayClasses } from "@/lib/db-queries";
import { TodayScheduleClient } from "./today-schedule-client";
import type { TodayClass } from "@/lib/types";

export async function TodayScheduleSection() {
  let todayClasses: TodayClass[] = [];
  try {
    todayClasses = await getTodayClasses();
  } catch (error) {
    console.error("TodayScheduleSection fetch error:", error);
    todayClasses = [];
  }

  return <TodayScheduleClient todayClasses={todayClasses} />;
}

