const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const uni = await prisma.university.findFirst();
  if (!uni) {
    console.log('No university found');
    return;
  }

  await prisma.announcement.createMany({
    data: [
      {
        universityId: uni.id,
        title: 'تأجيل امتحانات منتصف الفصل',
        body: 'نظراً للظروف الجوية المتوقعة، تقرر تأجيل كافة امتحانات منتصف الفصل الدراسي التي كانت مقررة يوم الأربعاء إلى يوم السبت القادم وفي نفس المواعيد والقاعات.',
        category: 'أكاديمي',
        isPinned: true,
      },
      {
        universityId: uni.id,
        title: 'معرض التوظيف السنوي 2026',
        body: 'ندعو جميع الطلبة الخريجين والمتوقع تخرجهم لحضور معرض التوظيف السنوي بمشاركة أكثر من 50 شركة رائدة في قطاع التكنولوجيا والأعمال. سيتم عقد ورش عمل مصاحبة لكتابة السيرة الذاتية واجتياز المقابلات.',
        category: 'فعاليات',
        isPinned: true,
      },
      {
        universityId: uni.id,
        title: 'فرصة تدريب في شركة زين',
        body: 'تعلن كلية تكنولوجيا المعلومات عن توفر 5 شواغر تدريبية لطلبة السنة الرابعة في شركة زين للاتصالات. التدريب مدفوع الأجر وفرصة للتوظيف بعد التخرج. آخر موعد للتقديم نهاية الأسبوع.',
        category: 'تدريب',
        isPinned: false,
      },
      {
        universityId: uni.id,
        title: 'صيانة نظام التسجيل',
        body: 'نعلمكم بأنه سيتم إيقاف نظام التسجيل الذاتي لأغراض الصيانة والتحديث يوم الجمعة من الساعة 8 صباحاً وحتى 12 ظهراً.',
        category: 'عام',
        isPinned: false,
      },
      {
        universityId: uni.id,
        title: 'فتح باب التسجيل للفصل الصيفي',
        body: 'يبدأ التسجيل للفصل الدراسي الصيفي الأحد القادم حسب مواعيد التسجيل المحددة لكل دفعة. يرجى مراجعة المرشد الأكاديمي قبل تسجيل المواد.',
        category: 'أكاديمي',
        isPinned: false,
      }
    ]
  });

  console.log('Seeded announcements successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
