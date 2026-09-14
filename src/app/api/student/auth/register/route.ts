import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, studentId, email, password, universityCode, major } = body;
    
    // Validate required fields
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedStudentId = typeof studentId === 'string' ? studentId.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPassword = typeof password === 'string' ? password : '';
    const trimmedMajor = typeof major === 'string' ? major.trim() : 'علم الحاسوب';
    const trimmedUniv = typeof universityCode === 'string' ? universityCode.trim() : 'ju';

    if (!trimmedName || !trimmedStudentId || !trimmedPassword) {
      return NextResponse.json({ error: 'الاسم، الرقم الجامعي، وكلمة المرور مطلوبة' }, { status: 400 });
    }

    if (trimmedPassword.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 خانات على الأقل' }, { status: 400 });
    }

    // Check if studentId already exists
    const existingStudentId = await prisma.student.findUnique({
      where: { studentId: trimmedStudentId },
    });
    if (existingStudentId) {
      return NextResponse.json({ error: 'الرقم الجامعي مسجل مسبقاً في النظام' }, { status: 409 });
    }

    // Generate fallback email if not provided
    const finalEmail = trimmedEmail || `${trimmedStudentId}@students.masar.edu.jo`;

    // Check if email already exists
    const existingEmail = await prisma.student.findUnique({
      where: { email: finalEmail },
    });
    if (existingEmail) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 409 });
    }

    // Find or fallback university
    let university = await prisma.university.findFirst({
      where: {
        OR: [
          { code: trimmedUniv },
          { id: trimmedUniv },
        ],
      },
    });

    if (!university) {
      university = await prisma.university.findFirst();
    }

    if (!university) {
      return NextResponse.json({ error: 'تعذر تحديد الجامعة التابع لها' }, { status: 400 });
    }

    const passwordHash = await hashPassword(trimmedPassword);

    // Create the student
    const newStudent = await prisma.student.create({
      data: {
        studentId: trimmedStudentId,
        name: trimmedName,
        email: finalEmail,
        major: trimmedMajor,
        year: 1,
        gpa: 0.0,
        totalCredits: 132,
        completedCredits: 0,
        passwordHash,
        universityId: university.id,
        skills: JSON.stringify([]),
      },
    });



    // Issue session
    await createSession({
      userId: newStudent.id,
      userType: 'student',
      universityId: newStudent.universityId,
      name: newStudent.name,
      email: newStudent.email,
    });

    return NextResponse.json({
      success: true,
      student: {
        id: newStudent.id,
        studentId: newStudent.studentId,
        name: newStudent.name,
        email: newStudent.email,
        major: newStudent.major,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Student register error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً' }, { status: 500 });
  }
}
