"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { formatTime, cn } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users, Clock, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <div className="flex items-center gap-2.5">
          <div className="bg-academic-bg p-1.5 rounded-lg text-academic-fg">
             <CalendarDays className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">{t.dashboard.todayClasses}</h2>
          <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border hidden sm:inline-block">
            {t.dashboard.timeZoneNotice}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {studentId && calendarHref && (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium text-academic-fg bg-academic-bg hover:bg-academic-border px-3 py-1.5 rounded-full transition-colors"
              title="مزامنة الجدول الدراسي مع التقويم الخاص بك"
            >
              <span>مزامنة التقويم</span>
            </a>
          )}
          <span className="text-xs text-academic-fg font-medium bg-academic-bg/50 px-2.5 py-1 rounded-full">
            {todayClasses.length} {todayClasses.length === 1 ? t.dashboard.singleClass : t.dashboard.classesCount}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-academic-border bg-academic-bg/10 text-center transition-colors">
          <div className="h-12 w-12 rounded-full bg-academic-bg flex items-center justify-center mb-3 text-academic-fg shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="text-base font-medium text-foreground">{t.dashboard.noClassesToday}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-5">
            {t.dashboard.noClassesDesc}
          </p>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center justify-center gap-2 px-5 rounded-xl bg-academic-bg text-academic-fg text-xs font-semibold hover:bg-academic-border active:scale-[0.98] transition-all"
          >
            <span>{t.dashboard.browseCourses}</span>
            <ArrowIcon className="h-3.5 w-3.5" />
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
                  "flex items-start gap-4 rounded-2xl border bg-card p-4 min-h-[56px] transition-all duration-300 ease-out group",
                  isOngoing
                    ? "border-progress-fg/50 dark:border-progress-fg/40 bg-progress-bg/20 shadow-sm hover:border-progress-fg"
                    : "border-border hover:border-academic-fg/30 hover:bg-academic-bg/10 active:scale-[0.98] hover:shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                  cls.status === "done" && "opacity-60 bg-muted/10"
                )}
              >
                {/* Visual Indicator */}
                <div
                  className="mt-1 h-10 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cls.color || "#3b82f6" }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-foreground truncate group-hover:text-academic-fg transition-colors">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {cls.courseCode} · {instructorName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1.5 text-foreground font-semibold tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{formatTime(cls.startTime)}</span>
                      </div>
                      {isOngoing ? (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-progress-fg bg-progress-bg px-2 py-0.5 rounded-full">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-progress-fg opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-progress-fg"></span>
                          </span>
                          الآن
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-1 tabular-nums font-medium">
                          {formatTime(cls.endTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="secondary" className="font-medium text-[10px] h-6 px-2.5 rounded-md gap-1.5 border-transparent bg-academic-bg text-academic-fg">
                      <TypeIcon className="h-3 w-3" />
                      {typeLabel}
                    </Badge>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
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