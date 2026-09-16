import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type {
  Student,
  Course,
  Assignment,
  CourseFile,
  CourseGrade,
  Internship,
  Notification,
  TodayClass,
} from "@/lib/types";
import { getTodayDay } from "@/lib/utils";
import { getCurrentTimeInAmman } from "@/lib/timezone";
import { translateCourseName } from "@/lib/translations/academic";
import { getSession } from "@/lib/auth";

// Default fallback student ID (for demo or unauthenticated SSR fallback)


/**
 * Resolves current student ID from active JWT session if available,
 * throws Unauthorized error if neither is available.
 */
export async function resolveCurrentStudentId(explicitId?: string): Promise<string> {
  if (explicitId) return explicitId;
  try {
    const session = await getSession();
    if (session && session.userType === "student" && session.userId) {
      return session.userId;
    }
  } catch {
    // getSession might fail if called outside request scope
  }
  throw new Error("Unauthorized: No active session found");
}

// ----------------------------------------------------
// 1. بيانات الطالب (Student Profile)
// ----------------------------------------------------
export const getStudentProfile = cache(async (
  studentId?: string
): Promise<Student | null> => {
  const resolvedId = await resolveCurrentStudentId(studentId);
  try {
    const student = await prisma.student.findFirst({
      where: { id: resolvedId },
      include: { university: true },
    });

    if (!student) return null;

    let parsedSkills: string[] = [];
    try {
      parsedSkills = JSON.parse(student.skills);
    } catch {
      parsedSkills = [];
    }

    return {
      id: student.id,
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      universityId: student.university?.code || "ju",
      major: student.major,
      year: student.year,
      gpa: student.gpa,
      totalCredits: student.totalCredits,
      completedCredits: student.completedCredits,
      avatar: student.avatar || undefined,
      github: student.github || undefined,
      portfolio: student.portfolio || undefined,
      skills: parsedSkills,
    };
  } catch {
    return {
      id: resolvedId,
      name: "طالب مسار",
      studentId: "202510377",
      email: "student@masar.edu.jo",
      universityId: "ju",
      major: "علم الحاسوب",
      year: 3,
      gpa: 3.45,
      totalCredits: 132,
      completedCredits: 78,
      skills: ["React", "TypeScript", "Next.js"],
    };
  }
});

// ----------------------------------------------------
// 2. المواد المسجلة (Courses)
// ----------------------------------------------------
export const getEnrolledCourses = cache(async (
  studentId?: string
): Promise<Course[]> => {
  const resolvedId = await resolveCurrentStudentId(studentId);
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { 
        studentId: resolvedId,
        status: "enrolled",
      },
      include: {
      course: {
        include: {
          assignments: {
            include: {
              submissions: {
                where: { studentId: resolvedId },
              },
            },
          },
          files: true,
        },
      },
    },
  });

  return enrollments.map((e) => {
    let schedule = [];
    try {
      schedule = JSON.parse(e.course.schedule);
    } catch {
      schedule = [];
    }

    const assignments: Assignment[] = e.course.assignments.map((a) => {
      const sub = a.submissions[0];
      return {
        id: a.id,
        courseId: a.courseId,
        title: a.title,
        description: a.description || undefined,
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        status: (sub?.status || a.type) as Assignment["status"],
        grade: sub?.grade !== null && sub?.grade !== undefined ? sub.grade : undefined,
        maxGrade: a.maxGrade,
        type: a.type as Assignment["type"],
      };
    });

    const files: CourseFile[] = e.course.files.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.type as CourseFile["type"],
      url: f.url,
      uploadedAt: f.uploadedAt,
      week: f.week !== null && f.week !== undefined ? f.week : undefined,
    }));

    const grade: CourseGrade | undefined =
      e.midtermGrade !== null || e.totalGrade !== null || e.assignmentsGrade !== null || e.finalGrade !== null
        ? {
            midterm: e.midtermGrade !== null && e.midtermGrade !== undefined ? e.midtermGrade : undefined,
            final: e.finalGrade !== null && e.finalGrade !== undefined ? e.finalGrade : undefined,
            assignments: e.assignmentsGrade !== null && e.assignmentsGrade !== undefined ? e.assignmentsGrade : undefined,
            participation: e.participationGrade !== null && e.participationGrade !== undefined ? e.participationGrade : undefined,
            total: e.totalGrade !== null && e.totalGrade !== undefined ? e.totalGrade : undefined,
            letter: e.letterGrade || undefined,
          }
        : undefined;

    return {
      id: e.course.id,
      code: e.course.code,
      nameAr: e.course.nameAr,
      nameEn: e.course.nameEn || translateCourseName(e.course.code, e.course.nameAr, null, "en"),
      credits: e.course.credits,
      instructor: e.course.instructor,
      room: e.course.room,
      color: e.course.color,
      semester: e.course.semester,
      status: e.status as Course["status"],
      schedule,
      grade,
      assignments,
      files,
    };
  });
  } catch {
    return [];
  }
});

