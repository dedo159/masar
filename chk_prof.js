const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.student.findFirst().then(student => {
    let skills = [];
    try {
      skills = JSON.parse(student.skills);
    } catch {
      skills = [];
    }
    console.log(skills);
}).finally(() => prisma.$disconnect());