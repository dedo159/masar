import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'staff') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const atRiskStudents = await prisma.studentEngagementSnapshot.findMany({
      where: { riskFlag: true },
      include: { 
        student: {
          select: {
            id: true,
            name: true,
            studentId: true,
            major: true,
            email: true
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(atRiskStudents);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
