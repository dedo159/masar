import Link from "next/link";
import { getDegreeRequirements } from "@/lib/db-queries";
import { GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import type { DegreeRequirement } from "@/lib/types";

export async function DegreeProgressSummary() {
  let requirements: DegreeRequirement[] = [];
  try {
    requirements = await getDegreeRequirements();
  } catch (error) {
    console.error("DegreeProgressSummary fetch error:", error);
    requirements = [];
  }

  const totalCompleted = requirements.reduce((acc, r) => acc + (r.completedCredits || 0), 0);
  const totalRequired = requirements.reduce((acc, r) => acc + (r.totalCredits || 0), 0);
  const percentage = totalRequired > 0 ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100)) : 0;
  const remainingCredits = Math.max(0, totalRequired - totalCompleted);

  const isNewStudent = totalCompleted === 0;
  const isGraduating = percentage >= 100;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 ease-out hover:border-foreground/20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground leading-tight">
              تقدّم متطلبات التخرج
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              خطة الدرجة الأكاديمية والمسار الدراسي
            </p>
          </div>
        </div>

        {isGraduating ? (
          <Badge variant="success" className="gap-1">
            <Award className="h-3 w-3" />
            مكتمل 100%
          </Badge>
        ) : isNewStudent ? (
          <Badge variant="neutral" className="gap-1">
            <Sparkles className="h-3 w-3" />
            طالب مستجد
          </Badge>
        ) : (
          <Badge variant="secondary" className="tabular-nums font-semibold">
            {percentage}%
          </Badge>
        )}
      </div>

      {/* Main Credit Numbers & Bar */}
      <div className="space-y-2 mt-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalCompleted}
            </span>
            <span className="text-xs text-muted-foreground">
              / {totalRequired} ساعة معتمدة
            </span>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            {isGraduating ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                أكملت الساعات المطلوبة 🎓
              </span>
            ) : isNewStudent ? (
              <span>0 ساعة منجزة حتى الآن</span>
            ) : (
              <span>متبقي <strong className="text-foreground font-semibold tabular-nums">{remainingCredits}</strong> ساعة</span>
            )}
          </p>
        </div>

        {/* Unified progress bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              isGraduating ? "bg-emerald-500" : "bg-primary"
            )}
            style={{ width: `${Math.max(percentage, isNewStudent ? 3 : percentage)}%` }}
          />
        </div>
      </div>

      {/* Category breakdown chips */}
      {requirements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-border">
          {requirements.map((req) => {
            const reqPercentage = req.totalCredits > 0
              ? Math.round((req.completedCredits / req.totalCredits) * 100)
              : 0;
            const reqCompleted = req.completedCredits >= req.totalCredits;

            return (
              <div
                key={req.id}
                className="rounded-lg bg-secondary/40 p-2.5 border border-border/60 flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium text-foreground truncate">
                    {req.categoryLabel}
                  </span>
                  {reqCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <span className="text-[11px] tabular-nums text-muted-foreground font-medium">
                      {reqPercentage}%
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                  <span>{req.completedCredits} من {req.totalCredits} س</span>
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full rounded-full", reqCompleted ? "bg-emerald-500" : "bg-primary/80")}
                      style={{ width: `${reqPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contextual Motivating Edge-Case Message */}
      {isNewStudent && (
        <div className="mt-3 rounded-lg bg-secondary/50 p-2.5 text-xs text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
          <span>بداية رحلتك الأكاديمية! ستضاف الساعات المنجزة فور رصد علاماتك لهذا الفصل.</span>
        </div>
      )}

      {isGraduating && (
        <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 p-2.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>تهانينا! حققت كافة متطلبات خطتك الدراسية بنجاح واقتدار.</span>
        </div>
      )}

      {/* Action Footer Button (Touch Target >= 44px) */}
      <div className="mt-4 pt-3 border-t border-border">
        <Link
          href="/growth"
          className="flex h-11 min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 active:scale-[0.98] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>عرض تفاصيل الخطة الدراسية ومؤشرات النمو الأكاديمي</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
