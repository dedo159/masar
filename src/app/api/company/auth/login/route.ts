import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const recruiter = await prisma.companyRecruiter.findUnique({
      where: { email },
      include: { company: true },
    });
    if (!recruiter) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, recruiter.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    await createSession({
      userId: recruiter.id,
      userType: 'recruiter',
      companyId: recruiter.companyId,
      name: recruiter.name,
      email: recruiter.email,
    });

    return NextResponse.json({ success: true, name: recruiter.name, company: recruiter.company.name });
  } catch (error) {
    console.error("Company login error:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً' }, { status: 500 });
  }
}
