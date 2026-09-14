import { DEFAULT_STUDENT_ID, getStudentProfile, resolveCurrentStudentId } from "@/lib/db-queries";
import {
  computeAcademicHealthScore,
  computeCareerReadinessScore,
} from "@/lib/analytics/compute-student-metrics";
import { prisma } from "@/lib/prisma";
import { GrowthClient } from "./growth-client";

export const revalidate = 60;

export default async function StudentGrowthPage() {
  const studentId = await resolveCurrentStudentId();

  // Fetch data in parallel
  const [
    healthMetrics,
    careerMetrics,
    studentProfile,
    studentSkills,
  ] = await Promise.all([
    computeAcademicHealthScore(studentId).catch(() => ({ score: 75, onTimeRate: 80, avgGrade: 75, engagementRate: 70 })),
    computeCareerReadinessScore(studentId).catch(() => ({ score: 65 })),
    getStudentProfile(studentId).catch(() => null),
    prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
    }).catch(() => []),
  ]);

  return (
    <GrowthClient
      healthMetrics={healthMetrics}
      careerMetrics={careerMetrics}
      studentProfile={studentProfile}
      studentSkills={studentSkills}
    />
  );
}

