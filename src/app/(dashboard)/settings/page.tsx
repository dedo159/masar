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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";

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
  const { t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // States
  const [notifications, setNotifications] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [studentName, setStudentName] = useState<string>(t.settings.defaultStudentName);
  const [studentMeta, setStudentMeta] = useState<string>(t.settings.defaultStudentMeta);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("masar_user_name");
      const storedMajor = localStorage.getItem("masar_user_major");
      if (storedName) setStudentName(storedName);
      if (storedMajor) setStudentMeta(storedMajor);
    }
  }, [t]);

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

  return (
    <>
      <PageHeader
        title={t.settings.title}
        subtitle={t.settings.subtitle}
      />

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-2">
        {/* Account & Profile Summary */}
        <SectionLabel>{t.settings.accountSection}</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
          <Link
            href="/profile"
            className="flex items-center justify-between p-4 min-h-[64px] hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                {studentName[0] || (isRtl ? "أ" : "S")}
              </div>
              <div className="text-start">
                <p className="text-sm font-semibold text-foreground">{studentName}</p>
                <p className="text-xs text-muted-foreground">{studentMeta}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <span>{t.settings.editProfile}</span>
              <Chevron className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Moodle Sync Integration */}
        <SectionLabel>{t.settings.moodleSection}</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
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
              className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer"
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
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 space-y-3 shadow-xs">
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
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
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
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
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
              className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
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
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
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
                    className="min-h-[36px] text-xs px-3"
                    onClick={() => setGoogleCalendarConnected(false)}
                  >
                    {t.settings.unlinkBtn}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[36px] text-xs px-4"
                  onClick={() => setGoogleCalendarConnected(true)}
                >
                  {t.settings.linkBtn}
                </Button>
              )
            }
          />
        </div>

        {/* Notifications */}
        <SectionLabel>{t.settings.notificationsSection}</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-xs">
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

        {/* Danger Zone */}
        <SectionLabel>{t.settings.securitySection}</SectionLabel>
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6 shadow-xs">
          <SettingRow
            icon={LogOut}
            label={t.settings.logoutTitle}
            description={t.settings.logoutDesc}
            chevron={Chevron}
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

