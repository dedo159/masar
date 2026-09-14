import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.userType !== 'student' || !session.universityId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const announcements = await prisma.announcement.findMany({
    where: {
      universityId: session.universityId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: [
      { isPinned: 'desc' },
      { publishedAt: 'desc' }
    ],
    include: {
      _count: {
        select: { likes: true }
      },
      likes: {
        where: {
          studentId: session.userId
        },
        select: {
          id: true
        }
      }
    }
  });

  const formatted = announcements.map(a => ({
    id: a.id,
    title: a.title,
    body: a.body,
    category: a.category,
    isPinned: a.isPinned,
    publishedAt: a.publishedAt,
    likesCount: a._count.likes,
    isLiked: a.likes.length > 0
  }));

  return NextResponse.json(formatted);
}
