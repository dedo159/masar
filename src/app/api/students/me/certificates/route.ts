import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificates = await prisma.studentCertificate.findMany({
      where: { studentId: session.userId },
      orderBy: { issueDate: 'desc' },
      select: {
        id: true,
        name: true,
        issuer: true,
        issueDate: true,
        fileType: true,
        createdAt: true,
        // Omit fileData in the list to save bandwidth, it can be fetched individually if needed
        // Or if we need it for download, maybe we can fetch it, but it's large.
      },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, issuer, fileData, fileType } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const certificate = await prisma.studentCertificate.create({
      data: {
        studentId: session.userId,
        name,
        issuer,
        fileData,
        fileType,
      },
    });

    return NextResponse.json({ success: true, certificate: {
      id: certificate.id,
      name: certificate.name,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate,
      fileType: certificate.fileType,
      createdAt: certificate.createdAt,
    } });
  } catch (error) {
    console.error('Certificates POST error:', error);
    return NextResponse.json({ error: 'Failed to upload certificate' }, { status: 500 });
  }
}
