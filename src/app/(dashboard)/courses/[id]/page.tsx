import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/db-queries";
import { CourseDetailClient } from "./course-detail-client";

export const revalidate = 60;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return <CourseDetailClient course={course} />;
}