// ----------------------------------------------------
// 3. تفاصيل مادة محددة (Course by ID)
// ----------------------------------------------------
export const getCourseById = cache(async (
  courseId: string,
  studentId?: string
): Promise<Course | null> => {
  const resolvedId = await resolveCurrentStudentId(studentId);
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId,
      studentId: resolvedId,
    },
    include: {
      course: {
        include: {
          assignments: {
            include: {
              submissions: {
                where: { studentId: resolvedId },
              },
            },
          },
          files: true,
        },
      },
    },
  });

  if (!enrollment) {
    // If not enrolled, fetch public course info
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        assignments: true,
        files: true,
      },
    });
    if (!course) return null;

    let schedule = [];
    try {
      schedule = JSON.parse(course.schedule);
    } catch {
      schedule = [];
    }

    return {
      id: course.id,
      code: course.code,
      nameAr: course.nameAr,
      nameEn: course.nameEn,
      credits: course.credits,
      instructor: course.instructor,
      room: course.room,
      color: course.color,
      semester: course.semester,
      status: "enrolled",
      schedule,
      assignments: course.assignments.map((a) => ({
        id: a.id,
        courseId: a.courseId,
        title: a.title,
        description: a.description || undefined,
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        status: "pending",
        maxGrade: a.maxGrade,
        type: a.type as Assignment["type"],
      })),
      files: course.files.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type as CourseFile["type"],
        url: f.url,
        uploadedAt: f.uploadedAt,
        week: f.week !== null && f.week !== undefined ? f.week : undefined,
      })),
    };
  }

  let schedule = [];
  try {
    schedule = JSON.parse(enrollment.course.schedule);
  } catch {
    schedule = [];
  }

  const assignments: Assignment[] = enrollment.course.assignments.map((a) => {
    const sub = a.submissions[0];
    return {
      id: a.id,
      courseId: a.courseId,
      title: a.title,
      description: a.description || undefined,
      dueDate: a.dueDate,
      dueTime: a.dueTime,
      status: (sub?.status || "pending") as Assignment["status"],
      grade: sub?.grade !== null && sub?.grade !== undefined ? sub.grade : undefined,
      maxGrade: a.maxGrade,
      type: a.type as Assignment["type"],
    };
  });

  const files: CourseFile[] = enrollment.course.files.map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type as CourseFile["type"],
    url: f.url,
    uploadedAt: f.uploadedAt,
    week: f.week !== null && f.week !== undefined ? f.week : undefined,
  }));

  const grade: CourseGrade | undefined =
    enrollment.midtermGrade !== null ||
    enrollment.totalGrade !== null ||
    enrollment.assignmentsGrade !== null ||
    enrollment.finalGrade !== null
      ? {
          midterm: enrollment.midtermGrade !== null && enrollment.midtermGrade !== undefined ? enrollment.midtermGrade : undefined,
          final: enrollment.finalGrade !== null && enrollment.finalGrade !== undefined ? enrollment.finalGrade : undefined,
          assignments: enrollment.assignmentsGrade !== null && enrollment.assignmentsGrade !== undefined ? enrollment.assignmentsGrade : undefined,
          participation: enrollment.participationGrade !== null && enrollment.participationGrade !== undefined ? enrollment.participationGrade : undefined,
          total: enrollment.totalGrade !== null && enrollment.totalGrade !== undefined ? enrollment.totalGrade : undefined,
          letter: enrollment.letterGrade || undefined,
        }
      : undefined;

  return {
    id: enrollment.course.id,
    code: enrollment.course.code,
    nameAr: enrollment.course.nameAr,
    nameEn: enrollment.course.nameEn || translateCourseName(enrollment.course.code, enrollment.course.nameAr, null, "en"),
    credits: enrollment.course.credits,
    instructor: enrollment.course.instructor,
    room: enrollment.course.room,
    color: enrollment.course.color,
    semester: enrollment.course.semester,
    status: enrollment.status as Course["status"],
    schedule,
    grade,
    assignments,
    files,
  };
});

// ----------------------------------------------------
// 5. فرص التدريب (Internships)
// ----------------------------------------------------
export const getInternships = cache(async (): Promise<Internship[]> => {
  const internships = await prisma.internship.findMany({
    orderBy: { createdAt: "desc" },
  });

  return internships.map((i) => {
    let tags = [];
    try {
      tags = JSON.parse(i.tags);
    } catch {
      tags = [];
    }

    return {
      id: i.id,
      company: i.company,
      title: i.title,
      location: i.location,
      type: i.type as Internship["type"],
      duration: i.duration,
      deadline: i.deadline || undefined,
      applyUrl: i.applyUrl,
      tags,
      isNew: i.isNew,
    };
  });
});

// ----------------------------------------------------
// 6. الإشعارات (Notifications)
// ----------------------------------------------------
export const getNotifications = cache(async (
  studentId?: string
): Promise<Notification[]> => {
  const resolvedId = await resolveCurrentStudentId(studentId);
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [{ studentId: resolvedId }, { studentId: null }],
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type as Notification["type"],
    title: n.title,
    body: n.body,
    createdAt: n.createdAt.toISOString(),
    read: n.read,
    link: n.link || undefined,
  }));
});

// ----------------------------------------------------
// 7. محاضرات اليوم (Today Schedule)
// ----------------------------------------------------
export const getTodayClasses = cache(async (
  studentId?: string
): Promise<TodayClass[]> => {
  const resolvedId = await resolveCurrentStudentId(studentId);
  const courses = await getEnrolledCourses(resolvedId);
  const today = getTodayDay(); // e.g. "sun", "mon", etc.

  const classes: TodayClass[] = [];

  const { totalMinutes: currentMinutes } = getCurrentTimeInAmman();

  for (const c of courses) {
    const todaySessions = c.schedule.filter((s) => s.day === today);
    for (const s of todaySessions) {
      const [startH, startM] = s.startTime.split(":").map(Number);
      const [endH, endM] = s.endTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      let status: TodayClass["status"] = "upcoming";
      if (currentMinutes >= endMinutes) {
        status = "done";
      } else if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        status = "ongoing";
      }

      classes.push({
        courseId: c.id,
        courseCode: c.code,
        courseNameAr: c.nameAr,
        courseNameEn: translateCourseName(c.code, c.nameAr, c.nameEn, "en"),
        instructor: c.instructor,
        room: c.room,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
        color: c.color,
        status,
      });
    }
  }

  // Sort by start time
  return classes.sort((a, b) => a.startTime.localeCompare(b.startTime));
});
