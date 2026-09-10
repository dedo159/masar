import { DEFAULT_STUDENT_ID, getDegreeRequirements, getStudentProfile } from "@/lib/db-queries";
import {
  computeAcademicHealthScore,
  computeCareerReadinessScore,
} from "@/lib/analytics/compute-student-metrics";
import { prisma } from "@/lib/prisma";
import { GrowthClient } from "./growth-client";

export const revalidate = 60;

export default async function StudentGrowthPage() {
  const studentId = DEFAULT_STUDENT_ID;

  // Fetch data in parallel
  const [
    healthMetrics,
    careerMetrics,
    degreeRequirements,
    studentProfile,
    studentSkills,
  ] = await Promise.all([
    computeAcademicHealthScore(studentId).catch(() => ({ score: 75, onTimeRate: 80, avgGrade: 75, engagementRate: 70 })),
    computeCareerReadinessScore(studentId).catch(() => ({ score: 65 })),
    getDegreeRequirements(studentId).catch(() => []),
    getStudentProfile(studentId).catch(() => null),
    prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
    }).catch(() => []),
  ]);

  const totalCredits = degreeRequirements.reduce((sum, r) => sum + r.totalCredits, 0) || studentProfile?.totalCredits || 132;
  const completedCredits = degreeRequirements.reduce((sum, r) => sum + r.completedCredits, 0) || studentProfile?.completedCredits || 0;
  const degreePercentage = totalCredits > 0 ? Math.min(100, Math.round((completedCredits / totalCredits) * 100)) : 0;
  const remainingCredits = Math.max(0, totalCredits - completedCredits);

  return (
    <GrowthClient
      healthMetrics={healthMetrics}
      careerMetrics={careerMetrics}
      degreeRequirements={degreeRequirements as any}
      studentProfile={studentProfile}
      studentSkills={studentSkills}
      totalCredits={totalCredits}
      completedCredits={completedCredits}
      degreePercentage={degreePercentage}
      remainingCredits={remainingCredits}
    />
  );
}

