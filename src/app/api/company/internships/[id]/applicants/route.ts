import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.userType !== 'recruiter' || !session.companyId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const internship = await prisma.internship.findUnique({
    where: { id }
  });

  if (!internship || internship.companyId !== session.companyId) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  const applications = await prisma.internshipApplication.findMany({
    where: { internshipId: id },
    include: {
      student: {
        select: {
          name: true,
          studentId: true,
          major: true,
          university: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ internship, applications });
}
