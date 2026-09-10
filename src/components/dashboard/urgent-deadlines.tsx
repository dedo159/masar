import { getEnrolledCourses } from "@/lib/db-queries";
import { getDeadlineStatus } from "@/lib/utils";
import { UrgentDeadlinesClient, type DeadlineItem } from "./urgent-deadlines-client";
import type { Course } from "@/lib/types";

export async function UrgentDeadlinesSection() {
  let courses: Course[] = [];
  try {
    courses = await getEnrolledCourses();
  } catch (error) {
    console.error("UrgentDeadlinesSection fetch error:", error);
    courses = [];
  }

  const upcoming: DeadlineItem[] = courses
    .flatMap((c) =>
      c.assignments
        .filter((a) => a.status === "pending")
        .map((a) => ({
          ...a,
          courseNameAr: c.nameAr,
          courseNameEn: c.nameEn,
          courseId: c.id,
          courseColor: c.color,
        }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const urgentCount = upcoming.filter(
    (a) => getDeadlineStatus(a.dueDate, a.dueTime) === "urgent"
  ).length;

  return <UrgentDeadlinesClient upcoming={upcoming} urgentCount={urgentCount} />;
}

