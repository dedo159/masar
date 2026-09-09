import { prisma } from "@/lib/prisma";
import { moodleDataMapper } from "@/lib/moodle-mapper";

export async function syncMoodleDataForStudent(
  token: string,
  moodleBaseUrl: string,
  studentId: string = "s-001"
) {
  const cleanUrl = moodleBaseUrl.trim().replace(/\/+$/, "");

  // 1. استدعاء معلومات الموقع والحساب (Site Info)
  const siteInfoUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
    token
  )}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`;

  const siteInfoRes = await fetch(siteInfoUrl);
  if (!siteInfoRes.ok) {
    throw new Error(`Moodle API returned HTTP ${siteInfoRes.status}`);
  }

  const siteInfo = await siteInfoRes.json();
  if (siteInfo.error || !siteInfo.userid) {
    throw new Error(siteInfo.error || "Failed to fetch user site info from Moodle");
  }

  // 2. تحديث / إنشاء سجل الجامعة
  let university = await prisma.university.findFirst({
    where: { code: "aau" },
  });

  if (!university) {
    university = await prisma.university.create({
      data: {
        code: "aau",
        name: "جامعة عمان الأهلية",
        nameEn: "Al Ahliyya Amman University",
      },
    });
  }

  // 3. استدعاء المواد المسجلة من Moodle
  const moodleUserId = Number(siteInfo.userid);
  const coursesUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
    token
  )}&wsfunction=core_enrol_get_users_courses&userid=${moodleUserId}&moodlewsrestformat=json`;

  const coursesRes = await fetch(coursesUrl);
  const enrolledCourses = await coursesRes.json();

  // تطبيق الطبقة الدفاعية لتنظيف وتطبيع بيانات المواد وحساب الساعات بدقة
  const { courses: normalizedCourses, completedCredits } =
    moodleDataMapper.normalizeCourses(enrolledCourses);

  // تطبيق الطبقة الدفاعية لتطبيع بيانات الطالب
  const normalizedStudent = moodleDataMapper.normalizeStudentProfile(siteInfo, {
    completedCredits,
  });

  // 4. تحديث بيانات الطالب في قاعدة البيانات
  const student = await prisma.student.upsert({
    where: { id: studentId },
    create: {
      id: studentId,
      studentId: normalizedStudent.academicId,
      name: normalizedStudent.fullName,
      email: `${normalizedStudent.academicId}@ammanu.edu.jo`,
      major: normalizedStudent.major,
      year: normalizedStudent.academicYear,
      gpa: normalizedStudent.gpa,
      totalCredits: normalizedStudent.totalCreditsRequired,
      completedCredits: normalizedStudent.completedCredits,
      avatar: normalizedStudent.avatarUrl,
      universityId: university.id,
      skills: JSON.stringify([
        "Moodle",
        "العلاقات العامة",
        "المهارات الحياتية",
        "البحث العلمي",
      ]),
    },
    update: {
      studentId: normalizedStudent.academicId,
      name: normalizedStudent.fullName,
      major: normalizedStudent.major,
      avatar: normalizedStudent.avatarUrl,
      completedCredits: normalizedStudent.completedCredits,
      universityId: university.id,
    },
  });

  const colors = ["#8B5CF6", "#F59E0B", "#10B981", "#06B6D4", "#6366F1"];
  const courseMoodleIds: number[] = [];

  for (let i = 0; i < normalizedCourses.length; i++) {
    const nc = normalizedCourses[i];
    courseMoodleIds.push(nc.moodleCourseId);

    const courseId = `moodle-${nc.moodleCourseId}`;
    const color = colors[i % colors.length];

    const course = await prisma.course.upsert({
      where: { code: nc.courseCode },
      create: {
        id: courseId,
        code: nc.courseCode,
        nameAr: nc.courseName,
        nameEn: nc.courseCode,
        credits: nc.credits,
        instructor: nc.instructorName,
        room: "قاعة إلكترونية (V-Class)",
        color,
        semester: nc.semester || "الفصل الصيفي 2025/2026",
        schedule: JSON.stringify([
          {
            day: i % 2 === 0 ? "sun" : "mon",
            startTime: "10:00",
            endTime: "11:30",
            type: "lecture",
          },
          {
            day: i % 2 === 0 ? "tue" : "wed",
            startTime: "10:00",
            endTime: "11:30",
            type: "lecture",
          },
        ]),
      },
      update: {
        nameAr: nc.courseName,
        credits: nc.credits,
        instructor: nc.instructorName,
        semester: nc.semester || "الفصل الصيفي 2025/2026",
      },
    });

    await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id,
        },
      },
      create: {
        studentId: student.id,
        courseId: course.id,
        status: nc.status,
        semester: nc.semester || "الفصل الصيفي 2025/2026",
      },
      update: {
        status: nc.status,
      },
    });
  }

  // 5. استدعاء الواجبات والتسليمات وتطبيعها بدقة
  if (courseMoodleIds.length > 0) {
    try {
      const assignParams = courseMoodleIds
        .map((id, idx) => `courseids[${idx}]=${id}`)
        .join("&");
      const assignUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
        token
      )}&wsfunction=mod_assign_get_assignments&${assignParams}&moodlewsrestformat=json`;

      const assignRes = await fetch(assignUrl);
      const assignData = await assignRes.json();

      if (assignData && Array.isArray(assignData.courses)) {
        for (const c of assignData.courses) {
          const course =
            (await prisma.course.findFirst({
              where: { id: `moodle-${c.id}` },
            })) ||
            (await prisma.course.findFirst({
              where: { code: { contains: String(c.id) } },
            }));

          if (!course || !Array.isArray(c.assignments)) continue;

          for (const rawAssign of c.assignments) {
            const na = moodleDataMapper.normalizeAssignment(rawAssign);

            const dueDate = na.dueDateIso ? na.dueDateIso.split("T")[0] : new Date().toISOString().split("T")[0];
            const dueTime = na.dueTimeFormatted || "23:59";

            await prisma.assignment.upsert({
              where: { id: `moodle-assign-${na.moodleAssignmentId}` },
              create: {
                id: `moodle-assign-${na.moodleAssignmentId}`,
                courseId: course.id,
                title: na.title,
                description: na.description || na.title,
                dueDate,
                dueTime,
                maxGrade: na.maxGrade,
                type: na.type,
              },
              update: {
                title: na.title,
                description: na.description || na.title,
                dueDate,
                dueTime,
                maxGrade: na.maxGrade,
                type: na.type,
              },
            });
          }
        }
      }
    } catch (assignErr) {
      console.warn("Could not sync assignments:", assignErr);
    }
  }

  return {
    studentName: student.name,
    studentId: student.studentId,
    coursesCount: Array.isArray(enrolledCourses) ? enrolledCourses.length : 0,
  };
}
