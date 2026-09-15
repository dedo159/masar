const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.student.update({
        where: { id: 's-001' },
        data: {
            email: '202510377@ammanu.edu.jo',
            year: 2,
            gpa: 2.15,
            totalCredits: 132,
            completedCredits: 45
        }
    });
    console.log('Fixed Deyaa account data in DB');
}
main().finally(() => prisma.$disconnect());