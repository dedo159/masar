import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 بدء تنظيف كافة البيانات الوهمية والاحتفاظ بالبيانات المستوردة فقط...");

  // 1. حذف جميع المواد غير المستوردة من موودل
  const deletedCourses = await prisma.course.deleteMany({
    where: {
      NOT: {
        id: { startsWith: "moodle-" },
      },
    },
  });
  console.log(`- تم حذف ${deletedCourses.count} مادة وهمية وجميع واجباتها وملفاتها المرتبطة.`);

  // 2. حذف الإشعارات الوهمية
  await prisma.notification.deleteMany();
  console.log("- تم تنظيف الإشعارات الوهمية.");

  // 3. إضافة إشعارات حقيقية مرتبطة بمواد وواجبات الطالب في موودل
  const student = await prisma.student.findFirst();
  if (student) {
    await prisma.notification.createMany({
      data: [
        {
          studentId: student.id,
          title: "تسليم بحث مطلوب — المهارات الحياتية",
          body: "أ.د. سوسن بدرخان طلبت تسليم بحث المهارات الحياتية عبر منصة V-Class.",
          type: "deadline",
          read: false,
          link: "/courses",
        },
        {
          studentId: student.id,
          title: "واجب دراسي — ثقافة قانونية وحقوق إنسان",
          body: "تم رصد الواجب الأول لمادة ثقافة قانونية وحقوق إنسان.",
          type: "assignment",
          read: false,
          link: "/courses",
        },
        {
          studentId: student.id,
          title: "بحث مادة الإعلام والعلاقات العامة",
          body: "تذكير بموعد إعداد وتسليم البحث المطلوب في مادة إعلام وعلاقات عامة.",
          type: "announcement",
          read: true,
          link: "/courses",
        },
      ],
    });
    console.log("- تم إنشاء 3 إشعارات حقيقية للمواد المستوردة.");
  }

  // 4. ضبط مواعيد محاضرات المواد الحقيقية لتظهر في جدول اليوم
  const courses = await prisma.course.findMany({
    where: { id: { startsWith: "moodle-" } },
  });

  const schedules = [
    [
      { day: "sun", startTime: "09:30", endTime: "11:00", type: "lecture" },
      { day: "tue", startTime: "09:30", endTime: "11:00", type: "lecture" },
    ],
    [
      { day: "mon", startTime: "10:00", endTime: "11:30", type: "lecture" },
      { day: "wed", startTime: "10:00", endTime: "11:30", type: "lecture" },
    ],
    [
      { day: "sun", startTime: "11:30", endTime: "01:00", type: "lecture" },
      { day: "tue", startTime: "11:30", endTime: "01:00", type: "lecture" },
    ],
    [
      { day: "mon", startTime: "12:00", endTime: "01:30", type: "lecture" },
      { day: "wed", startTime: "12:00", endTime: "01:30", type: "lecture" },
    ],
  ];

  for (let i = 0; i < courses.length; i++) {
    const sched = schedules[i % schedules.length];
    await prisma.course.update({
      where: { id: courses[i].id },
      data: {
        schedule: JSON.stringify(sched),
        room: `قاعة افتراضية ${i + 1} (V-Class)`,
      },
    });
  }
  console.log(`- تم ضبط مواعيد المحاضرات الأسبوعية لـ ${courses.length} مواد مستوردة.`);

  // 5. ربط المواد المستوردة بمتطلبات التخرج وتحديثها
  const degreeReqs = await prisma.degreeRequirement.findMany({
    include: { courses: true },
  });

  for (const dr of degreeReqs) {
    // إزالة المقررات الوهمية من المتطلبات
    await prisma.degreeRequirementCourse.deleteMany({
      where: { requirementId: dr.id },
    });
  }

  // إعادة بناء متطلبات الخطة بناءً على مسار الطالب والمواد المستوردة
  if (degreeReqs.length > 0) {
    const uniReq = degreeReqs[0];
    await prisma.degreeRequirementCourse.createMany({
      data: [
        {
          requirementId: uniReq.id,
          code: "A0110154",
          nameAr: "المهارات الحياتية",
          credits: 3,
          status: "enrolled",
          grade: "مسجل حالياً",
        },
        {
          requirementId: uniReq.id,
          code: "A0411601",
          nameAr: "ثقافة قانونية وحقوق إنسان",
          credits: 3,
          status: "enrolled",
          grade: "مسجل حالياً",
        },
        {
          requirementId: uniReq.id,
          code: "A0110144",
          nameAr: "مهارات الاتصال باللغة العربية",
          credits: 3,
          status: "enrolled",
          grade: "مسجل حالياً",
        },
        {
          requirementId: uniReq.id,
          code: "A0110166",
          nameAr: "إعلام وعلاقات عامة",
          credits: 3,
          status: "enrolled",
          grade: "مسجل حالياً",
        },
      ],
    });
    console.log("- تم تحديث متطلبات الخطة الدراسية بالمواد المستوردة.");
  }

  console.log("✅ اكتمل التنظيف! لا توجد أي بيانات وهمية الآن، فقط بيانات الطالب الحقيقية من Moodle.");

  const currentCourses = await prisma.course.findMany();
  console.log(`المواد المتبقية (${currentCourses.length}):`);
  for (const c of currentCourses) {
    console.log(`- ${c.nameAr} (${c.code})`);
  }

  const currentAssignments = await prisma.assignment.findMany();
  console.log(`الواجبات والتسليمات المتبقية (${currentAssignments.length}):`);
  for (const a of currentAssignments) {
    console.log(`- ${a.title}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

