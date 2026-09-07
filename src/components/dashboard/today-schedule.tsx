import { getTodayClasses } from "@/lib/db-queries";
import { formatTime } from "@/lib/utils";
import { MapPin, FlaskConical, BookOpen, Users } from "lucide-react";
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
        <h2 className="text-sm font-medium text-foreground">جدول اليوم</h2>
        <span className="text-xs text-muted-foreground">
          {todayClasses.length} محاضرات
        </span>
      </div>

      {!hasClasses ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-border bg-card text-center">
          <p className="text-sm text-muted-foreground">لا محاضرات اليوم 🎉</p>
          <p className="text-xs text-muted-foreground mt-1">استمتع بيومك!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayClasses.map((cls, idx) => {
            const config = typeConfig[cls.type];
            const TypeIcon = config.icon;
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-150",
                  cls.status === "ongoing"
                    ? "border-primary/40 bg-primary/5"
                    : "border-border",
                  cls.status === "done" && "opacity-50"
                )}
              >
                {/* Color strip */}
                <div
                  className="mt-0.5 h-10 w-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cls.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-tight truncate">
                        {cls.courseNameAr}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cls.instructor}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-xs font-medium tabular-nums">
                        {formatTime(cls.startTime)}
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatTime(cls.endTime)}
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
                      <span className="flex items-center gap-1 text-xs text-primary font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        الآن
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
