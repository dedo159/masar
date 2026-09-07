"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlugZap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Server,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function MoodleTestPage() {
  const [moodleUrl, setMoodleUrl] = useState("https://elearning.ju.edu.jo/moodle10");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // حالات الاتصال
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectResult, setConnectResult] = useState<any>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  // حالات جلب المواد
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const [coursesResult, setCoursesResult] = useState<any>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // 1. إجراء فحص الاتصال
  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setIsConnecting(true);
    setConnectError(null);
    setConnectResult(null);
    setCoursesResult(null);
    setCoursesError(null);

    try {
      const res = await fetch("/api/moodle-test/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodleUrl, username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setConnectError(data.error || "فشل الاتصال بـ Moodle.");
      } else {
        setConnectResult(data);
        // تفريغ حقل كلمة المرور من الذاكرة فوراً كإجراء أمان إضافي
        setPassword("");
      }
    } catch (err: any) {
      setConnectError(err.message || "حدث خطأ غير متوقع أثناء الاتصال.");
    } finally {
      setIsConnecting(false);
    }
  }

  // 2. جلب المواد الحقيقية
  async function handleFetchCourses() {
    setIsFetchingCourses(true);
    setCoursesError(null);
    setCoursesResult(null);

    try {
      const res = await fetch("/api/moodle-test/courses");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setCoursesError(data.error || "فشل جلب المواد من Moodle.");
        if (data.moodleResponse) {
          setCoursesResult(data.moodleResponse);
        }
      } else {
        setCoursesResult(data);
      }
    } catch (err: any) {
      setCoursesError(err.message || "حدث خطأ في الاتصال بالـ API.");
    } finally {
      setIsFetchingCourses(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="اختبار ربط Moodle (Proof of Concept)"
        subtitle="مسار تجريبي لاختبار الاتصال وجلب المواد الحقيقية عبر Moodle API"
      />

      <div className="px-4 py-4 space-y-6 max-w-4xl mx-auto">
        {/* شريط تنبيه الأمان */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground block mb-0.5">ضمانات الأمان والخصوصية:</span>
            كلمة المرور تُستخدم فقط لطلب الـ Token لمرة واحدة وتُمحى فوراً، ولن تُخزَّن في أي قاعدة بيانات أو سجل.
            الـ Token الناتج يُشفَّر فوراً بخوارزمية AES-256-GCM.
          </div>
        </div>

        {/* نموذج الاتصال بـ Moodle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">1. الاتصال واستخراج الـ Token</CardTitle>
              </div>
              {connectResult && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  متصل ومشفّر ✓
                </Badge>
              )}
            </div>
            <CardDescription>
              أدخل رابط نظام Moodle الخاص بجامعتك وبيانات الدخول لطلب رمز الوصول (Token).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  رابط موودل الجامعة (Moodle URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  placeholder="https://moodle.ju.edu.jo"
                  value={moodleUrl}
                  onChange={(e) => setMoodleUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  مثال: <span dir="ltr">https://elearning.ju.edu.jo/moodle10</span> أو رابط بوابة التعلم الإلكتروني بجامعتك
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    اسم المستخدم / الرقم الجامعي
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    placeholder="2110456"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5 flex items-center justify-between">
                    <span>كلمة المرور</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                      <Lock className="h-3 w-3" /> لا يتم تخزينها
                    </span>
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-left"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isConnecting} className="w-full sm:w-auto gap-2">
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري طلب الـ Token والتحقق...
                  </>
                ) : (
                  <>
                    <PlugZap className="h-4 w-4" />
                    اختبار الاتصال واستخراج الـ Token
                  </>
                )}
              </Button>
            </form>

            {/* رسالة الخطأ إن وجدت */}
            {connectError && (
              <div className="mt-4 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-0.5">فشل الاتصال:</p>
                  <p>{connectError}</p>
                </div>
              </div>
            )}

            {/* نتيجة الاتصال الناجحة */}
            {connectResult && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{connectResult.message}</span>
                </div>
                {connectResult.siteInfo && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-foreground">
                    <div>
                      <span className="text-muted-foreground">اسم الطالب: </span>
                      <span className="font-medium">{connectResult.siteInfo.fullname}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">معرف المستخدم (User ID): </span>
                      <span className="font-medium font-mono">{connectResult.siteInfo.userid}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">اسم النظام: </span>
                      <span className="font-medium">{connectResult.siteInfo.sitename}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">اسم الدخول: </span>
                      <span className="font-medium font-mono">{connectResult.siteInfo.username}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* قسم جلب المواد الحقيقية */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">2. جلب المواد الحقيقية (core_enrol_get_users_courses)</CardTitle>
              </div>
            </div>
            <CardDescription>
              استدعاء الـ Moodle API الرسمي لقراءة المواد المسجلة فعلياً لحساب الطالب وعرض البيانات الخام المستلمة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleFetchCourses}
              disabled={isFetchingCourses}
              variant="outline"
              className="gap-2"
            >
              {isFetchingCourses ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري جلب المواد من Moodle...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  جلب موادي الحقيقية من Moodle
                </>
              )}
            </Button>

            {/* رسالة الخطأ إن وجدت */}
            {coursesError && (
              <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-0.5">خطأ في استدعاء دالة المواد:</p>
                  <p>{coursesError}</p>
                </div>
              </div>
            )}

            {/* عرض النتيجة الخام (Raw JSON) */}
            {coursesResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>البيانات المستلمة من Moodle (Raw JSON):</span>
                  {coursesResult.rawCourses && (
                    <Badge variant="secondary" className="font-mono">
                      {Array.isArray(coursesResult.rawCourses) ? `${coursesResult.rawCourses.length} مادة` : "استجابة"}
                    </Badge>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 max-h-96 overflow-auto">
                  <pre
                    dir="ltr"
                    className="text-xs font-mono text-foreground whitespace-pre-wrap break-all leading-relaxed"
                  >
                    {JSON.stringify(coursesResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
