"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Bell,
  Moon,
  Globe,
  Calendar,
  BookOpen,
  ChevronLeft,
  LogOut,
  LucideIcon,
  CheckCircle2,
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
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        destructive ? "bg-destructive/10" : "bg-secondary"
      }`}>
        <Icon className={`h-4 w-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 text-start">
        <p className={`text-sm ${destructive ? "text-destructive" : "text-foreground font-medium"}`}>{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
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
      <div className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-start ${
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
    <p className="px-4 pt-5 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // States
  const [notifications, setNotifications] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [moodleConnected, setMoodleConnected] = useState(true);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(true);
  const [appleCalendarConnected, setAppleCalendarConnected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <>
      <PageHeader title="الإعدادات" />
      <div className="max-w-2xl mx-auto lg:max-w-none">
        {/* Account */}
        <SectionLabel>الحساب</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mx-4">
          <SettingRow
            icon={BookOpen}
            label="حساب موودل"
            description={moodleConnected ? "متصل — الجامعة الأردنية" : "غير متصل"}
            control={
              <Switch
                checked={moodleConnected}
                onCheckedChange={setMoodleConnected}
                aria-label="تفعيل ربط موودل"
              />
            }
          />
        </div>

        {/* Appearance */}
        <SectionLabel>المظهر</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mx-4 divide-y divide-border">
          <SettingRow
            icon={Moon}
            label="الوضع الليلي"
            description={!mounted ? "تحميل..." : isDark ? "مفعّل" : "معطّل"}
            control={
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="تبديل الوضع الليلي"
                disabled={!mounted}
              />
            }
          />
          <SettingRow
            icon={Globe}
            label="لغة الواجهة"
            description="العربية (الافتراضية)"
            onClick={() => {}}
          />
        </div>

        {/* Integrations */}
        <SectionLabel>التكاملات</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mx-4 divide-y divide-border">
          <SettingRow
            icon={Calendar}
            label="Google Calendar"
            description={googleCalendarConnected ? "مزامنة الجدول والمواعيد تلقائياً" : "غير مرتبط بالتقويم"}
            control={
              googleCalendarConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    متصل
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setGoogleCalendarConnected(false)}
                  >
                    فك الارتباط
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => setGoogleCalendarConnected(true)}
                >
                  ربط الآن
                </Button>
              )
            }
          />
          <SettingRow
            icon={Calendar}
            label="Apple Calendar"
            description={appleCalendarConnected ? "مزامنة الجدول مع تقويم Apple" : "غير مرتبط بالتقويم"}
            control={
              appleCalendarConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    متصل
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setAppleCalendarConnected(false)}
                  >
                    فك الارتباط
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => setAppleCalendarConnected(true)}
                >
                  ربط الآن
                </Button>
              )
            }
          />
        </div>

        {/* Notifications */}
        <SectionLabel>الإشعارات</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mx-4 divide-y divide-border">
          <SettingRow
            icon={Bell}
            label="الإشعارات العامة"
            description="تفعيل أو إيقاف كل الإشعارات"
            control={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="تفعيل الإشعارات"
              />
            }
          />
          <SettingRow
            icon={Bell}
            label="تنبيهات المواعيد"
            description="إشعار قبل 24 ساعة من موعد التسليم"
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
            label="إشعارات الدرجات"
            description="تنبيه فوري عند رصد أي درجة جديدة"
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

        {/* Danger zone */}
        <SectionLabel>الحساب والجلسة</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mx-4 mb-6">
          <SettingRow
            icon={LogOut}
            label="تسجيل الخروج"
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
