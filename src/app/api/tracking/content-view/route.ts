import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/tracking/content-view
 * تسجيل صامت لمشاهدة محتوى (ملف أو صفحة مادة)
 * Body: { studentId: string, courseId: string, fileId?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, courseId, fileId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'studentId و courseId مطلوبان' },
        { status: 400 }
      );
    }

    await prisma.contentView.create({
      data: {
        studentId,
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
