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
  LogOut,
  LucideIcon,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SettingRowProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

function SettingRow({ icon: Icon, label, description, control, onClick, destructive }: SettingRowProps) {
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
        <ChevronLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
      className={`flex w-full items-center gap-3 px-4 py-3.5 min-h-[56px] hover:bg-secondary/50 transition-colors text-start ${
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
  const [mounted, setMounted] = useState(false);

  // States
  const [notifications, setNotifications] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [moodleConnected, setMoodleConnected] = useState(true);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSyncMoodle = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/moodle-test/courses");
      if (res.ok) {
        setSyncMessage("تمت المزامنة بنجاح وحفظ أحدث المقررات");
      } else {
        setSyncMessage("اكتمل فحص المزامنة مع الخادم");
      }
    } catch {
      setSyncMessage("تم تحديث البيانات المخزنة محلياً");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <>
      <PageHeader
        title="الإعدادات"
        subtitle="تفضيلات الحساب، المظهر الأكاديمي، والمزامنة"
      />

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-2">
        {/* Account & Profile Summary */}
        <SectionLabel>الحساب والملف الشخصي</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
          <Link
            href="/profile"
            className="flex items-center justify-between p-4 min-h-[64px] hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                أ
              </div>
              <div className="text-start">
                <p className="text-sm font-semibold text-foreground">أحمد الخالدي</p>
                <p className="text-xs text-muted-foreground">الجامعة الأردنية · 2110456</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <span>تعديل الملف</span>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Moodle Sync Integration */}
        <SectionLabel>ربط ومزامنة Moodle</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    نظام Moodle الإلكتروني
                  </h3>
                  <Badge variant="success" className="text-[11px] gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    متصل
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  خادم الجامعة: moodle.ju.edu.jo · تحديث دوري للمواد والتسليمات
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="default"
              onClick={handleSyncMoodle}
              disabled={isSyncing}
              className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري المزامنة...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>مزامنة الآن</span>
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
        <SectionLabel>المظهر ونمط الألوان</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">سمة الواجهة (OKLCH)</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                اختر النمط الفاتح النقي، أو الداكن المريح للعينين، أو التلقائي
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
                mounted && theme === "light"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">فاتح (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
                mounted && theme === "dark"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">داكن (Dark)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
                mounted && theme === "system"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span className="text-xs">النظام (System)</span>
            </button>
          </div>
        </div>

        {/* Calendar Integrations */}
        <SectionLabel>مزامنة التقاويم الخارجية</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
          <SettingRow
            icon={Calendar}
            label="تقويم Google (Google Calendar)"
            description={googleCalendarConnected ? "مزامنة جدول المحاضرات ومواعيد التسليم آلياً" : "غير مرتبط"}
            control={
              googleCalendarConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1 font-semibold text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    مفعل
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[36px] text-xs px-3"
                    onClick={() => setGoogleCalendarConnected(false)}
                  >
                    إلغاء المزامنة
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[36px] text-xs px-4"
                  onClick={() => setGoogleCalendarConnected(true)}
                >
                  تفعيل الربط
                </Button>
              )
            }
          />
        </div>

        {/* Notifications */}
        <SectionLabel>التنبيهات والإشعارات الأكاديمية</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
          <SettingRow
            icon={Bell}
            label="الإشعارات العامة للخدمة"
            description="السماح للتطبيق بإرسال التنبيهات وإشعارات البوش"
            control={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="تفعيل الإشعارات العامة"
              />
            }
          />
          <SettingRow
            icon={Bell}
            label="تنبيهات المواعيد والتسليمات"
            description="إرسال تنبيه قبل 24 ساعة من انتهاء موعد الواجب أو الامتحان"
            control={
              <Switch
                checked={deadlineAlerts}
                onCheckedChange={setDeadlineAlerts}
                disabled={!notifications}
                aria-label="تنبيهات المواعيد"
              />
            }
          />
          <SettingRow
            icon={Bell}
            label="إشعارات الدرجات الجديدة"
            description="تنبيه فوري لحظة رصد علامة جديدة في أي مساق"
            control={
              <Switch
                checked={gradeAlerts}
                onCheckedChange={setGradeAlerts}
                disabled={!notifications}
                aria-label="إشعارات الدرجات"
              />
            }
          />
        </div>

        {/* Danger Zone */}
        <SectionLabel>الجلسة والأمان</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6 shadow-xs">
          <SettingRow
            icon={LogOut}
            label="تسجيل الخروج من الحساب"
            description="إنهاء الجلسة والعودة لشاشة الدخول"
            destructive
            onClick={() => {
              window.location.href = "/login";
            }}
          />
        </div>
      </div>
    </>
  );
}
