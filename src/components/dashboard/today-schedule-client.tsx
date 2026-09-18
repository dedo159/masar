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

export function TodayScheduleClient({ todayClasses }: TodayScheduleClientProps) {
  const { t, isRtl, language } = useLanguage();

  const hasClasses = todayClasses.length > 0;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30 p-2 rounded-xl shadow-sm">
             <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">{t.dashboard.todayClasses}</h2>
          <span className="text-[10px] text-white/50 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08] hidden sm:inline-block font-mono">
            {t.dashboard.timeZoneNotice}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-gradient-to-r from-[#2F7BFF] to-[#8B5CF6] text-white px-3 py-1 rounded-full shadow-md">
            {todayClasses.length} {todayClasses.length === 1 ? t.dashboard.singleClass : t.dashboard.classesCount}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl text-center shadow-xl">
          <div className="h-12 w-12 rounded-xl bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30 flex items-center justify-center mb-3 shadow-md">
            <CalendarDays className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="text-sm font-bold text-white">
            {language === "en" ? "Semester Ended · No Classes Today 🎉" : "انتهى الفصل الدراسي · لا توجد محاضرات اليوم 🎉"}
          </p>
          <p className="text-xs text-white/50 mt-1 max-w-sm mb-4 font-medium leading-relaxed">
            {language === "en"
              ? "All courses for this semester have concluded. Best wishes on your final exams and break!"
              : "انتهت كافة محاضرات هذا الفصل الدراسي. نتمنى لك التوفيق في الامتحانات النهائية وإجازة سعيدة!"}
          </p>
          <Link
            href="/courses"
            className="inline-flex h-9 items-center justify-center gap-2 px-5 rounded-xl bg-gradient-to-r from-[#2F7BFF] to-[#8B5CF6] text-white text-xs font-semibold hover:opacity-95 active:scale-[0.98] transition-all shadow-md"
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
                  "flex items-start gap-4 rounded-2xl border bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.01] p-4 min-h-[56px] backdrop-blur-xl shadow-sm dark:shadow-xl transition-all duration-300 ease-out group relative overflow-hidden",
                  isOngoing
                    ? "border-[#2F7BFF]/60 shadow-[0_0_25px_rgba(47,123,255,0.25)]"
                    : "border-border/80 dark:border-white/[0.08] hover:border-[#2F7BFF]/40 active:scale-[0.99]"
                )}
              >
                {/* Subtle Glow for Ongoing */}
                {isOngoing && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F7BFF]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight text-foreground truncate group-hover:text-[#2F7BFF] dark:group-hover:text-[#38BDF8] transition-colors">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                        {cls.courseCode} • {instructorName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1.5 text-foreground font-bold tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{formatTime(cls.startTime)}</span>
                      </div>
                      {isOngoing ? (
                        <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#2F7BFF] to-[#E83D84] px-2.5 py-0.5 rounded-full shadow-md">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                          </span>
                          <span>{language === "en" ? "Live Now" : "جارية الآن"}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-1 tabular-nums font-mono font-semibold">
                          {formatTime(cls.endTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3.5 pt-2 border-t border-border/60 dark:border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-[10px] h-6 px-2.5 rounded-lg bg-muted/70 dark:bg-white/[0.06] text-foreground/80 dark:text-white/80 font-bold border border-border/60 dark:border-white/[0.06]">
                      <TypeIcon className="h-3 w-3 text-[#2F7BFF] dark:text-[#38BDF8]" />
                      <span>{typeLabel}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">
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
