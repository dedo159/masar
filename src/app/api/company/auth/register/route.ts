import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const { companyName, recruiterName, email, password, website, industry } = await request.json();
  
  // Validate required fields
  if (!companyName || !recruiterName || !email || !password) {
    return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب تعبئتها' }, { status: 400 });
  }

  // Check if email already exists
  const existing = await prisma.companyRecruiter.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // Create company + recruiter in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        website: website || null,
        industry: industry || null,
      },
    });

    const recruiter = await tx.companyRecruiter.create({
      data: {
        companyId: company.id,
        name: recruiterName,
        email,
        passwordHash,
        role: 'admin',
      },
    });

    return { company, recruiter };
  });

  await createSession({
    userId: result.recruiter.id,
    userType: 'recruiter',
    companyId: result.company.id,
    name: result.recruiter.name,
    email: result.recruiter.email,
  });

  return NextResponse.json({ success: true, company: result.company.name }, { status: 201 });
}
