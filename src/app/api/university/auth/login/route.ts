import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const staff = await prisma.universityStaff.findUnique({ where: { email } });
    if (!staff) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, staff.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    await createSession({
      userId: staff.id,
      userType: 'staff',
      universityId: staff.universityId,
      name: staff.name,
      email: staff.email,
    });

    return NextResponse.json({ success: true, name: staff.name });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
