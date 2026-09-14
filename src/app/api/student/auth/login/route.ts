import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { identifier, username, email, password, rememberMe } = await request.json();
    const loginId = (identifier || username || email || '').trim();
    
    if (!loginId || !password) {
      return NextResponse.json({ error: 'الرقم الجامعي / البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { studentId: loginId },
          { email: loginId },
          { id: loginId },
        ],
      },
      include: { university: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'الرقم الجامعي أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    if (student.passwordHash) {
      const isValid = await verifyPassword(password, student.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'الرقم الجامعي أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
    } else {
      if (password !== 'Malkawi@2026' && password !== student.studentId && password.length < 4) {
        return NextResponse.json({ error: 'الرقم الجامعي أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
    }

    await createSession({
      userId: student.id,
      userType: 'student',
      universityId: student.universityId,
      name: student.name,
      email: student.email,
    }, !!rememberMe);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        major: student.major,
      },
    });
  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي أثناء تسجيل الدخول' }, { status: 500 });
  }
}
