import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePasskeyLoginOptions } from '@/lib/webauthn';

export async function POST(request: Request) {
  try {
    // Optional: client can send studentId to narrow down credentials
    let studentId: string | undefined;
    try {
      const body = await request.json();
      studentId = body.studentId;
    } catch {
      // empty body is fine — will use discoverable credentials
    }

    let allowCredentialIds: string[] | undefined;
    let transportsMap: Record<string, string | null> | undefined;

    if (studentId) {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { studentId },
            { email: studentId },
            { id: studentId },
          ],
        },
        include: { passkeys: { select: { credentialId: true, transports: true } } },
      });

      if (!student || student.passkeys.length === 0) {
        return NextResponse.json({ error: 'لا توجد بصمة مسجلة لهذا الحساب' }, { status: 404 });
      }

      allowCredentialIds = student.passkeys.map((p) => p.credentialId);
      transportsMap = {};
      for (const p of student.passkeys) {
        transportsMap[p.credentialId] = p.transports;
      }
    }

    const host = request.headers.get('host') || 'localhost';
    const rpId = host.split(':')[0];

    const options = await generatePasskeyLoginOptions(rpId, allowCredentialIds, transportsMap);

    const res = NextResponse.json({ success: true, options });
    res.cookies.set('webauthn_login_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 300,
    });

    return res;
  } catch (error) {
    console.error('Passkey login-options error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
