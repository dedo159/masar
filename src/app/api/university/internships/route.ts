import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'staff') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const internships = await prisma.internship.findMany({
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(internships);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
