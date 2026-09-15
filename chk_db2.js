const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.student.findMany({ select: { skills: true } }).then(s => console.log(s)).finally(() => prisma.$disconnect());