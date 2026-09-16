import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/crypto";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    // 1. جلب بيانات الاتصال المحفوظة للطالب الحالي
    const session = await getSession();
    let student = null;

    if (session && session.userType === "student" && session.userId) {
      student = await prisma.student.findUnique({
        where: { id: session.userId },
        select: { id: true },
      });
    }

    if (!student) {
      student = await prisma.student.findFirst({
        where: { id: "s-001" },
        select: { id: true },
      });
    }

    if (!student) {
      student = await prisma.student.findFirst({
        select: { id: true },
      });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على سجل الطالب في النظام." },
        { status: 404 }
      );
    }

    const connection = await prisma.moodleConnection.findUnique({
      where: { studentId: student.id },
    });

    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: "لا يوجد اتصال Moodle نشط حالياً. يرجى إتمام خطوة الاتصال أولاً من نموذج الفحص.",
        },
        { status: 404 }
      );
    }

    // 2. فك تشفير الـ Token مؤقتاً في الذاكرة
    let token: string;
    try {
      token = decryptToken(connection.encryptedToken);
    } catch (decErr) {
      console.error("Token decryption failed:", decErr);
      return NextResponse.json(
        { success: false, error: "فشل فك تشفير رمز الوصول (Token). قد يكون مفتاح التشفير قد تغير." },
        { status: 500 }
      );
    }

    const baseUrl = connection.moodleBaseUrl;

    // 3. تحديد معرف الطالب في موودل (moodleUserId)
    let userId = connection.moodleUserId;

    if (!userId) {
      // استدعاء core_webservice_get_site_info لمعرفة userid
      const siteInfoUrl = `${baseUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
        token
      )}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`;

      const siteInfoRes = await fetch(siteInfoUrl);
      if (!siteInfoRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "فشل الاتصال بخدمة site_info في Moodle للتحقق من هوية المستخدم.",
          },
          { status: 502 }
        );
      }

      const siteInfoData = await siteInfoRes.json();
      if (siteInfoData.error || !siteInfoData.userid) {
        return NextResponse.json(
          {
            success: false,
            error: `فشل التحقق من هوية المستخدم في Moodle: ${siteInfoData.message || siteInfoData.error || "خطأ غير معروف"}`,
            rawError: siteInfoData,
          },
          { status: 400 }
        );
      }

      userId = Number(siteInfoData.userid);

      // تحديث معرف المستخدم في قاعدة البيانات
      await prisma.moodleConnection.update({
        where: { id: connection.id },
        data: { moodleUserId: userId },
      });
    }

    // 4. استدعاء دالة core_enrol_get_users_courses من Moodle API الحقيقي
    const coursesUrl = `${baseUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
      token
    )}&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid=${userId}`;

    let coursesRes: Response;
    try {
      coursesRes = await fetch(coursesUrl);
    } catch (netErr: any) {
      console.error("Network error calling core_enrol_get_users_courses:", netErr?.message);
      return NextResponse.json(
        {
          success: false,
          error: "تعذر استدعاء دالة المواد من خادم Moodle (خطأ في الشبكة).",
        },
        { status: 502 }
      );
    }

    if (!coursesRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `استجاب خادم Moodle برمز خطأ (${coursesRes.status}) أثناء جلب المواد.`,
        },
        { status: 502 }
      );
    }

    const rawCourses = await coursesRes.json();

    // 5. فحص ما إذا أعاد Moodle خطأ في الصلاحيات
    if (rawCourses && (rawCourses.error || rawCourses.exception)) {
      await prisma.moodleConnection.update({
        where: { id: connection.id },
        data: { syncStatus: "error" },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "نجح الاتصال الأساسي بالـ Token، ولكن فشل استدعاء دالة المواد (core_enrol_get_users_courses). قد تكون صلاحية هذه الدالة تحديداً غير مفعّلة في إعدادات Moodle الخاصة بجامعتك.",
          moodleResponse: rawCourses,
        },
        { status: 403 }
      );
    }

    // 6. جلب أحداث التقويم وفحص موعد الامتحانات النهائية وتصفير الفصل إذا بدأ
    let semesterEnded = false;
    let finalExamDateStr: string | null = null;
    let resetMessage = "";

    try {
      const nowTs = Math.floor(Date.now() / 1000);
      const calendarUrl = `${baseUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
        token
      )}&wsfunction=core_calendar_get_calendar_events&moodlewsrestformat=json&events[timestart]=${nowTs - 86400 * 30}`;

      const calRes = await fetch(calendarUrl);
      if (calRes.ok) {
        const calData = await calRes.json();
        const events: any[] = Array.isArray(calData?.events) ? calData.events : [];

        // ابحث عن أول امتحان نهائي (Exam / Final Exam / امتحان نهائي)
        const finalExams = events.filter((ev) => {
          const name = (ev.name || "").toLowerCase();
          const desc = (ev.description || "").toLowerCase();
          const eventType = (ev.eventtype || "").toLowerCase();
          return (
            name.includes("نهائي") ||
            name.includes("final") ||
            desc.includes("نهائي") ||
            desc.includes("final") ||
            eventType.includes("exam")
          );
        });

        if (finalExams.length > 0) {
          finalExams.sort((a, b) => (a.timestart || 0) - (b.timestart || 0));
          const earliestExamTs = finalExams[0].timestart * 1000;
          finalExamDateStr = new Date(earliestExamTs).toLocaleDateString("ar-JO");

          // إذا كان اليوم الحالي هو تاريخ أول امتحان نهائي أو بعده -> تصفر بيانات الفصل الحالي
          if (Date.now() >= earliestExamTs) {
            semesterEnded = true;

            // تحديث حالة تسجيلات الطالب إلى مكتملة (completed) لإخفائها وتصفير الفصل
            await prisma.enrollment.updateMany({
              where: {
                studentId: student.id,
                status: "enrolled",
              },
              data: {
                status: "completed",
              },
            });

            // إضافة إشعار رسمي للطالب بانتهاء الفصل الدراسي
            const existingNotification = await prisma.notification.findFirst({
              where: {
                studentId: student.id,
                title: { contains: "انتهاء الفصل الدراسي" },
              },
            });

            if (!existingNotification) {
              await prisma.notification.create({
                data: {
                  studentId: student.id,
                  type: "announcement",
                  title: "انتهاء الفصل الدراسي وبدء الامتحانات النهائية 🎓",
                  body: "انتهى الفصل الدراسي الحالي مع حلول أول أيام الامتحانات النهائية. نتمنى لك دوام التوفيق والنجاح!",
                  link: "/courses",
                },
              });
            }

            resetMessage = "تم رصد أول أيام الامتحانات النهائية وأرشفة مواد الفصل الحالي بنجاح.";
          }
        }
      }
    } catch (calErr) {
      console.warn("Moodle calendar events check skipped or failed:", calErr);
    }

    // 7. تحديث وقت المزامنة الأخير وحالة النجاح
    await prisma.moodleConnection.update({
      where: { id: connection.id },
      data: {
        lastSyncedAt: new Date(),
        syncStatus: "connected",
      },
    });

    // 8. إعادة البيانات الخام كما هي (Raw Data)
    return NextResponse.json({
      success: true,
      message: `تم جلب المواد الحقيقية بنجاح من Moodle (العدد: ${Array.isArray(rawCourses) ? rawCourses.length : 0}). ${resetMessage}`,
      moodleUserId: userId,
      moodleBaseUrl: baseUrl,
      semesterEnded,
      finalExamDate: finalExamDateStr,
      rawCourses,
    });
  } catch (error: any) {
    console.error("GET /api/moodle-test/courses error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ داخلي أثناء جلب مواد Moodle." },
      { status: 500 }
    );
  }
}
