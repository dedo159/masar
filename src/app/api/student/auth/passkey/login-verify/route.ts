import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { verifyPasskeyLogin } from '@/lib/webauthn';
import type { AuthenticationResponseJSON } from '@/lib/webauthn';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get('webauthn_login_challenge')?.value;
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'انتهت صلاحية الجلسة. حاول مرة أخرى.' }, { status: 400 });
    }

    const body: AuthenticationResponseJSON = await request.json();

    // Look up the credential in DB
    const passkey = await prisma.passkey.findUnique({
      where: { credentialId: body.id },
      include: { student: true },
    });

    if (!passkey) {
      return NextResponse.json({ error: 'البصمة غير مسجلة. يرجى تسجيل الدخول بكلمة المرور.' }, { status: 401 });
    }

    const verification = await verifyPasskeyLogin(
      body,
      expectedChallenge,
      new Uint8Array(passkey.publicKey),
      passkey.counter
    );

    if (!verification.verified) {
      return NextResponse.json({ error: 'فشل التحقق من البصمة' }, { status: 401 });
    }

    // Update counter for replay protection
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: { counter: BigInt(verification.authenticationInfo.newCounter) },
    });

    // Create session (biometric logins get rememberMe by default)
    await createSession({
      userId: passkey.student.id,
      userType: 'student',
      universityId: passkey.student.universityId,
      name: passkey.student.name,
      email: passkey.student.email,
    }, true);

    // Clear challenge cookie
    const res = NextResponse.json({
      success: true,
      student: {
        id: passkey.student.id,
        studentId: passkey.student.studentId,
        name: passkey.student.name,
        email: passkey.student.email,
        major: passkey.student.major,
      },
    });
    res.cookies.delete('webauthn_login_challenge');

    return res;
  } catch (error) {
    console.error('Passkey login-verify error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء التحقق من البصمة' }, { status: 500 });
  }
}
