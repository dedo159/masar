import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
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

  const data = await request.json();

  const tagsString = data.tags !== undefined
    ? (Array.isArray(data.tags)
        ? JSON.stringify(data.tags)
        : typeof data.tags === 'string'
        ? JSON.stringify(data.tags.split(',').map((t: string) => t.trim()).filter(Boolean))
        : '[]')
    : undefined;

  const updated = await prisma.internship.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.location && { location: data.location }),
      ...(data.type && { type: data.type }),
      ...(data.duration && { duration: data.duration }),
      ...(data.deadline !== undefined && { deadline: data.deadline || null }),
      ...(data.applyUrl && { applyUrl: data.applyUrl }),
      ...(tagsString !== undefined && { tags: tagsString }),
    }
  });

  return NextResponse.json(updated);
}

export async function DELETE(
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

  await prisma.internship.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}
