import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const deals = await prisma.merchantDeal.findMany({
      where: { merchantId: session.merchantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Fetch deals error:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { title, discountLabel, description, termsConditions, validFrom, validUntil } = body;

    if (!title || !discountLabel || !validUntil) {
      return NextResponse.json({ error: "بيانات العرض ناقصة" }, { status: 400 });
    }

    const now = new Date();
    const startDate = validFrom ? new Date(validFrom) : now;
    const endDate = new Date(validUntil);
    const isActive = now >= startDate && now <= endDate;

    const deal = await prisma.merchantDeal.create({
      data: {
        merchantId: session.merchantId,
        title,
        discountLabel,
        description,
        termsConditions,
        validFrom: startDate,
        validUntil: endDate,
        isActive,
      },
    });

    return NextResponse.json({ success: true, deal }, { status: 201 });
  } catch (error) {
    console.error("Create deal error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
