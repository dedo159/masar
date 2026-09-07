import { PrismaClient } from "@prisma/client";
import {
  universities,
  mockStudent,
  mockCourses,
  mockDegreeRequirements,
  mockInternships,
  mockNotifications,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء ملء قاعدة البيانات (Seeding)...");

  // 1. مسح البيانات القديمة
  await prisma.notification.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.courseFile.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.degreeRequirementCourse.deleteMany();
  await prisma.degreeRequirement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.university.deleteMany();
  await prisma.internship.deleteMany();

  // 2. الجامعات (Universities)
  console.log("-> إضافة الجامعات...");
  const universityMap = new Map<string, string>();
  for (const u of universities) {
    const created = await prisma.university.create({
      data: {
        code: u.id,
        name: u.name,
        nameEn: u.nameEn,
      },
    });
    universityMap.set(u.id, created.id);
  }

  // 3. الطالب (Student)
  console.log("-> إضافة بيانات الطالب...");
  const studentUnivId = universityMap.get(mockStudent.universityId) || universityMap.get("ju")!;
  const student = await prisma.student.create({
    data: {
      id: mockStudent.id,
      studentId: mockStudent.studentId,
      name: mockStudent.name,
      email: mockStudent.email,
      major: mockStudent.major,
      year: mockStudent.year,
      gpa: mockStudent.gpa,
      totalCredits: mockStudent.totalCredits,
      completedCredits: mockStudent.completedCredits,
      github: mockStudent.github,
      portfolio: mockStudent.portfolio,
      avatar: mockStudent.avatar,
      skills: JSON.stringify(mockStudent.skills),
      universityId: studentUnivId,
    },
  });

  // 4. المواد الدراسية والواجبات والملفات (Courses, Assignments, Files)
  console.log("-> إضافة المواد والواجبات...");
  for (const c of mockCourses) {
    const course = await prisma.course.create({
      data: {
        id: c.id,
        code: c.code,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        credits: c.credits,
        instructor: c.instructor,
        room: c.room,
        color: c.color,
        semester: c.semester,
        schedule: JSON.stringify(c.schedule),
      },
    });

    // التسجيل والدرجات (Enrollment & Grades)
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        status: c.status,
        semester: c.semester,
        midtermGrade: c.grade?.midterm ?? null,
        finalGrade: c.grade?.final ?? null,
        assignmentsGrade: c.grade?.assignments ?? null,
        participationGrade: c.grade?.participation ?? null,
        totalGrade: c.grade?.total ?? null,
        letterGrade: c.grade?.letter ?? null,
      },
    });

    // الواجبات (Assignments)
    for (const a of c.assignments) {
      const assignment = await prisma.assignment.create({
        data: {
          id: a.id,
          courseId: course.id,
          title: a.title,
          description: a.description ?? null,
          dueDate: a.dueDate,
          dueTime: a.dueTime,
          maxGrade: a.maxGrade,
          type: a.type,
        },
      });

      // التسليم (Submission)
      await prisma.submission.create({
        data: {
          assignmentId: assignment.id,
          studentId: student.id,
          status: a.status,
          grade: a.grade ?? null,
        },
      });
    }

    // الملفات (Course Files)
    for (const f of c.files) {
      await prisma.courseFile.create({
        data: {
          id: f.id,
          courseId: course.id,
          name: f.name,
          type: f.type,
          url: f.url,
          week: f.week ?? null,
          uploadedAt: f.uploadedAt,
        },
      });
    }
  }

  // 5. متطلبات التخرج (Degree Requirements)
  console.log("-> إضافة متطلبات التخرج...");
  let reqOrder = 0;
  for (const dr of mockDegreeRequirements) {
    const requirement = await prisma.degreeRequirement.create({
      data: {
        id: dr.id,
        studentId: student.id,
        category: dr.category,
        categoryLabel: dr.categoryLabel,
        totalCredits: dr.totalCredits,
        completedCredits: dr.completedCredits,
        order: reqOrder++,
      },
    });

    let courseOrder = 0;
    for (const drc of dr.courses) {
      await prisma.degreeRequirementCourse.create({
        data: {
          id: drc.id,
          requirementId: requirement.id,
          code: drc.code,
          nameAr: drc.nameAr,
          credits: drc.credits,
          status: drc.status,
          grade: drc.grade ?? null,
          order: courseOrder++,
        },
      });
    }
  }

  // 6. فرص التدريب (Internships)
  console.log("-> إضافة فرص التدريب...");
  for (const i of mockInternships) {
    await prisma.internship.create({
      data: {
        id: i.id,
        company: i.company,
        title: i.title,
        location: i.location,
        type: i.type,
        duration: i.duration,
        deadline: i.deadline ?? null,
        applyUrl: i.applyUrl,
        tags: JSON.stringify(i.tags),
        isNew: i.isNew ?? false,
      },
    });
  }

  // 7. الإشعارات (Notifications)
  console.log("-> إضافة الإشعارات...");
  for (const n of mockNotifications) {
    await prisma.notification.create({
      data: {
        id: n.id,
        studentId: student.id,
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.read,
        link: n.link ?? null,
        createdAt: new Date(n.createdAt),
      },
    });
  }

  console.log("✅ تم ملء قاعدة البيانات بنجاح تام!");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء الـ Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
