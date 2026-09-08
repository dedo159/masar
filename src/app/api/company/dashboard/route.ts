import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.userType !== 'recruiter' || !session.companyId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const totalInternships = await prisma.internship.count({
    where: { companyId: session.companyId },
  });

  const totalApplicants = await prisma.internshipApplication.count({
    where: { internship: { companyId: session.companyId } },
  });

  const pendingReview = await prisma.internshipApplication.count({
    where: {
      internship: { companyId: session.companyId },
      status: 'pending',
    },
  });

  return NextResponse.json({ totalInternships, totalApplicants, pendingReview });
}
