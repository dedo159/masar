import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generatePasskeyRegistrationOptions } from '@/lib/webauthn';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.userId },
      include: { passkeys: { select: { credentialId: true } } },
    });

    if (!student) {
      return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 });
    }

    const existingIds = student.passkeys.map((p) => p.credentialId);

    const options = await generatePasskeyRegistrationOptions(
      student.studentId,
      student.name,
      existingIds
    );

    // Store challenge in a short-lived cookie for verification
    const res = NextResponse.json({ success: true, options });
    res.cookies.set('webauthn_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 300, // 5 minutes
    });

    return res;
  } catch (error) {
    console.error('Passkey register-options error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
