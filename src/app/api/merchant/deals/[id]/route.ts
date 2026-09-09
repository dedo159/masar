import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const deal = await prisma.merchantDeal.findFirst({
      where: {
        id,
        merchantId: session.merchantId,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "العرض غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingDeal = await prisma.merchantDeal.findFirst({
      where: { id, merchantId: session.merchantId },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: "العرض غير موجود" }, { status: 404 });
    }

    const updatedDeal = await prisma.merchantDeal.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existingDeal.title,
        discountLabel: body.discountLabel !== undefined ? body.discountLabel : existingDeal.discountLabel,
        description: body.description !== undefined ? body.description : existingDeal.description,
        termsConditions: body.termsConditions !== undefined ? body.termsConditions : existingDeal.termsConditions,
        validUntil: body.validUntil ? new Date(body.validUntil) : existingDeal.validUntil,
        isActive: body.isActive !== undefined ? body.isActive : existingDeal.isActive,
      },
    });

    return NextResponse.json({ success: true, deal: updatedDeal });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "merchant" || !session.merchantId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const existingDeal = await prisma.merchantDeal.findFirst({
      where: { id, merchantId: session.merchantId },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: "العرض غير موجود" }, { status: 404 });
    }

    await prisma.merchantDeal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
