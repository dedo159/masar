import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.userType !== 'recruiter' || !session.companyId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const internships = await prisma.internship.findMany({
    where: { companyId: session.companyId },
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(internships);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.userType !== 'recruiter' || !session.companyId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const company = await prisma.company.findUnique({
    where: { id: session.companyId }
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const tagsString = Array.isArray(data.tags)
    ? JSON.stringify(data.tags)
    : typeof data.tags === 'string'
    ? JSON.stringify(data.tags.split(',').map((t: string) => t.trim()).filter(Boolean))
    : '[]';

  const internship = await prisma.internship.create({
    data: {
      companyId: session.companyId,
      company: company.name,
      title: data.title,
      location: data.location || 'عمان، الأردن',
      type: data.type || 'onsite',
      duration: data.duration || '3 أشهر',
      deadline: data.deadline || null,
      applyUrl: data.applyUrl || '#',
      tags: tagsString,
      isNew: true,
    },
  });

  return NextResponse.json(internship, { status: 201 });
}
