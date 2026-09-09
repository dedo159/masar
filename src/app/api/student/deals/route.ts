import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.merchantDeal.findMany({
      where: {
        isActive: true,
        validUntil: {
          gte: new Date(),
        },
      },
      include: {
        merchant: {
          select: {
            businessName: true,
            logoUrl: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب العروض" },
      { status: 500 }
    );
  }
}
