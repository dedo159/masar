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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            {t.dashboard.urgentDeadlines}
          </h2>
          {urgentCount > 0 && (
            <Badge variant="urgent" className="gap-1 animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              <span>{urgentCount} {t.dashboard.urgentBadge}</span>
            </Badge>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <span>{t.dashboard.allCourses}</span>
          <ArrowIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">{t.dashboard.noDeadlines}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {t.dashboard.allCaughtUp}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((assignment) => {
            const status = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
            const relTime = getRelativeTime(assignment.dueDate, assignment.dueTime, language === "en" ? "en" : "ar");
            const courseDisplayName = translateCourseName(undefined, assignment.courseNameAr, assignment.courseNameEn, language);
            const assignmentTitle = translateAssignmentTitle(assignment.title, language);
            const assignmentTypeLabel = t.dashboard.assignmentTypes[assignment.type] || assignment.type;

            return (
              <Link
                key={assignment.id}
                href={`/courses/${assignment.courseId}`}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 min-h-[52px]",
                  "hover:border-foreground/20 hover:bg-secondary/40 hover:-translate-y-0.5 shadow-xs",
                  "transition-all duration-150 ease-out group"
                )}
              >
                {/* Course color indicator */}
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: assignment.courseColor || "currentColor" }}
                />

                {/* Assignment Title & Course Info (Truncated safely) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {courseDisplayName} · {assignmentTypeLabel}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className={cn("flex-shrink-0 flex flex-col gap-1", isRtl ? "text-left items-end" : "text-right items-end")}>
                  {status === "urgent" ? (
                    <Badge variant="urgent" className="gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.urgentBadge}: {relTime}</span>
                    </Badge>
                  ) : status === "soon" ? (
                    <Badge variant="warning" className="gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.soonBadge}: {relTime}</span>
                    </Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[11px] text-muted-foreground tabular-nums">
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
