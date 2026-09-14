const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const announcements = await prisma.announcement.findMany();
  console.log("Announcements:", announcements.map(a => ({ id: a.id, uniId: a.universityId })));
  
  const student = await prisma.student.findFirst();
  console.log("First Student:", student.id, student.universityId);
}
check().finally(() => prisma.$disconnect());
