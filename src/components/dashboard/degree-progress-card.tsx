import Link from "next/link";
import { getStudentProfile, getDegreeRequirements } from "@/lib/db-queries";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

export async function DegreeProgressCard() {
  const [student, requirements] = await Promise.all([
    getStudentProfile(),
    getDegreeRequirements(),
  ]);

  if (!student) return null;

  const totalCredits = student.totalCredits;
  const completedCredits = student.completedCredits;
  const percentage = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-foreground">تقدّم التخرج</h2>
        <Link
          href="/degree"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          التفاصيل
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {/* Overall */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-2xl font-medium tabular-nums">{percentage}%</p>
            <p className="text-xs text-muted-foreground">
              {completedCredits} من {totalCredits} ساعة
            </p>
          </div>
          {/* Mini ring */}
          <div className="relative h-14 w-14">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="6"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - percentage / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Per-category */}
        <div className="space-y-3 mt-4 pt-4 border-t border-border">
          {requirements.map((req) => {
            const pct = Math.round((req.completedCredits / req.totalCredits) * 100);
            return (
              <div key={req.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{req.categoryLabel}</span>
                  <span className="text-xs tabular-nums text-foreground">
                    {req.completedCredits}/{req.totalCredits}
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
