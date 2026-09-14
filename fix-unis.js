const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const student = await prisma.student.findFirst();
  if (!student) return;
  
  await prisma.announcement.updateMany({
    data: {
      universityId: student.universityId
    }
  });
  console.log("Updated announcements to match student university.");
}
fix().finally(() => prisma.$disconnect());
