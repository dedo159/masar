const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const uni = await prisma.university.findFirst();
  if (!uni) return;

  await prisma.announcement.create({
    data: {
      universityId: uni.id,
      title: 'إعلان تجريبي (ميزة الإعجابات)',
      body: 'هذا إعلان تجريبي تمت إضافته لاختبار خاصية زر الإعجاب (القلب) وعداد الإعجابات الجديد. جرب الضغط عليه!',
      category: 'عام',
      isPinned: true
    }
  });
  console.log("Ad created.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
