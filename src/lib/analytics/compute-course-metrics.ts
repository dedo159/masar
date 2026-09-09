import { prisma } from '@/lib/prisma';

/**
 * حساب مؤشرات المادة الدراسية التحليلية
 * كل معادلة محسوبة من بيانات حقيقية — لا أرقام وهمية
 */

/** مؤشرات مادة واحدة */
export async function computeSingleCourseMetrics(courseId: string) {
  // عدد الطلاب المسجلين
  const totalEnrollments = await prisma.enrollment.count({
    where: { courseId },
  });

  // عدد الناجحين (totalGrade >= 50)
  const passedCount = await prisma.enrollment.count({
    where: {
      courseId,
      totalGrade: { gte: 50 },
    },
  });

  // متوسط الدرجات
  const avgResult = await prisma.enrollment.aggregate({
    where: { courseId, totalGrade: { not: null } },
    _avg: { totalGrade: true },
  });

  // التسليمات المتأخرة
  const totalSubmissions = await prisma.submission.count({
    where: { assignment: { courseId } },
  });

  const lateSubmissions = await prisma.submission.count({
    where: {
      assignment: { courseId },
      status: 'late',
    },
  });

  const passRate = totalEnrollments > 0
    ? Math.round((passedCount / totalEnrollments) * 100)
    : 0;

  const avgGrade = avgResult._avg.totalGrade
    ? Math.round(avgResult._avg.totalGrade * 10) / 10
    : 0;

  const lateRate = totalSubmissions > 0
    ? Math.round((lateSubmissions / totalSubmissions) * 100)
    : 0;

  const failRate = totalEnrollments > 0
    ? Math.round(((totalEnrollments - passedCount) / totalEnrollments) * 100)
    : 0;

  // مؤشر العنق الزجاجي: نسبة رسوب > 30% وتأخر > 40%
  const isBottleneck = failRate > 30 && lateRate > 40;

  return {
    courseId,
    totalEnrollments,
    passRate,
    failRate,
    avgGrade,
    lateRate,
    isBottleneck,
  };
}

/** جميع المواد — مرتبة حسب أسوأ أداء (عنق زجاجي أولاً) */
export async function computeAllCourseMetrics() {
  const courses = await prisma.course.findMany({
    select: { id: true, code: true, nameAr: true },
  });

  const metrics = await Promise.all(
    courses.map(async (c) => {
      const m = await computeSingleCourseMetrics(c.id);
      return {
        ...m,
        code: c.code,
        nameAr: c.nameAr,
      };
    })
  );

  // ترتيب: العنق الزجاجي أولاً، ثم حسب نسبة الرسوب تنازلياً
  return metrics.sort((a, b) => {
    if (a.isBottleneck && !b.isBottleneck) return -1;
    if (!a.isBottleneck && b.isBottleneck) return 1;
    return b.failRate - a.failRate;
  });
}
