"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  FlaskConical,
  Users,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateInstructor, translateRoom } from "@/lib/translations/academic";
import { getTodayDayInAmman } from "@/lib/timezone";

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

  const [items, setItems] = useState<MergedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("all");

  const todayDay = getTodayDayInAmman();

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/schedule/merged", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
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
                ? "مواعيد المحاضرات الأسبوعية والقاعات والمدرسين المستوردة من خطتك الدراسية"
                : "Weekly lecture schedule, rooms, and instructors from your academic plan"}
            </p>
          </div>

          {/* Quick Refresh */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={loadSchedule}
              disabled={isLoading}
              title={isAr ? "تحديث المواعيد" : "Refresh"}
              className="p-2.5 rounded-xl border border-border/80 dark:border-white/[0.08] hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all active:scale-95"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#2F7BFF]")} />
            </button>
          </div>
        </div>
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
                "relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap shadow-sm select-none",
                isActive
                  ? "bg-gradient-to-r from-[#2F7BFF] to-[#8B5CF6] text-white shadow-[#2F7BFF]/20"
                  : "border border-border/80 dark:border-white/[0.08] bg-card/80 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span>{label}</span>
              {isToday && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-semibold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#2F7BFF]/15 text-[#2F7BFF] dark:text-[#38BDF8]"
                  )}
                >
                  {isAr ? "اليوم" : "Today"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-3xl border border-border/40 bg-card/40 animate-pulse"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-border/80 dark:border-white/[0.08] bg-card/60 backdrop-blur-xl text-center">
          <div className="h-14 w-14 rounded-2xl bg-[#2F7BFF]/10 text-[#2F7BFF] dark:text-[#38BDF8] flex items-center justify-center mb-4 shadow-sm">
            <CalendarDays className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isAr ? "لا توجد محاضرات في هذا اليوم" : "No lectures scheduled for this day"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm font-medium">
            {isAr
              ? "استغل هذا اليوم للمراجعة أو إنجاز الواجبات والمشاريع المطلوبة."
              : "Use this day to review courses or work on required assignments."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const isLab = item.type === "lab";
            const isLecture = item.type === "lecture";
            const TypeIcon = isLab ? FlaskConical : isLecture ? BookOpen : Users;
            const displayName = translateCourseName(item.courseCode, item.courseNameAr, item.courseNameEn, language);
            const instructorName = translateInstructor(item.instructor, language);

            return (
              <div
                key={item.id}
                className="relative rounded-3xl border border-border/80 dark:border-white/[0.08] bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.01] hover:border-[#2F7BFF]/40 p-5 backdrop-blur-xl transition-all duration-300 shadow-sm dark:shadow-xl overflow-hidden group"
              >
                {/* Visual side color bar */}
                <div
                  className="absolute top-0 bottom-0 right-0 w-1.5 rounded-r-3xl"
                  style={{ backgroundColor: item.color || "#2F7BFF" }}
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
                  </div>

                  {/* Right Column: Time & Course Page Link */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/60">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-foreground font-black text-sm tabular-nums">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime12(item.startTime, isAr)} - {formatTime12(item.endTime, isAr)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${item.courseId}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border/80 dark:border-white/[0.08] hover:bg-secondary/80 text-foreground text-xs font-bold transition-all"
                    >
                      <span>{isAr ? "صفحة المادة" : "Course Page"}</span>
                      <ArrowRight className={cn("h-3 w-3", isRtl && "rotate-180")} />
                    </Link>
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
