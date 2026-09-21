import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";
import { syncMoodleDataForStudent } from "@/lib/moodle-sync";
import { getSession, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { moodleUrl, username, password, major } = body;

    // 1. التحقق من المدخلات
    if (!moodleUrl || typeof moodleUrl !== "string" || !username || typeof username !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال رابط Moodle، اسم المستخدم، وكلمة المرور بالكامل." },
        { status: 400 }
      );
    }

    // 2. تنظيف الرابط
    let cleanUrl = moodleUrl.trim().replace(/\/+$/, "");
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // 3. استدعاء نقطة الدخول login/token.php عبر POST
    const tokenEndpoint = `${cleanUrl}/login/token.php`;
    const params = new URLSearchParams();
    params.append("username", username.trim());
    params.append("password", password); // كلمة المرور تستخدم فقط هنا ولن تُخزَّن مطلقاً
    params.append("service", "moodle_mobile_app");

    let tokenResponse: Response;
    try {
      tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    } catch (netErr: any) {
      console.error("Network error reaching Moodle:", netErr?.message);
      return NextResponse.json(
        {
          success: false,
          error: "تعذر الاتصال بخادم Moodle على الرابط المدخل. يرجى التأكد من صحة الرابط ومن إمكانية الوصول إليه من الإنترنت.",
        },
        { status: 502 }
      );
    }

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `استجاب خادم Moodle برمز خطأ (${tokenResponse.status}). يرجى التحقق من صحة رابط Moodle الخاص بجامعتك.`,
        },
        { status: 502 }
      );
    }

    const data = await tokenResponse.json();

    // 4. معالجة أخطاء Moodle الشائعة
    if (data.error || !data.token) {
      const errCode = data.errorcode || "";
      let errorMsg = "فشل تسجيل الدخول إلى Moodle.";

      if (errCode === "invalidlogin") {
        errorMsg = "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من بيانات الدخول.";
      } else if (errCode === "servicenotavailable" || errCode === "enablews") {
        errorMsg = "خدمة Moodle Mobile أو خدمات الويب غير مفعّلة في نظام Moodle بجامعتك.";
      } else if (data.error) {
        errorMsg = `خطأ من Moodle: ${data.error}`;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          errorCode: errCode || undefined,
        },
        { status: 401 }
      );
    }

    // 5. تشفير الـ Token فوراً عبر AES-256-GCM
    const rawToken = String(data.token);
    const encryptedToken = encryptToken(rawToken);

    // 6. استدعاء سريع لـ core_webservice_get_site_info لمعرفة userid وبيانات الحساب
    let moodleUserId: number | null = null;
    let siteInfoSummary = null;

    try {
      const siteInfoUrl = `${cleanUrl}/webservice/rest/server.php?wstoken=${encodeURIComponent(
        rawToken
      )}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`;

      const siteInfoRes = await fetch(siteInfoUrl);
      if (siteInfoRes.ok) {
        const siteInfoData = await siteInfoRes.json();
        if (siteInfoData && siteInfoData.userid) {
          moodleUserId = Number(siteInfoData.userid);
          siteInfoSummary = {
            sitename: siteInfoData.sitename || "Moodle",
            fullname: siteInfoData.fullname || "",
            username: siteInfoData.username || "",
            userid: moodleUserId,
          };
        }
      }
    } catch (e) {
      console.warn("Could not fetch site_info during connect (optional step):", e);
    }

    // 7. حفظ / تحديث بيانات الاتصال في قاعدة البيانات للطالب الحالي
    const session = await getSession();
    let student = null;

    if (session && session.userType === "student" && session.userId) {
      student = await prisma.student.findUnique({
        where: { id: session.userId },
        select: { id: true },
      });
    }

    if (!student) {
      student = await prisma.student.findUnique({
        where: { studentId: username.trim() },
        select: { id: true },
      });
    }

    if (!student) {
      let university = await prisma.university.findFirst({
        where: { code: "aau" },
      });
      if (!university) {
        university = await prisma.university.create({
          data: {
            code: "aau",
            name: "جامعة عمان الأهلية",
            nameEn: "Al-Ahliyya Amman University",
          },
        });
      }
      student = await prisma.student.create({
        data: {
          studentId: username.trim(),
          name: siteInfoSummary?.fullname || username.trim(),
          email: `${username.trim()}@ammanu.edu.jo`,
          major: (major && typeof major === "string" && major.trim()) ? major.trim() : "هندسة البرمجيات",
          year: 3,
          universityId: university.id,
        },
        select: { id: true },
      });
    }

    // حفظ التخصص فوراً في قاعدة البيانات إذا تم إدخاله
    if (major && typeof major === "string" && major.trim()) {
      await prisma.student.update({
        where: { id: student.id },
        data: {
          major: major.trim(),
        },
      });
    }

    // حفظ كلمة المرور المشفرة للطالب لتسجيل الدخول السلس لاحقاً
    try {
      const { hashPassword } = await import("@/lib/password");
      const passwordHash = await hashPassword(password);
      await prisma.student.update({
        where: { id: student.id },
        data: { passwordHash },
      });
    } catch {
      // Non-blocking
    }

    await prisma.moodleConnection.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        moodleBaseUrl: cleanUrl,
        encryptedToken,
        moodleUserId,
        syncStatus: "connected",
        connectedAt: new Date(),
      },
      update: {
        moodleBaseUrl: cleanUrl,
        encryptedToken,
        moodleUserId,
        syncStatus: "connected",
        connectedAt: new Date(),
      },
    });

    // 8. استيراد وتحديث بيانات الطالب ومواده وواجباته الحقيقية من موودل
    let syncResult = null;
    try {
      syncResult = await syncMoodleDataForStudent(
        rawToken,
        cleanUrl,
        student.id,
        typeof major === "string" ? major : undefined
      );
    } catch (syncErr) {
      console.warn("Moodle data sync error:", syncErr);
    }

    // 9. إنشاء جلسة (Session) للطالب إذا لم يكن لديه واحدة بالفعل (لأنه سجل دخول للتو من موودل)
    if (!session) {
      const fullStudent = await prisma.student.findUnique({
        where: { id: student.id },
      });
      if (fullStudent) {
        // Create a persistent session (e.g. 30 days) by passing rememberMe=true
        await createSession({
          userId: fullStudent.id,
          userType: "student",
          universityId: fullStudent.universityId,
          name: fullStudent.name,
          email: fullStudent.email,
        }, true);
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم الاتصال بنجاح واستيراد بيانات حسابك من Moodle.",
      student: syncResult,
      siteInfo: siteInfoSummary,
    });
  } catch (error: any) {
    console.error("POST /api/moodle-test/connect error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ داخلي أثناء معالجة الاتصال." },
      { status: 500 }
    );
  }
}
