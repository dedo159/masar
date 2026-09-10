import { getEnrolledCourses } from "@/lib/db-queries";
import { CoursesClient } from "./courses-client";

export const revalidate = 60;

export default async function CoursesPage() {
  let enrolledCourses = [];
  try {
    const courses = await getEnrolledCourses();
    enrolledCourses = courses.filter((c) => c.status === "enrolled");
  } catch (error) {
    console.error("CoursesPage data fetch error:", error);
    throw error;
  }

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 3), 0);

  return <CoursesClient enrolledCourses={enrolledCourses} totalCredits={totalCredits} />;
}

