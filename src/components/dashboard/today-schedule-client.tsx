"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { formatTime, cn } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users, Clock, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateInstructor, translateRoom } from "@/lib/translations/academic";
import type { TodayClass } from "@/lib/types";

const iconMap: Record<TodayClass["type"], typeof BookOpen> = {
  lecture: BookOpen,
  lab: FlaskConical,
  tutorial: Users,
};

interface TodayScheduleClientProps {
  todayClasses: TodayClass[];
  studentId?: string;
}

export function TodayScheduleClient({ todayClasses, studentId }: TodayScheduleClientProps) {
  const { t, isRtl, language } = useLanguage();
  const [calendarHref, setCalendarHref] = useState<string>("");

  useEffect(() => {
    if (studentId) {
      const absoluteUrl = "https://" + window.location.host + "/api/calendar/" + studentId;
      const ua = navigator.userAgent.toLowerCase();
      
      if (ua.includes("android")) {
        setCalendarHref("intent://calendar.google.com/calendar/render?cid=" + encodeURIComponent(absoluteUrl) + "#Intent;scheme=https;package=com.google.android.calendar;end");
      } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
        setCalendarHref("webcal://" + window.location.host + "/api/calendar/" + studentId);
      } else {
        setCalendarHref("https://calendar.google.com/calendar/render?cid=" + encodeURIComponent(absoluteUrl));
      }
    }
  }, [studentId]);

  const hasClasses = todayClasses.length > 0;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#0a72ef] text-white p-2 rounded-lg text-foreground shadow-md">
             <CalendarDays className="h-4 w-4 fill-white/20" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold text-foreground">{t.dashboard.todayClasses}</h2>
          <span className="text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border hidden sm:inline-block font-semibold">
            {t.dashboard.timeZoneNotice}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {studentId && calendarHref && (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-bold text-foreground bg-muted hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-border"
              title="مزامنة الجدول الدراسي مع التقويم الخاص بك"
            >
              <span>مزامنة التقويم</span>
            </a>
          )}
          <span className="text-xs text-foreground font-bold bg-[#0a72ef] text-white px-3 py-1 rounded-full shadow-md">
            {todayClasses.length} {todayClasses.length === 1 ? t.dashboard.singleClass : t.dashboard.classesCount}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-border bg-card text-center transition-colors">
          <div className="h-14 w-14 rounded-lg bg-[#0a72ef] text-white flex items-center justify-center mb-4 text-foreground shadow-lg">
            <CalendarDays className="h-6 w-6 fill-white/20" strokeWidth={2} />
          </div>
          <p className="text-base font-bold text-foreground">{t.dashboard.noClassesToday}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-5 font-medium">
            {t.dashboard.noClassesDesc}
          </p>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center justify-center gap-2 px-6 rounded-lg bg-[#0a72ef] text-white text-foreground text-xs font-bold hover:bg-[#0070f3] active:scale-[0.98] transition-all shadow-md"
          >
            <span>{t.dashboard.browseCourses}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {todayClasses.map((cls, idx) => {
            const TypeIcon = iconMap[cls.type] || BookOpen;
            const typeLabel = t.dashboard.classTypes[cls.type] || t.dashboard.classTypes.lecture;
            const isOngoing = cls.status === "ongoing";
            const displayName = translateCourseName(cls.courseCode, cls.courseNameAr, cls.courseNameEn, language);
            const instructorName = translateInstructor(cls.instructor, language);

            return (
              <Link
                key={idx}
                href={"/courses/" + cls.courseId}
                className={cn(
                  "flex items-start gap-4 rounded-lg border bg-card p-4 min-h-[56px] transition-all duration-300 ease-out group relative overflow-hidden",
                  isOngoing
                    ? "border-[#0070f3]/50 shadow-[0_0_20px_rgba(5,150,105,0.15)] hover:border-[#0070f3]"
                    : "border-border hover:border-border/50 active:scale-[0.98] hover:bg-white/[0.02]"
                )}
              >
                {/* Visual Indicator Background Glow (Fintech subtle touch) */}
                {isOngoing && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a72ef]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight text-foreground truncate transition-colors">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                        {cls.courseCode} · {instructorName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1.5 text-foreground font-bold tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span className="text-sm">{formatTime(cls.startTime)}</span>
                      </div>
                      {isOngoing ? (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-foreground bg-[#0070f3] px-2.5 py-0.5 rounded-full shadow-md">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                          </span>
                          الآن
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground/60 mt-1 tabular-nums font-semibold">
                          {formatTime(cls.endTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 text-[10px] h-6 px-2.5 rounded-md bg-secondary text-muted-foreground/90 font-bold">
                      <TypeIcon className="h-3 w-3" />
                      {typeLabel}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[120px] sm:max-w-[180px]">
                        {translateRoom(cls.room, language)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}