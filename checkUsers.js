const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const students = await prisma.student.findMany();
  console.log(students.map(s => ({ id: s.id, name: s.name, uni: s.universityId })));
  const unis = await prisma.university.findMany();
  console.log(unis.map(u => ({ id: u.id, name: u.name })));
}
checkUsers().finally(() => prisma.$disconnect());
