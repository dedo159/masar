import { prisma } from '@/lib/prisma';

/**
 * حساب مؤشرات الشركاء التجاريين التحليلية
 * كل معادلة محسوبة من بيانات حقيقية — لا أرقام وهمية
 */

/** مؤشرات شريك تجاري واحد */
export async function computeMerchantMetrics(merchantId: string) {
  // العروض النشطة
  const now = new Date();
  const activeDeals = await prisma.merchantDeal.count({
    where: {
      merchantId,
      isActive: true,
      validUntil: { gte: now },
    },
  });

  const totalDeals = await prisma.merchantDeal.count({
    where: { merchantId },
  });

  const expiredDeals = await prisma.merchantDeal.count({
    where: {
      merchantId,
      OR: [
        { isActive: false },
        { validUntil: { lt: now } },
      ],
    },
  });

  // إجمالي الاستخدامات
  const totalRedemptions = await prisma.merchantDeal.aggregate({
    where: { merchantId },
    _sum: { redemptionCount: true },
  });

  const redemptionTotal = totalRedemptions._sum.redemptionCount || 0;

  // أفضل العروض أداءً
  const topDeals = await prisma.merchantDeal.findMany({
    where: { merchantId },
    orderBy: { redemptionCount: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      discountLabel: true,
      redemptionCount: true,
      isActive: true,
      validUntil: true,
    },
  });

  // التوزيع الزمني — ساعات الذروة
  const redemptions = await prisma.dealRedemption.findMany({
    where: { deal: { merchantId } },
    select: { redeemedAt: true },
  });

  const hourlyDistribution: Record<number, number> = {};
  for (let h = 0; h < 24; h++) hourlyDistribution[h] = 0;
  for (const r of redemptions) {
    const hour = r.redeemedAt.getHours();
    hourlyDistribution[hour]++;
  }

  // ذروة الاستخدام
  let peakHour = 0;
  let peakCount = 0;
  for (const [hour, count] of Object.entries(hourlyDistribution)) {
    if (count > peakCount) {
      peakHour = parseInt(hour);
      peakCount = count;
    }
  }

  // نسبة العملاء العائدين
  const uniqueStudents = await prisma.dealRedemption.findMany({
    where: { deal: { merchantId } },
    select: { studentId: true },
  });

  const studentRedemptionCounts: Record<string, number> = {};
  for (const r of uniqueStudents) {
    studentRedemptionCounts[r.studentId] = (studentRedemptionCounts[r.studentId] || 0) + 1;
  }

  const totalUniqueStudents = Object.keys(studentRedemptionCounts).length;
  const returningStudents = Object.values(studentRedemptionCounts).filter(c => c > 1).length;
  const returningRate = totalUniqueStudents > 0
    ? Math.round((returningStudents / totalUniqueStudents) * 100)
    : 0;

  // أداء آخر 30 يوم
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentRedemptions = await prisma.dealRedemption.findMany({
    where: {
      deal: { merchantId },
      redeemedAt: { gte: thirtyDaysAgo },
    },
    select: { redeemedAt: true },
  });

  const dailyRedemptions: Record<string, number> = {};
  for (const r of recentRedemptions) {
    const day = r.redeemedAt.toISOString().split('T')[0];
    dailyRedemptions[day] = (dailyRedemptions[day] || 0) + 1;
  }

  return {
    activeDeals,
    totalDeals,
    expiredDeals,
    totalRedemptions: redemptionTotal,
    topDeals,
    hourlyDistribution,
    peakHour,
    peakCount,
    totalUniqueStudents,
    returningStudents,
    returningRate,
    dailyRedemptions,
  };
}
