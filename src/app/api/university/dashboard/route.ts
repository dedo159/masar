import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'staff') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const activeStudents = await prisma.student.count();
    const moodleConnected = await prisma.moodleConnection.count();
    const atRiskCount = await prisma.studentEngagementSnapshot.count({ where: { riskFlag: true } });
    const avgGpaResult = await prisma.student.aggregate({ _avg: { gpa: true } });
    
    const moodleAdoption = activeStudents > 0 ? Math.round((moodleConnected / activeStudents) * 100) : 0;
    const avgGpa = avgGpaResult._avg.gpa ? parseFloat(avgGpaResult._avg.gpa.toFixed(2)) : 0;

    return NextResponse.json({ 
      activeStudents, 
      atRiskCount, 
      moodleAdoption, 
      avgGpa 
    });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
