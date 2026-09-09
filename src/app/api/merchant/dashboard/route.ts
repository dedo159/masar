import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
    }

    const deals = await prisma.merchantDeal.findMany({
      where: { merchantId: session.merchantId },
      orderBy: { createdAt: "desc" },
    });

    const activeDeals = deals.filter((d) => d.isActive).length;
    const inactiveDeals = deals.filter((d) => !d.isActive).length;
    
    // In a real app we would join Redemptions or sum redemptionCount
    // Assuming Deal has a redemptionCount field
    const totalRedemptions = deals.reduce((sum, deal) => sum + (deal.redemptionCount || 0), 0);

    return NextResponse.json({
      stats: {
        activeDeals,
        inactiveDeals,
        totalRedemptions
      },
      deals
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    );
  }
}
