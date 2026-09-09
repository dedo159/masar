import { prisma } from '@/lib/prisma';

/**
 * حساب مؤشرات فرص التدريب التحليلية
 * كل معادلة محسوبة من بيانات حقيقية — لا أرقام وهمية
 */

/** مؤشرات فرصة تدريب واحدة */
export async function computeSingleInternshipMetrics(internshipId: string) {
  const internship = await prisma.internship.findUnique({
    where: { id: internshipId },
    select: { viewsCount: true, title: true, company: true },
  });

  if (!internship) return null;

  const applicationsCount = await prisma.internshipApplication.count({
    where: { internshipId },
  });

  // معدل التقديم = عدد الطلبات / عدد المشاهدات
  const applicationRate = internship.viewsCount > 0
    ? Math.round((applicationsCount / internship.viewsCount) * 100)
    : 0;

  // توزيع حالات الطلبات
  const statusDistribution = await prisma.internshipApplication.groupBy({
    by: ['status'],
    where: { internshipId },
    _count: true,
  });

  // متوسط وقت المراجعة (بالأيام)
  const reviewedApplications = await prisma.internshipApplication.findMany({
    where: {
      internshipId,
      reviewedAt: { not: null },
    },
    select: { appliedAt: true, reviewedAt: true },
  });

  let avgReviewDays = 0;
  if (reviewedApplications.length > 0) {
    const totalDays = reviewedApplications.reduce((sum, app) => {
      const diff = (app.reviewedAt!.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + diff;
    }, 0);
    avgReviewDays = Math.round((totalDays / reviewedApplications.length) * 10) / 10;
  }

  return {
    internshipId,
    title: internship.title,
    company: internship.company,
    viewsCount: internship.viewsCount,
    applicationsCount,
    applicationRate,
    avgReviewDays,
    statusDistribution: statusDistribution.reduce((acc, s) => {
      acc[s.status] = s._count;
      return acc;
    }, {} as Record<string, number>),
  };
}

/** مؤشرات تجميعية لجميع فرص شركة محددة */
export async function computeCompanyInternshipMetrics(companyId: string) {
  const internships = await prisma.internship.findMany({
    where: { companyId },
    select: { id: true, title: true, viewsCount: true },
  });

  const totalInternships = internships.length;

  const totalApplications = await prisma.internshipApplication.count({
    where: { internship: { companyId } },
  });

  // قمع التوظيف
  const funnelData = await prisma.internshipApplication.groupBy({
    by: ['status'],
    where: { internship: { companyId } },
    _count: true,
  });

  const funnel = funnelData.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  // نسبة القبول
  const acceptedCount = funnel['accepted'] || 0;
  const acceptanceRate = totalApplications > 0
    ? Math.round((acceptedCount / totalApplications) * 100)
    : 0;

  // متوسط وقت المراجعة
  const reviewedApps = await prisma.internshipApplication.findMany({
    where: {
      internship: { companyId },
      reviewedAt: { not: null },
    },
    select: { appliedAt: true, reviewedAt: true },
  });

  let avgReviewDays = 0;
  if (reviewedApps.length > 0) {
    const totalDays = reviewedApps.reduce((sum, app) => {
      const diff = (app.reviewedAt!.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + diff;
    }, 0);
    avgReviewDays = Math.round((totalDays / reviewedApps.length) * 10) / 10;
  }

  // المهارات الأكثر طلباً
  const requiredSkills = await prisma.internshipRequiredSkill.findMany({
    where: { internship: { companyId } },
    include: { skill: { select: { name: true, category: true } } },
  });

  const skillCounts: Record<string, { name: string; count: number }> = {};
  for (const rs of requiredSkills) {
    if (!skillCounts[rs.skillId]) {
      skillCounts[rs.skillId] = { name: rs.skill.name, count: 0 };
    }
    skillCounts[rs.skillId].count++;
  }

  const topSkills = Object.values(skillCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // مؤشرات لكل فرصة
  const perInternship = await Promise.all(
    internships.map(async (i) => {
      const appCount = await prisma.internshipApplication.count({
        where: { internshipId: i.id },
      });
      return {
        id: i.id,
        title: i.title,
        viewsCount: i.viewsCount,
        applicationsCount: appCount,
        applicationRate: i.viewsCount > 0
          ? Math.round((appCount / i.viewsCount) * 100)
          : 0,
      };
    })
  );

  return {
    totalInternships,
    totalApplications,
    acceptanceRate,
    avgReviewDays,
    funnel,
    topSkills,
    perInternship,
  };
}
