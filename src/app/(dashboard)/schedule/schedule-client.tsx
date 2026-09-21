"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  FlaskConical,
  Users,
  Video,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  CalendarCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateInstructor, translateRoom } from "@/lib/translations/academic";
import { getTodayDayInAmman } from "@/lib/timezone";

// Official Microsoft Teams Color & Icon
function TeamsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 7.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm-1 3.5h-2c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h2c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5zM12 4a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm-1.5 5h-3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM21 9h-2v-.5c0-.8-.7-1.5-1.5-1.5h-.5c.7-.6 1-1.5 1-2.5 0-1.9-1.6-3.5-3.5-3.5h-1c-.3 0-.5.2-.5.5v13c0 .3.2.5.5.5h1c1.9 0 3.5-1.6 3.5-3.5 0-1-.3-1.9-1-2.5h.5c.8 0 1.5-.7 1.5-1.5V9.5c0-.3.2-.5.5-.5z" />
    </svg>
  );
}

interface MergedItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn?: string;
  instructor: string;
  room: string;
  day: "sun" | "mon" | "tue" | "wed" | "thu";
  startTime: string;
  endTime: string;
  type: "lecture" | "lab" | "tutorial";
  color: string;
  hasTeamsMeeting: boolean;
  teamsJoinUrl?: string;
  teamsSubject?: string;
  isCancelled: boolean;
  isRescheduled: boolean;
  originalTime?: string;
  teamsLocation?: string;
}

const dayLabelsAr: Record<string, string> = {
  all: "كافة الأيام",
  sun: "الأحد",
  mon: "الإثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
};

const dayLabelsEn: Record<string, string> = {
  all: "All Days",
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
};

function formatTime12(time24: string, isAr: boolean): string {
  if (!time24 || !time24.includes(":")) return time24;
  const [hStr, mStr] = time24.split(":");
  const hNum = parseInt(hStr, 10);
  const period = isAr ? (hNum >= 12 ? "م" : "ص") : (hNum >= 12 ? "PM" : "AM");
  const h12 = hNum > 12 ? hNum - 12 : hNum === 0 ? 12 : hNum;
  return `${h12}:${mStr} ${period}`;
}

