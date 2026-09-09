import { prisma } from '@/lib/prisma';

/**
 * حساب مؤشرات الطالب التحليلية
 * كل معادلة محسوبة من بيانات حقيقية مخزنة — لا أرقام وهمية
 */

/** معدل التسليم في الموعد */
export async function computeOnTimeRate(studentId: string): Promise<number> {
  const totalAssignments = await prisma.submission.count({
    where: { studentId },
  });

  if (totalAssignments === 0) return 0;

  const onTimeSubmissions = await prisma.submission.count({
    where: {
      studentId,
      status: { in: ['submitted', 'graded'] },
    },
  });

  return Math.round((onTimeSubmissions / totalAssignments) * 100);
}

/** نسبة التفاعل مع المحتوى */
export async function computeEngagementRate(studentId: string): Promise<number> {
  // عدد مشاهدات المحتوى
  const viewsCount = await prisma.contentView.count({
    where: { studentId },
  });

  // عدد الملفات المتاحة في المواد المسجل فيها
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    select: { courseId: true },
  });

  const courseIds = enrollments.map(e => e.courseId);
  if (courseIds.length === 0) return 0;

  const totalFiles = await prisma.courseFile.count({
    where: { courseId: { in: courseIds } },
  });

  if (totalFiles === 0) return viewsCount > 0 ? 100 : 0;

  return Math.min(100, Math.round((viewsCount / totalFiles) * 100));
}

/** درجة الصحة الأكاديمية (0-100) */
export async function computeAcademicHealthScore(studentId: string): Promise<{
  score: number;
  onTimeRate: number;
  avgGrade: number;
  engagementRate: number;
}> {
  const onTimeRate = await computeOnTimeRate(studentId);
  const engagementRate = await computeEngagementRate(studentId);

  // متوسط الدرجات من التسليمات المُقيّمة
  const gradedSubmissions = await prisma.submission.findMany({
    where: {
      studentId,
      grade: { not: null },
    },
    include: { assignment: { select: { maxGrade: true } } },
  });

  let avgGrade = 0;
  if (gradedSubmissions.length > 0) {
    const normalizedGrades = gradedSubmissions.map(s => {
      const max = s.assignment.maxGrade || 100;
      return ((s.grade || 0) / max) * 100;
    });
    avgGrade = Math.round(
      normalizedGrades.reduce((sum, g) => sum + g, 0) / normalizedGrades.length
    );
  }

  // المعادلة: 40% تسليم بالوقت + 30% درجات + 30% تفاعل
  const score = Math.round(
    (onTimeRate * 0.4) + (avgGrade * 0.3) + (engagementRate * 0.3)
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    onTimeRate,
    avgGrade,
    engagementRate,
  };
}

/** درجة الجاهزية المهنية (0-100) */
export async function computeCareerReadinessScore(studentId: string): Promise<{
  score: number;
  hasGithub: boolean;
  hasPortfolio: boolean;
  skillsCount: number;
  applicationsCount: number;
}> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { github: true, portfolio: true },
  });

  const hasGithub = !!(student?.github && student.github.trim().length > 0);
  const hasPortfolio = !!(student?.portfolio && student.portfolio.trim().length > 0);

  const skillsCount = await prisma.studentSkill.count({
    where: { studentId },
  });

  const applicationsCount = await prisma.internshipApplication.count({
    where: { studentId },
  });

  // المعادلة: GitHub (20) + Portfolio (20) + مهارات (5 لكل مهارة, max 30) + طلبات (5 لكل طلب, max 30)
  const score =
    (hasGithub ? 20 : 0) +
    (hasPortfolio ? 20 : 0) +
    Math.min(30, skillsCount * 5) +
    Math.min(30, applicationsCount * 5);

  return {
    score: Math.min(100, score),
    hasGithub,
    hasPortfolio,
    skillsCount,
    applicationsCount,
  };
}

/** ملخص طلبات التدريب */
export async function computeApplicationsSummary(studentId: string) {
  const applications = await prisma.internshipApplication.findMany({
    where: { studentId },
    include: {
      internship: {
        select: { title: true, company: true },
      },
    },
    orderBy: { appliedAt: 'desc' },
    take: 10,
  });

  const statusCounts = await prisma.internshipApplication.groupBy({
    by: ['status'],
    where: { studentId },
    _count: true,
  });

  return {
    recent: applications.map(a => ({
      id: a.id,
      title: a.internship.title,
      company: a.internship.company,
      status: a.status,
      appliedAt: a.appliedAt.toISOString(),
    })),
    statusBreakdown: statusCounts.reduce((acc, s) => {
      acc[s.status] = s._count;
      return acc;
    }, {} as Record<string, number>),
  };
}

/** خريطة حرارة الأعباء — عدد الواجبات لكل يوم خلال 4 أسابيع */
export async function computeWorkloadHeatmap(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    select: { courseId: true },
  });

  const courseIds = enrollments.map(e => e.courseId);
  
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const fourWeeksAhead = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: { in: courseIds },
      dueDate: {
        gte: fourWeeksAgo.toISOString().split('T')[0],
        lte: fourWeeksAhead.toISOString().split('T')[0],
      },
    },
    select: { dueDate: true },
  });

  // Group by date
  const heatmap: Record<string, number> = {};
  for (const a of assignments) {
    heatmap[a.dueDate] = (heatmap[a.dueDate] || 0) + 1;
  }

  return heatmap;
}
