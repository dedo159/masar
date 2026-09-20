import { getEnrolledCourses } from "@/lib/db-queries";
import { QuickStatsClient } from "./quick-stats-client";

export async function QuickStatsSection() {
  const courses = await getEnrolledCourses().catch(() => []);

  const now = new Date();
  const todayDateString = now.toDateString();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const allAssignments = courses.flatMap((c) => c.assignments || []);
  const todayDueAssignmentsCount = allAssignments.filter((a) => {
    if (a.status === "submitted" || a.status === "graded") return false;
    if (!a.dueDate) return false;
    if (a.dueDate.startsWith(todayStr)) return true;
    try {
      return new Date(a.dueDate).toDateString() === todayDateString;
    } catch {
      return false;
    }
  }).length;

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 3), 0);

  return (
    <QuickStatsClient
      coursesCount={courses.length}
      todayDueCount={todayDueAssignmentsCount}
      totalAssignmentsCount={allAssignments.length}
      totalCredits={totalCredits}
    />
  );
}
