import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany();
    if (students.length === 0) {
      return NextResponse.json({ error: 'No students found to map universityId' });
    }
    
    const uniId = students[0].universityId;

    await prisma.announcement.createMany({
      data: [
        {
          title: 'تأجيل امتحانات منتصف الفصل',
          body: 'نظراً للظروف الجوية، تقرر تأجيل جميع امتحانات منتصف الفصل المقررة يوم الأحد القادم إلى إشعار آخر. يرجى متابعة البوابة الإلكترونية لمعرفة المواعيد الجديدة.',
          category: 'عام',
          isPinned: true,
          universityId: uniId,
        },
        {
          title: 'إعلان تجريبي (ميزة الإعجابات)',
          body: 'هذا إعلان تجريبي لاختبار ميزة الإعجابات الجديدة في نظام مسار.',
          category: 'عام',
          isPinned: true,
          universityId: uniId,
        },
      ],
      skipDuplicates: true
    });

    const all = await prisma.announcement.findMany();
    return NextResponse.json({ success: true, count: all.length, uniId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
