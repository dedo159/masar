import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactEmail, password } = body;

    if (!contactEmail || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { contactEmail },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, merchant.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    await createSession({
      userId: merchant.id,
      userType: "merchant",
      merchantId: merchant.id,
      businessName: merchant.businessName,
      email: merchant.contactEmail,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
