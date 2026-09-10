"use client";

import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Lock,
  Clock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

interface CourseItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  credits: number;
  status: "completed" | "enrolled" | "available" | "locked";
  grade?: string | null;
}

interface DegreeCategory {
  id: string;
  category: string;
  categoryLabel: string;
  totalCredits: number;
  completedCredits: number;
  courses: CourseItem[];
}

interface GrowthClientProps {
  healthMetrics: {
    score: number;
    onTimeRate: number;
    avgGrade: number;
    engagementRate: number;
  };
  careerMetrics: {
    score: number;
  };
  degreeRequirements: DegreeCategory[];
  studentProfile: {
    major?: string;
    year?: number;
    gpa?: number;
    totalCredits?: number;
    completedCredits?: number;
  } | null;
  studentSkills: { id: string; skill: { name: string } }[];
  totalCredits: number;
  completedCredits: number;
  degreePercentage: number;
  remainingCredits: number;
}

export function GrowthClient({
  healthMetrics,
  careerMetrics,
  degreeRequirements,
  studentProfile,
  studentSkills,
  totalCredits,
  completedCredits,
  degreePercentage,
  remainingCredits,
}: GrowthClientProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const courseStatusMap = {
    completed: { label: t.growth.courseStatus.completed, variant: "success" as const, icon: CheckCircle2 },
    enrolled: { label: t.growth.courseStatus.enrolled, variant: "default" as const, icon: Clock },
    available: { label: t.growth.courseStatus.available, variant: "warning" as const, icon: Unlock },
    locked: { label: t.growth.courseStatus.locked, variant: "secondary" as const, icon: Lock },
  };

  const getCategoryLabel = (label: string) => {
    if (isAr) return label;
    if (label.includes("الجامعة الإجبارية") || label.includes("جامعة إجبارية")) return "Compulsory University Requirements";
    if (label.includes("الجامعة الاختيارية") || label.includes("جامعة اختيارية")) return "Elective University Requirements";
    if (label.includes("الكلية الإجبارية") || label.includes("كلية إجبارية")) return "Compulsory Faculty Requirements";
    if (label.includes("التخصص الإجبارية") || label.includes("تخصص إجبارية")) return "Compulsory Major Requirements";
    if (label.includes("التخصص الاختيارية") || label.includes("تخصص اختيارية")) return "Elective Major Requirements";
    if (label.includes("حرة")) return "Free Electives";
    if (label.includes("مشروع") || label.includes("تدريب")) return "Graduation Project & Internship";
    return label;
  };

  return (
    <div className="space-y-8 px-4 py-5 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <TrendingUp className="h-7 w-7 text-primary" />
          {t.growth.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.growth.subtitle}
        </p>
      </div>

      {/* Degree Progress Hero Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t.growth.planTitle}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {studentProfile?.major || t.growth.defaultMajor} · {t.growth.year} {studentProfile?.year || 3}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-start sm:text-end">
              <span className="text-xs text-muted-foreground">{t.growth.gpaLabel}:</span>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {studentProfile?.gpa || 3.42} / 4.00
              </p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <Badge variant="secondary" className="text-sm px-3 py-1 font-bold tabular-nums">
              {degreePercentage}% {t.growth.percentDone}
            </Badge>
          </div>
        </div>

        {/* Progress Bar & Key Numbers */}
        <div className="mt-5 space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-foreground">
              {t.growth.completedOf} <strong className="text-primary text-base font-bold tabular-nums">{completedCredits}</strong> {t.growth.outOf} {totalCredits} {t.growth.creditHours}
            </span>
            <span className="text-muted-foreground">
              {t.growth.remaining} <strong className="text-foreground font-semibold tabular-nums">{remainingCredits}</strong> {t.growth.hours}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${degreePercentage}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Cards */}
        {degreeRequirements.length > 0 && (
          <div className="mt-6 space-y-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.growth.requirementsTitle}
            </h3>

            <div className="space-y-4">
              {degreeRequirements.map((cat) => {
                const catPercent = cat.totalCredits > 0
                  ? Math.round((cat.completedCredits / cat.totalCredits) * 100)
                  : 0;

                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-border/80 bg-secondary/30 p-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-bold text-foreground">
                          {getCategoryLabel(cat.categoryLabel)}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="tabular-nums font-semibold text-foreground">
                          {cat.completedCredits} / {cat.totalCredits} {t.growth.crUnit} ({catPercent}%)
                        </span>
                        <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${catPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course list inside category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
                      {cat.courses.map((c) => {
                        const statusConfig = courseStatusMap[c.status] || courseStatusMap.locked;
                        const StatusIcon = statusConfig.icon;
                        const cName = isAr ? c.nameAr : (c.nameEn || c.nameAr);

                        return (
                          <div
                            key={c.id}
                            className="flex flex-col justify-between p-3 rounded-lg border border-border/70 bg-card shadow-2xs hover:border-foreground/20 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold text-foreground leading-snug">
                                  {cName}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {c.code} · {c.credits} {t.growth.courseHours}
                                </p>
                              </div>
                              {c.grade && (
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                  {c.grade}
                                </span>
                              )}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
                              <Badge variant={statusConfig.variant} className="gap-1 text-[10px] px-2 py-0.5">
                                <StatusIcon className="h-3 w-3" />
                                <span>{statusConfig.label}</span>
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dual Scores (Academic Health & Career Readiness) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Academic Health Score Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              {t.growth.healthScoreTitle}
            </h2>
            <Badge variant="secondary" className="font-semibold">
              {healthMetrics.score >= 80
                ? t.growth.healthExcellent
                : healthMetrics.score >= 60
                ? t.growth.healthVeryGood
                : t.growth.healthNeedsImprovement}
            </Badge>
          </div>

          <div className="flex items-center gap-6 my-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-muted"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-primary"
                  strokeWidth="10"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * healthMetrics.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-2xl font-bold tabular-nums text-foreground">
                {healthMetrics.score}%
              </span>
            </div>

            <div className="flex-1 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t.growth.onTimeRate}</span>
                <span className="font-bold tabular-nums">{healthMetrics.onTimeRate}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${healthMetrics.onTimeRate}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t.growth.avgGrade}</span>
                <span className="font-bold tabular-nums">{healthMetrics.avgGrade}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${healthMetrics.avgGrade}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t.growth.engagement}</span>
                <span className="font-bold tabular-nums">{healthMetrics.engagementRate}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary/80 h-full rounded-full"
                  style={{ width: `${healthMetrics.engagementRate}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-3 border-t border-border">
            {t.growth.healthNote}
          </p>
        </div>

        {/* 2. Career Readiness Score Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" />
              {t.growth.careerScoreTitle}
            </h2>
            <Badge variant="secondary" className="font-semibold">
              {careerMetrics.score >= 70 ? t.growth.careerReady : t.growth.careerBuilding}
            </Badge>
          </div>

          <div className="flex items-center gap-6 my-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-muted"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-emerald-500"
                  strokeWidth="10"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * careerMetrics.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {careerMetrics.score}%
              </span>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {t.growth.careerDesc}
              </p>
              <div className="pt-2">
                <span className="font-semibold text-foreground">{t.growth.verifiedSkillsLabel}</span>{" "}
                <span className="text-muted-foreground">{studentSkills.length} {t.growth.skillsCountUnit}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex flex-wrap gap-1.5">
            {studentSkills.slice(0, 5).map((s) => (
              <Badge key={s.id} variant="secondary" className="text-xs">
                {s.skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
