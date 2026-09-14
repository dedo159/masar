import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { verifyPasskeyRegistration } from '@/lib/webauthn';
import type { RegistrationResponseJSON } from '@/lib/webauthn';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get('webauthn_challenge')?.value;
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'انتهت صلاحية الجلسة. حاول مرة أخرى.' }, { status: 400 });
    }

    const body: RegistrationResponseJSON = await request.json();

    const verification = await verifyPasskeyRegistration(body, expectedChallenge);

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'فشل التحقق من البصمة' }, { status: 400 });
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save passkey to database
    await prisma.passkey.create({
      data: {
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: body.response.transports
          ? JSON.stringify(body.response.transports)
          : null,
        studentId: session.userId,
      },
    });

    // Clear challenge cookie
    const res = NextResponse.json({ success: true });
    res.cookies.delete('webauthn_challenge');

    return res;
  } catch (error) {
    console.error('Passkey register-verify error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل البصمة' }, { status: 500 });
  }
}
