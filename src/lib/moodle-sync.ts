import { prisma } from "@/lib/prisma";
import { moodleDataMapper } from "@/lib/moodle-mapper";

export async function syncMoodleDataForStudent(
  token: string,
  moodleBaseUrl: string,
  studentId: string = "s-001",
  preferredMajor?: string
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

  // إذا تم تحديد تخصص من قبل الطالب، نعتمد عليه
  const finalMajor = (preferredMajor && preferredMajor.trim()) ? preferredMajor.trim() : normalizedStudent.major;

  // 4. تحديث بيانات الطالب في قاعدة البيانات
  const student = await prisma.student.upsert({
    where: { id: studentId },
    create: {
      id: studentId,
      studentId: normalizedStudent.academicId,
      name: normalizedStudent.fullName,
      email: `${normalizedStudent.academicId}@ammanu.edu.jo`,
      major: finalMajor,
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
      major: finalMajor,
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
    const courseCode = nc.courseCode || `MDL-${nc.moodleCourseId}`;
    const color = colors[i % colors.length];

    try {
      const existing =
        (await prisma.course.findUnique({ where: { id: courseId } })) ||
        (await prisma.course.findUnique({ where: { code: courseCode } }));

      const course = existing
        ? await prisma.course.update({
            where: { id: existing.id },
            data: {
              nameAr: nc.courseName,
              credits: nc.credits,
              instructor: nc.instructorName,
              semester: nc.semester || "الفصل الصيفي 2025/2026",
            },
          })
        : await prisma.course.create({
            data: {
              id: courseId,
              code: courseCode,
              nameAr: nc.courseName,
              nameEn: courseCode,
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
    } catch (courseErr) {
      console.warn(`[MoodleSync] Isolated error saving course ${nc.moodleCourseId}:`, courseErr);
    }
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

      const normalizedAssignments = moodleDataMapper.normalizeAssignments(assignData);

      for (const na of normalizedAssignments) {
        try {
          const course =
            (await prisma.course.findFirst({
              where: { id: `moodle-${na.moodleCourseId}` },
            })) ||
            (await prisma.course.findFirst({
              where: { code: { contains: String(na.moodleCourseId) } },
            }));

          if (!course) continue;

          const dueDate = na.dueDateIso
            ? na.dueDateIso.split("T")[0]
            : new Date().toISOString().split("T")[0];
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
        } catch (assignErr) {
          console.warn(`[MoodleSync] Isolated error saving assignment ${na.moodleAssignmentId}:`, assignErr);
        }
      }
    } catch (assignErr) {
      console.warn("Could not sync assignments:", assignErr);
    }

    // 6. استدعاء الاختبارات (Quizzes) من Moodle وتطبيعها
    try {
      const quizParams = courseMoodleIds
        .map((id, idx) => `courseids[${idx}]=${id}`)
        .join("&");
      const quizUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
        token
      )}&wsfunction=mod_quiz_get_quizzes_by_courses&${quizParams}&moodlewsrestformat=json`;

      const quizRes = await fetch(quizUrl);
      const quizData = await quizRes.json();

      // تطبيع الاختبارات — يأتي الرد عادة بشكل { quizzes: [...] }
      const quizzes = Array.isArray(quizData?.quizzes) ? quizData.quizzes : [];

      for (const quiz of quizzes) {
        try {
          const quizCourseId = Number(quiz?.course ?? 0);
          const course =
            (await prisma.course.findFirst({
              where: { id: `moodle-${quizCourseId}` },
            })) ||
            (await prisma.course.findFirst({
              where: { code: { contains: String(quizCourseId) } },
            }));

          if (!course) continue;

          const quizId = Number(quiz?.id ?? 0);
          const quizName = String(quiz?.name ?? `اختبار (${quizId})`);
          
          // تاريخ الاستحقاق (timeclose) أو تاريخ الفتح (timeopen)
          let dueDate = new Date().toISOString().split("T")[0];
          let dueTime = "23:59";
          
          const closeTime = Number(quiz?.timeclose ?? 0);
          if (closeTime > 0) {
            const d = new Date(closeTime * 1000);
            dueDate = d.toISOString().split("T")[0];
            dueTime = d.toISOString().split("T")[1]?.substring(0, 5) || "23:59";
          }

          const maxGrade = Number(quiz?.grade ?? 20);

          await prisma.assignment.upsert({
            where: { id: `moodle-quiz-${quizId}` },
            create: {
              id: `moodle-quiz-${quizId}`,
              courseId: course.id,
              title: quizName,
              description: quizName,
              dueDate,
              dueTime,
              maxGrade,
              type: "quiz",
            },
            update: {
              title: quizName,
              dueDate,
              dueTime,
              maxGrade,
              type: "quiz",
            },
          });
        } catch (quizErr) {
          console.warn(`[MoodleSync] Isolated error saving quiz:`, quizErr);
        }
      }
    } catch (quizErr) {
      console.warn("Could not sync quizzes (mod_quiz may not be available):", quizErr);
    }
  }

  return {
    studentName: student.name,
    studentId: student.studentId,
    coursesCount: Array.isArray(enrolledCourses) ? enrolledCourses.length : 0,
  };
}
