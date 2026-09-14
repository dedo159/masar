import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.userType !== 'student' || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if like exists
    const existingLike = await prisma.announcementLike.findUnique({
      where: {
        studentId_announcementId: {
          studentId: session.userId,
          announcementId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.announcementLike.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.announcementLike.create({
        data: {
          studentId: session.userId,
          announcementId: id
        }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 });
  }
}
