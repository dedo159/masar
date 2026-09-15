const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.student.findFirst().then(s => console.log(s.skills)).finally(() => prisma.$disconnect());