import { prisma } from "@/lib/prisma";

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

  const moodleUserId = Number(siteInfo.userid);
  const fullName = siteInfo.fullname || "ضياء الدين محمد محمود عبدالرحمن";
  const academicId = siteInfo.username || "202510377";
  const avatarUrl = siteInfo.userpictureurl || null;

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

  // 3. تحديث بيانات الطالب في قاعدة البيانات
  const student = await prisma.student.upsert({
    where: { id: studentId },
    create: {
      id: studentId,
      studentId: academicId,
      name: fullName,
      email: `${academicId}@ammanu.edu.jo`,
      major: "نظم المعلومات الإدارية",
      year: 2,
      gpa: 3.55,
      totalCredits: 132,
      completedCredits: 45,
      avatar: avatarUrl,
      universityId: university.id,
      skills: JSON.stringify([
        "Moodle",
        "العلاقات العامة",
        "المهارات الحياتية",
        "البحث العلمي",
      ]),
    },
    update: {
      studentId: academicId,
      name: fullName,
      avatar: avatarUrl,
      universityId: university.id,
    },
  });

  // 4. استدعاء المواد المسجلة من Moodle
  const coursesUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
    token
  )}&wsfunction=core_enrol_get_users_courses&userid=${moodleUserId}&moodlewsrestformat=json`;

  const coursesRes = await fetch(coursesUrl);
  const enrolledCourses = await coursesRes.json();

  const colors = ["#8B5CF6", "#F59E0B", "#10B981", "#06B6D4", "#6366F1"];
  const courseMoodleIds: number[] = [];

  if (Array.isArray(enrolledCourses) && enrolledCourses.length > 0) {
    for (let i = 0; i < enrolledCourses.length; i++) {
      const c = enrolledCourses[i];
      courseMoodleIds.push(c.id);

      const courseCode = c.shortname || `MDL-${c.id}`;
      const courseId = `moodle-${c.id}`;
      const color = colors[i % colors.length];

      let instructor = "د. أستاذ المادة";
      if (c.fullname.includes("المهارات")) instructor = "أ.د. سوسن بدرخان";
      else if (c.fullname.includes("قانونية")) instructor = "د. أستاذ القانون";
      else if (c.fullname.includes("العربية")) instructor = "د. أستاذ اللغة العربية";
      else if (c.fullname.includes("إعلام")) instructor = "د. أستاذ الإعلام";

      const course = await prisma.course.upsert({
        where: { code: courseCode },
        create: {
          id: courseId,
          code: courseCode,
          nameAr: c.fullname,
          nameEn: c.shortname || c.fullname,
          credits: 3,
          instructor,
          room: "قاعة إلكترونية (V-Class)",
          color,
          semester: "الفصل الصيفي 2025/2026",
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
          nameAr: c.fullname,
          nameEn: c.shortname || c.fullname,
          instructor,
          semester: "الفصل الصيفي 2025/2026",
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
          status: "enrolled",
          semester: "الفصل الصيفي 2025/2026",
        },
        update: {
          status: "enrolled",
        },
      });
    }
  }

  // 5. استدعاء الواجبات والتسليمات القادمة من Moodle
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
              where: { code: { contains: String(c.id) } },
            })) ||
            (await prisma.course.findUnique({
              where: { id: `moodle-${c.id}` },
            }));

          if (!course || !Array.isArray(c.assignments)) continue;

          for (const a of c.assignments) {
            const cleanIntro = a.intro
              ? a.intro.replace(/<[^>]*>?/gm, "").trim().slice(0, 200)
              : "";
            const d = a.duedate ? new Date(a.duedate * 1000) : new Date(Date.now() + 7 * 86400000);
            const dueDate = d.toISOString().split("T")[0];
            const dueTime = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

            await prisma.assignment.upsert({
              where: { id: `moodle-assign-${a.id}` },
              create: {
                id: `moodle-assign-${a.id}`,
                courseId: course.id,
                title: a.name,
                description: cleanIntro || a.name,
                dueDate,
                dueTime: dueTime || "23:59",
                maxGrade: a.grade || 20,
                type: a.name.includes("بحث") ? "project" : "assignment",
              },
              update: {
                title: a.name,
                description: cleanIntro || a.name,
                dueDate,
                dueTime: dueTime || "23:59",
                maxGrade: a.grade || 20,
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
