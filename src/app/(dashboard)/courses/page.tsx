import { getEnrolledCourses, getAllRegisteredCourses } from "@/lib/db-queries";
import { CoursesClient } from "./courses-client";

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const [enrolledCourses, allRegisteredCourses] = await Promise.all([
    getEnrolledCourses().catch(() => []),
    getAllRegisteredCourses().catch(() => []),
  ]);

  const activeCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 3), 0);
  const totalRegisteredCredits = allRegisteredCourses.reduce((sum, c) => sum + (c.credits || 3), 0);

  return (
    <CoursesClient
      enrolledCourses={enrolledCourses}
      allRegisteredCourses={allRegisteredCourses}
      totalCredits={activeCredits > 0 ? activeCredits : totalRegisteredCredits}
    />
  );
}

