import { getTodayClasses } from "@/lib/db-queries";
import { formatTime } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodayClass } from "@/lib/types";

const typeConfig: Record<TodayClass["type"], { label: string; icon: typeof BookOpen }> = {
  lecture: { label: "محاضرة", icon: BookOpen },
  lab: { label: "مختبر", icon: FlaskConical },
  tutorial: { label: "درس", icon: Users },
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">جدول المحاضرات اليومي</h2>
          <span className="text-[10px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border">
            توقيت الأردن (GMT+3)
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {todayClasses.length} محاضرات
        </span>
      </div>

      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-border bg-card/50 text-center">
          <p className="text-sm text-muted-foreground">لا توجد محاضرات مجدولة لهذا اليوم 🎉</p>
          <p className="text-xs text-muted-foreground mt-1">استمتع بيومك أو راجع مواعيد التسليمات القادمة</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayClasses.map((cls, idx) => {
            const config = typeConfig[cls.type] || typeConfig.lecture;
            const TypeIcon = config.icon;
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 rounded-xl border bg-card p-3.5 transition-all duration-150",
                  cls.status === "ongoing"
                    ? "border-primary/50 bg-primary/5 shadow-sm"
                    : "border-border",
                  cls.status === "done" && "opacity-60 bg-muted/30"
                )}
              >
                {/* Color strip */}
                <div
                  className="mt-0.5 h-10 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cls.color || "#8B5CF6" }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-tight truncate">
                        {cls.courseNameAr}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cls.courseCode} · {cls.instructor}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-xs font-semibold tabular-nums text-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatTime(cls.startTime)}
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        حتى {formatTime(cls.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {cls.room}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TypeIcon className="h-3 w-3" />
                      {config.label}
                    </div>
                    {cls.status === "ongoing" && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        جارية الآن
                      </span>
                    )}
                    {cls.status === "done" && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        انتهت
                      </span>
                    )}
                    {cls.status === "upcoming" && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                        قادمة
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
