import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

/**
 * POST /api/tracking/content-view
 * تسجيل صامت لمشاهدة محتوى (ملف أو صفحة مادة)
 * Body: { studentId?: string, courseId: string, fileId?: string }
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student' || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { courseId, fileId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId مطلوب' },
        { status: 400 }
      );
    }

    const resolvedStudentId = session.userId;

    await prisma.contentView.create({
      data: {
        studentId: resolvedStudentId,
        courseId,
        fileId: fileId || null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[ContentView Tracking] Error:', error);
    // Fail silently — tracking should not break the app
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
