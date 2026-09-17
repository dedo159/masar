import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactEmail, password, isCashierPin, pin } = body;

    // 1. Cashier POS Quick Login via PIN
    if (isCashierPin) {
      if (!pin || pin.length < 4) {
        return NextResponse.json(
          { error: "رمز PIN غير صحيح، يجب أن يتكون من 4 أرقام" },
          { status: 400 }
        );
      }

      // Find partner or fallback to demo merchant
      const merchant =
        (await prisma.merchant.findFirst({
          where: { contactEmail: "shawarma@aldiaa.jo" },
        })) ||
        (await prisma.merchant.findFirst());

      if (!merchant) {
        return NextResponse.json(
          { error: "لم يتم العثور على المتجر المسجل للفرع" },
          { status: 404 }
        );
      }

      await createSession({
        userId: merchant.id,
        userType: "merchant",
        merchantId: merchant.id,
        businessName: merchant.businessName,
        email: merchant.contactEmail,
        role: "cashier",
      });

      return NextResponse.json({ success: true, role: "cashier" });
    }

    // 2. Full Merchant Administrator Login
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
      role: "admin",
    });

    return NextResponse.json({ success: true, role: "admin" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
