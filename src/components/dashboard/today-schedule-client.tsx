"use client";

import Link from "next/link";
import { formatTime, cn } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users, Clock, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import type { TodayClass } from "@/lib/types";

const iconMap: Record<TodayClass["type"], typeof BookOpen> = {
  lecture: BookOpen,
  lab: FlaskConical,
  tutorial: Users,
};

interface TodayScheduleClientProps {
  todayClasses: TodayClass[];
}

export function TodayScheduleClient({ todayClasses }: TodayScheduleClientProps) {
  const { t, isRtl, language } = useLanguage();
  const hasClasses = todayClasses.length > 0;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{t.dashboard.todayClasses}</h2>
          <span className="text-[11px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border">
            {t.dashboard.timeZoneNotice}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {todayClasses.length} {todayClasses.length === 1 ? t.dashboard.singleClass : t.dashboard.classesCount}
        </span>
      </div>

      {/* Empty State with Actionable Link */}
      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">{t.dashboard.noClassesToday}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
            {t.dashboard.noClassesDesc}
          </p>
          <Link
            href="/courses"
            className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 px-4 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 active:scale-[0.98] transition-all"
          >
            <span>{t.dashboard.browseCourses}</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {todayClasses.map((cls, idx) => {
            const TypeIcon = iconMap[cls.type] || BookOpen;
            const typeLabel = t.dashboard.classTypes[cls.type] || t.dashboard.classTypes.lecture;
            const isOngoing = cls.status === "ongoing";
            const displayName = language === "en" && cls.courseNameEn ? cls.courseNameEn : cls.courseNameAr;

            return (
              <Link
                key={idx}
                href={`/courses/${cls.courseId}`}
                className={cn(
                  "flex items-start gap-3 rounded-xl border bg-card p-3.5 min-h-[56px] transition-all duration-150 ease-out group",
                  isOngoing
                    ? "border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/[0.04] shadow-sm hover:border-emerald-500"
                    : "border-border hover:border-foreground/20 hover:bg-secondary/40",
                  cls.status === "done" && "opacity-60 bg-muted/20"
                )}
              >
                {/* Color strip */}
                <div
                  className="mt-0.5 h-10 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cls.color || "#8B5CF6" }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight text-foreground truncate group-hover:text-primary transition-colors">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cls.courseCode} · {cls.instructor}
                      </p>
                    </div>

                    <div className={cn("flex-shrink-0", isRtl ? "text-left" : "text-right")}>
                      <p className="text-xs font-semibold tabular-nums text-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatTime(cls.startTime)}
                      </p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {t.dashboard.until} {formatTime(cls.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{cls.room}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TypeIcon className="h-3 w-3" />
                      <span>{typeLabel}</span>
                    </div>

                    {/* Class Status Badges */}
                    {isOngoing && (
                      <Badge variant="success" className="gap-1 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {t.dashboard.classStatus.ongoing}
                      </Badge>
                    )}
                    {cls.status === "upcoming" && (
                      <Badge variant="secondary">
                        {t.dashboard.classStatus.upcoming}
                      </Badge>
                    )}
                    {cls.status === "done" && (
                      <Badge variant="neutral">
                        {t.dashboard.classStatus.done}
                      </Badge>
                    )}
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
