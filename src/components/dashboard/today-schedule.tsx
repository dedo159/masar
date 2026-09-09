import Link from "next/link";
import { getTodayClasses } from "@/lib/db-queries";
import { formatTime } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users, Clock, CalendarDays, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { TodayClass } from "@/lib/types";

const typeConfig: Record<TodayClass["type"], { label: string; icon: typeof BookOpen }> = {
  lecture: { label: "محاضرة", icon: BookOpen },
  lab: { label: "مختبر", icon: FlaskConical },
  tutorial: { label: "تطبيق", icon: Users },
};

export async function TodayScheduleSection() {
  let todayClasses: TodayClass[] = [];
  try {
    todayClasses = await getTodayClasses();
  } catch (error) {
    console.error("TodayScheduleSection fetch error:", error);
    todayClasses = [];
  }
  const hasClasses = todayClasses.length > 0;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">جدول المحاضرات اليومي</h2>
          <span className="text-[11px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border">
            توقيت الأردن (GMT+3)
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {todayClasses.length} {todayClasses.length === 1 ? "محاضرة" : "محاضرات"}
        </span>
      </div>

      {/* Empty State with Actionable Link */}
      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">لا توجد محاضرات مجدولة لهذا اليوم 🎉</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
            يومك خفيف من المحاضرات! يمكنك استغلال الوقت في المذاكرة أو مراجعة متطلبات المساقات.
          </p>
          <Link
            href="/courses"
            className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 px-4 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 active:scale-[0.98] transition-all"
          >
            <span>استعراض المواد والمساقات</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {todayClasses.map((cls, idx) => {
            const config = typeConfig[cls.type] || typeConfig.lecture;
            const TypeIcon = config.icon;
            const isOngoing = cls.status === "ongoing";

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
                        {cls.courseNameAr}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cls.courseCode} · {cls.instructor}
                      </p>
                    </div>

                    <div className="text-left flex-shrink-0">
                      <p className="text-xs font-semibold tabular-nums text-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatTime(cls.startTime)}
                      </p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        حتى {formatTime(cls.endTime)}
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
                      <span>{config.label}</span>
                    </div>

                    {/* Class Status Badges */}
                    {isOngoing && (
                      <Badge variant="success" className="gap-1 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        جارية الآن
                      </Badge>
                    )}
                    {cls.status === "upcoming" && (
                      <Badge variant="secondary">
                        قادمة
                      </Badge>
                    )}
                    {cls.status === "done" && (
                      <Badge variant="neutral">
                        انتهت
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
