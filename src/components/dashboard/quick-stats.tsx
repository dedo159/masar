import { getEnrolledCourses, getInternships } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { QuickStatsClient } from "./quick-stats-client";

export async function QuickStatsSection() {
  const [courses, internships, dealsCount] = await Promise.all([
    getEnrolledCourses().catch(() => []),
    getInternships().catch(() => []),
    prisma.merchantDeal.count({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
      },
    }).catch(() => 0),
  ]);

  const now = new Date();
  const todayDateString = now.toDateString();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const todayDueAssignmentsCount = courses
    .flatMap((c) => c.assignments || [])
    .filter((a) => {
      if (a.status === "submitted" || a.status === "graded") return false;
      if (!a.dueDate) return false;
      if (a.dueDate.startsWith(todayStr)) return true;
      try {
        return new Date(a.dueDate).toDateString() === todayDateString;
      } catch {
        return false;
      }
    }).length;

  return (
    <QuickStatsClient
      coursesCount={courses.length}
      todayDueCount={todayDueAssignmentsCount}
      internshipsCount={internships.length}
      dealsCount={dealsCount}
    />
  );
}
