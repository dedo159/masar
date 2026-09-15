import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "student" || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const studentId = session.userId;

    const resolvedParams = await params;
    const dealId = resolvedParams.id;

    // Check if deal exists and is active
    const deal = await prisma.merchantDeal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "العرض غير موجود" },
        { status: 404 }
      );
    }

    if (!deal.isActive || new Date(deal.validUntil) < new Date()) {
      return NextResponse.json(
        { success: false, error: "هذا العرض غير فعال أو منتهي الصلاحية" },
        { status: 400 }
      );
    }

    // Use a transaction to create redemption and update count
    await prisma.$transaction([
      prisma.dealRedemption.create({
        data: {
          dealId: dealId,
          studentId,
        },
      }),
      prisma.merchantDeal.update({
        where: { id: dealId },
        data: {
          redemptionCount: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "تم تسجيل استخدام العرض بنجاح",
    });
  } catch (error) {
    console.error("Error redeeming deal:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تفعيل العرض" },
      { status: 500 }
    );
  }
}
