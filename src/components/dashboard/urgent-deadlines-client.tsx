"use client";

import Link from "next/link";
import { getDeadlineStatus, getRelativeTime, cn } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowLeft, ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateAssignmentTitle } from "@/lib/translations/academic";
import type { Assignment } from "@/lib/types";

export interface DeadlineItem extends Assignment {
  courseNameAr: string;
  courseNameEn?: string;
  courseId: string;
  courseColor: string;
}

interface UrgentDeadlinesClientProps {
  upcoming: DeadlineItem[];
  urgentCount: number;
}

export function UrgentDeadlinesClient({ upcoming, urgentCount }: UrgentDeadlinesClientProps) {
  const { t, isRtl, language } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-progress-bg p-1.5 rounded-lg text-progress-fg">
             <AlertTriangle className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            {t.dashboard.urgentDeadlines}
          </h2>
          {urgentCount > 0 && (
            <Badge variant="urgent" className="gap-1 animate-pulse">
              <span>{urgentCount} {t.dashboard.urgentBadge}</span>
            </Badge>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1.5 text-xs font-semibold text-progress-fg bg-progress-bg hover:bg-progress-border px-3 py-1.5 rounded-full transition-colors"
        >
          <span>{t.dashboard.allCourses}</span>
          <ArrowIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-progress-border bg-progress-bg/10 text-center transition-colors">
          <div className="h-12 w-12 rounded-full bg-progress-bg text-progress-fg flex items-center justify-center mb-3 shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-base font-medium text-foreground">{t.dashboard.noDeadlines}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {t.dashboard.allCaughtUp}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((assignment) => {
            const status = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
            const relTime = getRelativeTime(assignment.dueDate, assignment.dueTime, language === "en" ? "en" : "ar");
            const courseDisplayName = translateCourseName(undefined, assignment.courseNameAr, assignment.courseNameEn, language);
            const assignmentTitle = translateAssignmentTitle(assignment.title, language);
            const assignmentTypeLabel = t.dashboard.assignmentTypes[assignment.type] || assignment.type;

            return (
              <Link
                key={assignment.id}
                href={"/courses/" + assignment.courseId}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-card p-4 min-h-[56px]",
                  "transition-all duration-300 ease-out shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                  "hover:border-progress-fg/30 hover:bg-progress-bg/10 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] group"
                )}
              >
                {/* Course color indicator */}
                <div
                  className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: assignment.courseColor || "currentColor" }}
                />

                {/* Assignment Title & Course Info (Truncated safely) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-progress-fg transition-colors">
                      {assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {courseDisplayName} · {assignmentTypeLabel}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className={cn("flex-shrink-0 flex flex-col gap-1.5", isRtl ? "text-left items-end" : "text-right items-end")}>
                  {status === "urgent" ? (
                    <Badge variant="urgent" className="gap-1 font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.urgentBadge}: {relTime}</span>
                    </Badge>
                  ) : status === "soon" ? (
                    <Badge variant="warning" className="gap-1 font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.soonBadge}: {relTime}</span>
                    </Badge>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <Calendar className="h-3 w-3" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                      {t.dashboard.atHour} {assignment.dueTime}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}