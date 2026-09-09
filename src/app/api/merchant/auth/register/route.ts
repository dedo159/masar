import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, category, contactEmail, password, logoUrl } = body;

    if (!businessName || !category || !contactEmail || !password) {
      return NextResponse.json(
        { error: "جميع الحقول الإلزامية مطلوبة" },
        { status: 400 }
      );
    }

    const existingMerchant = await prisma.merchant.findUnique({
      where: { contactEmail },
    });

    if (existingMerchant) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const merchant = await prisma.merchant.create({
      data: {
        businessName,
        category,
        contactEmail,
        passwordHash: hashedPassword,
        logoUrl,
        verified: false,
      },
    });

    await createSession({
      userId: merchant.id,
      userType: "merchant",
      merchantId: merchant.id,
      businessName: merchant.businessName,
      email: merchant.contactEmail,
    });

    return NextResponse.json({ success: true, merchant }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
