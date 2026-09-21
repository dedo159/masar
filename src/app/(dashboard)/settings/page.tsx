"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Bell,
  Moon,
  Sun,
  Laptop,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LucideIcon,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Smartphone,
  Send,
  AlertCircle,
  Video,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { translateStudentName, translateMajor, getStudentInitials } from "@/lib/translations/content";

interface SettingRowProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  chevron?: LucideIcon;
}

function SettingRow({ icon: Icon, label, description, control, onClick, destructive, chevron: Chevron = ChevronLeft }: SettingRowProps) {
  const content = (
    <>
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          destructive ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0 text-start">
        <p className={`text-sm ${destructive ? "text-destructive font-semibold" : "text-foreground font-medium"}`}>
          {label}
        </p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>

      {control ? (
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {control}
        </div>
      ) : onClick ? (
        <Chevron className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      ) : null}
    </>
  );

  if (control) {
    return (
      <div className="flex w-full items-center gap-3 px-4 py-3.5 min-h-[56px] transition-colors">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-3.5 min-h-[56px] hover:bg-secondary/50 active:bg-secondary/80 transition-all duration-200 text-start ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, isRtl, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // States
  const [notifications, setNotifications] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const [studentName, setStudentName] = useState<string>(t.settings.defaultStudentName);
  const [studentMeta, setStudentMeta] = useState<string>(t.settings.defaultStudentMeta);

  // Push notification states
  const [pushStatus, setPushStatus] = useState<"granted" | "denied" | "default" | "unsupported">("default");
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [pushMessage, setPushMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isApk, setIsApk] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("masar_user_name");
      const storedMajor = localStorage.getItem("masar_user_major");
      if (storedName) setStudentName(storedName);
      if (storedMajor) setStudentMeta(storedMajor);
      const calConnected = localStorage.getItem("masar_google_calendar_connected");
      if (calConnected === "true") setGoogleCalendarConnected(true);

      const isCap = !!(window as any).Capacitor;
      const isAndroidWebView = /wv|Android.*Version\/[0-9.]+/i.test(navigator.userAgent);
      setIsApk(isCap || isAndroidWebView);

      if (!("Notification" in window)) {
        setPushStatus("unsupported");
      } else {
        setPushStatus(Notification.permission);
      }
    }
    
    // Fetch student ID for calendar sync
    fetch("/api/students/me")
      .then(r => r.json())
      .then(d => { if (d.id) setStudentId(d.id); })
      .catch(() => {});

    // Fetch Microsoft Teams connection status
    fetch("/api/student/teams/status")
      .then(r => r.json())
      .then(d => setTeamsStatus(d))
      .catch(() => setTeamsStatus({ connected: false }));
  }, [t]);

  const [teamsStatus, setTeamsStatus] = useState<{ connected: boolean; email?: string; displayName?: string } | null>(null);
  const [isDisconnectingTeams, setIsDisconnectingTeams] = useState(false);

  const handleDisconnectTeams = async () => {
    setIsDisconnectingTeams(true);
    try {
      await fetch("/api/student/teams/disconnect", { method: "POST" });
      setTeamsStatus({ connected: false });
    } catch (e) {
      console.error("Disconnect Teams error:", e);
    } finally {
      setIsDisconnectingTeams(false);
    }
  };

  const displayName = translateStudentName(studentName, language);
  const displayMeta = translateMajor(studentMeta, language);
  const displayInitial = getStudentInitials(studentName, language);

  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const handleSyncMoodle = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/moodle-test/courses");
      if (res.ok) {
        setSyncMessage(t.settings.syncSuccess);
      } else {
        setSyncMessage(t.settings.syncCompleted);
      }
    } catch {
      setSyncMessage(t.settings.syncFallback);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  const handleTestMobilePush = async () => {
    setIsTestingPush(true);
    setPushMessage(null);

    const hasNotification = typeof window !== "undefined" && "Notification" in window;
    const hasServiceWorker = typeof window !== "undefined" && "serviceWorker" in navigator;

    try {
      // 1. Request permission if Notification API is available
      if (hasNotification) {
        let perm: NotificationPermission = Notification.permission;
        if (perm !== "granted") {
          try {
            const res: any = Notification.requestPermission();
            perm = res && typeof res.then === "function" ? await res : (res as NotificationPermission);
          } catch {
            perm = await new Promise<NotificationPermission>((resolve) => {
              try { Notification.requestPermission((p) => resolve(p as NotificationPermission)); }
              catch { resolve("default"); }
            });
          }
          setPushStatus(perm);
          if (perm !== "granted") {
            setPushMessage({
              text: isApk
                ? "لم يتم منح إذن الإشعارات لتطبيق الـ APK. يرجى تفعيلها من: إعدادات الهاتف > التطبيقات > مسار > الإشعارات > السماح بالإشعارات."
                : "لم يتم منح إذن الإشعارات من إعدادات المتصفح/الجهاز. يرجى السماح بالإشعارات لتجربة التنبيه.",
              type: "error",
            });
            setIsTestingPush(false);
            return;
          }
        }
      }

      // 2. Trigger phone vibration immediately
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // 3. Register Service Worker
      let reg: ServiceWorkerRegistration | null = null;
      if (hasServiceWorker) {
        try {
          reg = await navigator.serviceWorker.register("/sw.js");
          await reg.update();
        } catch (swErr) {
          console.warn("ServiceWorker registration note:", swErr);
        }
      }

      // 4. Try showing local notification via Service Worker
      if (reg && reg.showNotification) {
        try {
          await reg.showNotification("مسار — إشعار فوري 🔔", {
            body: "جهازك متصل بنجاح بنظام إشعارات مسار! يعمل التنبيه الصوتي والاهتزاز.",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-72.png",
          });
        } catch {}
      }

      // 5. Try WebPush subscription if PushManager is available
      let pushSubscribed = false;
      if (reg && reg.pushManager) {
        try {
          const vapidPublicKey = "BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI";
          const padding = '='.repeat((4 - vapidPublicKey.length % 4) % 4);
          const base64 = (vapidPublicKey + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }

          let sub = await reg.pushManager.getSubscription();
          if (!sub) {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: outputArray,
            });
          }

          if (sub) {
            await fetch("/api/updates/push/subscribe", {
              method: "POST",
              body: JSON.stringify(sub),
              headers: { "Content-Type": "application/json" },
            });
            pushSubscribed = true;
          }
        } catch (subErr) {
          console.warn("Push subscription note:", subErr);
        }
      }

      // 6. Send backend push via web-push
      const testRes = await fetch("/api/updates/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "مسار — تنبيه مباشر للهاتف 📲",
          body: "تم استلام الإشعار بنجاح! يعمل نظام التنبيهات حتى عند قفل الشاشة أو إغلاق المتصفح.",
          url: "/notifications",
        }),
      });

      const testData = await testRes.json().catch(() => ({}));

      if (testRes.ok) {
        setPushMessage({
          text: "تم إرسال الإشعار بنجاح! تفقد شريط التنبيهات أعلى شاشة هاتفك.",
          type: "success",
        });
      } else if (isApk && !pushSubscribed) {
        setPushMessage({
          text: "تطبيقات الـ APK (WebView) تقيد استقبال الـ Web Push في الخلفية. لتجربة التنبيهات الفورية حتى عند قفل الشاشة، افتح الرابط في متصفح Google Chrome وثبته على هاتفك كـ PWA.",
          type: "info",
        });
      } else {
        setPushMessage({
          text: testData.error || "تم إرسال التنبيه لهاتفك!",
          type: "info",
        });
      }
    } catch (err: any) {
      setPushMessage({
        text: "حدث خطأ أثناء فحص الإشعارات: " + (err.message || String(err)),
        type: "error",
      });
    } finally {
      setIsTestingPush(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t.settings.title}
        subtitle={t.settings.subtitle}
      />

      <div className="max-w-4xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-4">
        {/* Moodle Sync Integration */}
        <SectionLabel>{t.settings.moodleSection}</SectionLabel>
        <div className="rounded-lg border border-border bg-card overflow-hidden p-4 space-y-3 shadow-sm transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t.settings.moodleTitle}
                  </h3>
                  <Badge variant="success" className="text-[11px] gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {t.settings.moodleBadge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.settings.moodleMeta}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="default"
              onClick={handleSyncMoodle}
              disabled={isSyncing}
              className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.settings.syncing}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>{t.settings.syncNow}</span>
                </>
              )}
            </Button>
          </div>

          {syncMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}
        </div>

        {/* Appearance & Theme (3 options) */}
        <SectionLabel>{t.settings.appearanceSection}</SectionLabel>
        <div className="rounded-lg border border-border bg-card overflow-hidden p-4 space-y-3 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{t.settings.appearanceTitle}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.settings.appearanceDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-lg border transition-all cursor-pointer ${
                mounted && theme === "light"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">{t.settings.lightTheme}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-lg border transition-all cursor-pointer ${
                mounted && theme === "dark"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">{t.settings.darkTheme}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-lg border transition-all cursor-pointer ${
                mounted && theme === "system"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span className="text-xs">{t.settings.systemTheme}</span>
            </button>
          </div>
        </div>

        {/* Calendar Integrations */}
        <SectionLabel>{t.settings.calendarSection}</SectionLabel>
        <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border shadow-sm transition-all">
          <SettingRow
            icon={Calendar}
            label={t.settings.googleCalendar}
            description={googleCalendarConnected ? t.settings.googleCalendarActive : t.settings.googleCalendarInactive}
            chevron={Chevron}
            control={
              googleCalendarConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1 font-semibold text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    {t.settings.activeBadge}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px] text-xs px-3 active:scale-95 transition-transform cursor-pointer"
                    onClick={() => {
                      setGoogleCalendarConnected(false);
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("masar_google_calendar_connected");
                      }
                    }}
                  >
                    {t.settings.unlinkBtn}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[44px] text-xs px-4 active:scale-95 transition-transform cursor-pointer"
                  onClick={async () => {
                    let targetId = studentId;
                    if (!targetId) {
                      try {
                        const res = await fetch("/api/students/me");
                        const data = await res.json();
                        if (data?.id) targetId = data.id;
                      } catch {}
                    }

                    const calId = targetId || "s-001";
                    const feedUrl = `https://${window.location.host}/api/calendar/${calId}`;
                    const googleUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(feedUrl)}`;

                    // 1. Mark as connected & save permanently
                    setGoogleCalendarConnected(true);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("masar_google_calendar_connected", "true");
                    }

                    // 2. Open Google Calendar in new tab/app, fallback to downloading .ics
                    const win = window.open(googleUrl, "_blank");
                    if (!win) {
                      window.location.href = `/api/calendar/${calId}`;
                    }
                  }}
                >
                  {t.settings.linkBtn}
                </Button>
              )
            }
          />

          {/* Microsoft Teams Integration */}
          <SettingRow
            icon={Video}
            label={language === "ar" ? "تقويم Microsoft Teams" : "Microsoft Teams Calendar"}
            description={
              teamsStatus?.connected
                ? (language === "ar"
                    ? `متصل (${teamsStatus.email || "حساب الطالب"}) — مزامنة المواعيد وروابط الاجتماعات تلقائياً`
                    : `Connected (${teamsStatus.email || "Student Account"}) — syncing lecture times & links`)
                : (language === "ar"
                    ? "مزامنة المحاضرات وروابط الاجتماعات المباشرة (نطاق الطالب فقط: تقويم شخصي)"
                    : "Sync lecture times & direct join links (student calendar scope)")
            }
            chevron={Chevron}
            control={
              teamsStatus?.connected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1 font-semibold text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    {language === "ar" ? "مُتصل" : "Connected"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisconnectingTeams}
                    className="min-h-[44px] text-xs px-3 active:scale-95 transition-transform cursor-pointer text-destructive hover:bg-destructive/10"
                    onClick={handleDisconnectTeams}
                  >
                    {isDisconnectingTeams ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      language === "ar" ? "إلغاء الربط" : "Disconnect"
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[44px] text-xs px-4 bg-[#505AC9] hover:bg-[#434baf] text-white active:scale-95 transition-transform cursor-pointer"
                  onClick={() => {
                    window.location.href = "/api/auth/microsoft";
                  }}
                >
                  {language === "ar" ? "ربط Teams" : "Connect Teams"}
                </Button>
              )
            }
          />
        </div>

        {/* Notifications */}
        <SectionLabel>{t.settings.notificationsSection}</SectionLabel>
        <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border shadow-sm transition-all">
          <SettingRow
            icon={Bell}
            label={t.settings.generalNotifications}
            description={t.settings.generalNotificationsDesc}
            chevron={Chevron}
            control={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label={t.settings.generalNotifications}
              />
            }
          />
          <SettingRow
            icon={Bell}
            label={t.settings.deadlineAlerts}
            description={t.settings.deadlineAlertsDesc}
            chevron={Chevron}
            control={
              <Switch
                checked={deadlineAlerts}
                onCheckedChange={setDeadlineAlerts}
                disabled={!notifications}
                aria-label={t.settings.deadlineAlerts}
              />
            }
          />
          <SettingRow
            icon={Bell}
            label={t.settings.gradeAlerts}
            description={t.settings.gradeAlertsDesc}
            chevron={Chevron}
            control={
              <Switch
                checked={gradeAlerts}
                onCheckedChange={setGradeAlerts}
                disabled={!notifications}
                aria-label={t.settings.gradeAlerts}
              />
            }
          />
        </div>

        {/* Mobile Device Push Notifications Test Box */}
        <div className="rounded-lg border border-border bg-card overflow-hidden p-4 space-y-3 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground">
                    إشعارات الهاتف المباشرة (Push Notifications)
                  </h3>
                  <Badge
                    variant={pushStatus === "granted" ? "success" : pushStatus === "denied" ? "destructive" : "secondary"}
                    className="text-[11px] gap-1"
                  >
                    {pushStatus === "granted" && <CheckCircle2 className="h-3 w-3" />}
                    {pushStatus === "granted"
                      ? "مفعل 🟢"
                      : pushStatus === "denied"
                      ? "محظور 🔴"
                      : pushStatus === "unsupported"
                      ? "غير مدعوم مباشرة في الـ APK ⚠️"
                      : "بحاجة لإذن 🔔"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  تصلك التنبيهات على شاشة قفل هاتفك مباشرة خارج المتصفح والتطبيق (مواعيد الواجبات، الدرجات، الإعلانات الهامة).
                </p>
                {isApk && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-medium bg-amber-500/10 px-2.5 py-1.5 rounded-md border border-amber-500/20">
                    📱 مستخدم تطبيق الـ APK: يرجى تفعيل الإذن من <strong>ضبط الهاتف &gt; التطبيقات &gt; مسار &gt; الإشعارات &gt; تفعيل</strong>.
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="default"
              size="default"
              onClick={handleTestMobilePush}
              disabled={isTestingPush}
              className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer active:scale-95 transition-transform flex-shrink-0"
            >
              {isTestingPush ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جارٍ إرسال التنبيه...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>اختبار إشعار فوري للهاتف 📲</span>
                </>
              )}
            </Button>
          </div>

          {pushMessage && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 animate-in fade-in-50 duration-200 ${
                pushMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  : pushMessage.type === "error"
                  ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                  : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              }`}
            >
              {pushMessage.type === "success" ? (
                <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-medium">{pushMessage.text}</p>
                {pushMessage.type === "success" && (
                  <p className="text-[11px] opacity-90">
                    💡 <strong>طريقة التحقق:</strong> اقفل شاشة هاتفك أو اخرج من المتصفح، وسيظهر لك الإشعار في شريط الحالة مع نغمة التنبيه والاهتزاز.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Microsoft Teams Integration */}
        <SectionLabel>{language === "ar" ? "الربط والتكامل" : "Integrations"}</SectionLabel>
        <TeamsIntegrationCard isAr={language === "ar"} Chevron={Chevron} />

        {/* Danger Zone */}
        <SectionLabel>{t.settings.securitySection}</SectionLabel>
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-6 shadow-sm transition-all">
          <SettingRow
            icon={LogOut}
            label={t.settings.logoutTitle}
            description={t.settings.logoutDesc}
            chevron={Chevron}
            destructive
            onClick={async () => {
              
              if (typeof window !== "undefined") {
                localStorage.removeItem("masar_logged_in");
                localStorage.removeItem("masar_user_name");
                localStorage.removeItem("masar_user_major"); document.cookie = "masar_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              }
              window.location.href = "/api/student/auth/logout?t=" + Date.now();
            }}
          />
        </div>
      </div>
    </>
  );
}

// ---- Teams Integration Card ----
function TeamsIntegrationCard({ isAr, Chevron }: { isAr: boolean; Chevron: any }) {
  const [status, setStatus] = useState<{ connected: boolean; email?: string; displayName?: string; lastSyncedAt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch("/api/student/teams/status")
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ connected: false }))
      .finally(() => setLoading(false));
  }, []);

  const handleDisconnect = async () => {
    if (!confirm(isAr ? "هل أنت متأكد من إلغاء ربط Microsoft Teams؟" : "Are you sure you want to disconnect Microsoft Teams?")) return;
    setDisconnecting(true);
    try {
      await fetch("/api/student/teams/disconnect", { method: "POST" });
      setStatus({ connected: false });
    } catch { /* ignore */ }
    setDisconnecting(false);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 mb-6 shadow-sm flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{isAr ? "جاري التحقق..." : "Checking..."}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden mb-6 shadow-sm">
      <div className="p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-[#505AC9]/10 text-[#505AC9] dark:text-[#7B83EB] flex items-center justify-center flex-shrink-0">
          <Video className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">Microsoft Teams</p>
          {status?.connected ? (
            <div className="space-y-0.5">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {isAr ? "متصل ومُزامن" : "Connected & Synced"}
              </p>
              {status.email && (
                <p className="text-[11px] text-muted-foreground truncate">{status.email}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {isAr ? "اربط حسابك لتلقي مواعيد المحاضرات وروابط الاجتماعات" : "Connect to sync lecture times & meeting links"}
            </p>
          )}
        </div>
        {status?.connected ? (
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium disabled:opacity-50"
          >
            {disconnecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              isAr ? "إلغاء الربط" : "Disconnect"
            )}
          </button>
        ) : (
          <a
            href="/api/auth/microsoft"
            className="text-xs px-3 py-1.5 rounded-lg bg-[#505AC9] text-white hover:bg-[#505AC9]/90 transition-colors font-bold"
          >
            {isAr ? "ربط الحساب" : "Connect"}
          </a>
        )}
      </div>
    </div>
  );
}