export function ScheduleClient() {
  const { language, isRtl } = useLanguage();
  const isAr = language === "ar";
  const searchParams = useSearchParams();

  const [items, setItems] = useState<MergedItem[]>([]);
  const [teamsConnected, setTeamsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("all");
  const [showConnectedToast, setShowConnectedToast] = useState(false);

  const todayDay = getTodayDayInAmman();

  useEffect(() => {
    if (searchParams.get("teams_connected") === "true") {
      setShowConnectedToast(true);
      setTimeout(() => setShowConnectedToast(false), 5000);
    }
  }, [searchParams]);

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/schedule/merged", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTeamsConnected(Boolean(data.teamsConnected));
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAauQuickConnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/student/teams/connect-aau", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTeamsConnected(true);
        setShowConnectedToast(true);
        setTimeout(() => setShowConnectedToast(false), 5000);
        await loadSchedule();
      }
    } catch (err) {
      console.error("Failed to connect AAU Teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeDay === "all") return true;
    return item.day === activeDay;
  });

  const daysList = ["all", "sun", "mon", "tue", "wed", "thu"];

  return (
    <div className="space-y-6">
      {/* Toast message after connecting */}
      {showConnectedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-semibold">
              {isAr ? "تم ربط تقويم Microsoft Teams بنجاح! يتم الآن تحديث المواعيد وروابط الاجتماعات." : "Microsoft Teams connected successfully! Lecture links and schedules are now synced."}
            </p>
          </div>
          <button
            onClick={() => setShowConnectedToast(false)}
            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 dark:border-white/[0.08] bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.01] p-6 backdrop-blur-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2F7BFF]/10 text-[#2F7BFF] dark:text-[#38BDF8] border border-[#2F7BFF]/20 mb-2">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{isAr ? "الفصل الدراسي الثاني 2025/2026" : "Second Semester 2025/2026"}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {isAr ? "الجدول الدراسي والمحاضرات" : "Academic Schedule"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              {isAr
                ? "مواعيد المحاضرات الأسبوعية المدمجة مع تقويم Teams وتحديثات القاعات والروابط المباشرة"
                : "Weekly lecture schedule synchronized with Microsoft Teams calendar & direct links"}
            </p>
          </div>

          {/* Quick Refresh & Teams Badge */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {teamsConnected ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#505AC9]/15 text-[#505AC9] dark:text-[#7B83EB] border border-[#505AC9]/30 text-xs font-bold shadow-sm">
                <TeamsIcon className="h-4 w-4" />
                <span>{isAr ? "Teams متصل ومُزامن" : "Teams Synced"}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <button
                onClick={handleAauQuickConnect}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#505AC9] to-[#6264A7] hover:opacity-95 text-white text-xs font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                <TeamsIcon className="h-4 w-4" />
                <span>{isAr ? "ربط تقويم Teams" : "Connect Teams"}</span>
              </button>
            )}

            <button
              onClick={loadSchedule}
              disabled={isLoading}
              title={isAr ? "تحديث المواعيد" : "Refresh"}
              className="p-2 rounded-xl border border-border/80 dark:border-white/[0.08] hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all active:scale-95"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#2F7BFF]")} />
            </button>
          </div>
        </div>

        {/* Informative Banner when NOT connected */}
        {!teamsConnected && (
          <div className="mt-5 pt-4 border-t border-border/60 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 dark:bg-white/[0.02] -mx-6 -mb-6 px-6 py-3.5 rounded-b-3xl">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
              <div className="h-6 w-6 rounded-lg bg-[#505AC9]/15 text-[#505AC9] dark:text-[#7B83EB] flex items-center justify-center flex-shrink-0">
                <TeamsIcon className="h-3.5 w-3.5" />
              </div>
              <span>
                {isAr
                  ? "اربط حساب Microsoft Teams لتلقي تغييرات المواعيد، الإلغاءات، وروابط الاجتماعات المباشرة تلقائياً."
                  : "Connect Microsoft Teams to receive live schedule changes, cancellations, and meeting links."}
              </span>
            </div>
            <button
              onClick={handleAauQuickConnect}
              disabled={isLoading}
              className="text-xs font-bold text-[#505AC9] dark:text-[#7B83EB] hover:underline flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
            >
              <span>{isAr ? "تفعيل التكامل الآن" : "Enable Integration"}</span>
              <ChevronRight className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} />
            </button>
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {daysList.map((dayKey) => {
          const isActive = activeDay === dayKey;
          const isToday = dayKey === todayDay;
          const label = isAr ? dayLabelsAr[dayKey] : dayLabelsEn[dayKey];

          return (
            <button
              key={dayKey}
              onClick={() => setActiveDay(dayKey)}
              className={cn(
                "px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border shadow-sm",
                isActive
                  ? "bg-gradient-to-r from-[#2F7BFF] to-[#8B5CF6] text-white border-transparent shadow-md scale-105"
                  : "bg-card/80 dark:bg-white/[0.04] border-border/80 dark:border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <span>{label}</span>
              {isToday && (
                <span className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded-full font-mono font-black",
                  isActive ? "bg-white/20 text-white" : "bg-[#2F7BFF]/15 text-[#2F7BFF] dark:text-[#38BDF8]"
                )}>
                  {isAr ? "اليوم" : "Today"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-[#2F7BFF]" />
          <p className="text-xs font-medium">{isAr ? "جاري مزامنة الجدول ومواعيد Teams..." : "Syncing schedule and Teams..."}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl border border-dashed border-border/80 dark:border-white/[0.08] bg-card/50">
          <CalendarCheck className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-sm font-bold text-foreground">
            {isAr ? "لا توجد محاضرات مجدولة لهذا اليوم" : "No lectures scheduled for this day"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "استغل هذا الوقت للمراجعة أو التحضير للمشاريع" : "Use this time for self-study and assignments"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            const isLecture = item.type === "lecture";
            const isLab = item.type === "lab";
            const TypeIcon = isLab ? FlaskConical : isLecture ? BookOpen : Users;
            const displayName = translateCourseName(item.courseCode, item.courseNameAr, item.courseNameEn, language);
            const instructorName = translateInstructor(item.instructor, language);

            return (
              <div
                key={item.id}
                className={cn(
                  "relative rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 shadow-sm dark:shadow-xl overflow-hidden group",
                  item.isCancelled
                    ? "border-red-500/40 bg-red-500/[0.03] dark:bg-red-500/[0.02]"
                    : item.isRescheduled
                    ? "border-amber-500/40 bg-amber-500/[0.03] dark:bg-amber-500/[0.02]"
                    : "border-border/80 dark:border-white/[0.08] bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.01] hover:border-[#2F7BFF]/40"
                )}
              >
                {/* Visual side color bar */}
                <div
                  className="absolute top-0 bottom-0 right-0 w-1.5 rounded-r-3xl"
                  style={{ backgroundColor: item.isCancelled ? "#ef4444" : item.isRescheduled ? "#f59e0b" : item.color || "#2F7BFF" }}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Course Details */}
                  <div className="space-y-2 flex-1 min-w-0 pr-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-secondary text-foreground">
                        {item.courseCode}
                      </span>

                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground flex items-center gap-1">
                        <TypeIcon className="h-3 w-3 text-[#2F7BFF]" />
                        <span>{isLab ? (isAr ? "مختبر" : "Lab") : (isAr ? "محاضرة نظرية" : "Lecture")}</span>
                      </span>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                        {isAr ? dayLabelsAr[item.day] : dayLabelsEn[item.day]}
                      </span>

                      {/* Teams Badges */}
                      {item.hasTeamsMeeting && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#505AC9]/15 text-[#505AC9] dark:text-[#8E97FD] border border-[#505AC9]/30">
                          <TeamsIcon className="h-3.5 w-3.5" />
                          <span>{isAr ? "محاضرة Teams" : "Teams Meeting"}</span>
                        </span>
                      )}

                      {item.isRescheduled && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{isAr ? "تعديل في الموعد" : "Rescheduled"}</span>
                        </span>
                      )}

                      {item.isCancelled && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{isAr ? "محاضرة ملغاة" : "Cancelled"}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-foreground leading-snug">
                      <Link href={`/courses/${item.courseId}`} className="hover:text-[#2F7BFF] transition-colors">
                        {displayName}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                      <span className="font-medium">{instructorName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{translateRoom(item.room, language)}</span>
                      </span>
                    </div>

                    {/* Reschedule notification detail */}
                    {item.isRescheduled && item.originalTime && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {isAr
                          ? `* الموعد المعتاد كان (${item.originalTime})، تم تحديثه في تقويم Teams إلى الوقت الحالي.`
                          : `* Regular time was (${item.originalTime}), updated in Teams calendar to current time.`}
                      </p>
                    )}

                    {/* Cancellation message */}
                    {item.isCancelled && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {isAr
                          ? "⚠️ تم إلغاء هذه المحاضرة في تقويم Teams لهذا الأسبوع."
                          : "⚠️ This session is marked cancelled in Teams calendar for this week."}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Time & Direct Join Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/60">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-foreground font-black text-sm tabular-nums">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime12(item.startTime, isAr)} - {formatTime12(item.endTime, isAr)}</span>
                      </div>
                    </div>

                    {/* Direct Teams Action Button */}
                    {item.hasTeamsMeeting && item.teamsJoinUrl && !item.isCancelled ? (
                      <a
                        href={item.teamsJoinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#505AC9] to-[#6264A7] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#505AC9]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>{isAr ? "انضم للاجتماع" : "Join Meeting"}</span>
                        <ExternalLink className="h-3 w-3 opacity-80" />
                      </a>
                    ) : item.isCancelled ? (
                      <span className="text-xs text-muted-foreground font-bold px-3 py-1.5 rounded-xl bg-muted/60">
                        {isAr ? "غير متاحة" : "Unavailable"}
                      </span>
                    ) : (
                      <Link
                        href={`/courses/${item.courseId}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border/80 dark:border-white/[0.08] hover:bg-secondary/80 text-foreground text-xs font-bold transition-all"
                      >
                        <span>{isAr ? "صفحة المادة" : "Course Page"}</span>
                        <ArrowRight className={cn("h-3 w-3", isRtl && "rotate-180")} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
