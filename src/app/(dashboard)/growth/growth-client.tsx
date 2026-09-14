"use client";

import {
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
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
  studentProfile: {
    major?: string;
    year?: number;
    gpa?: number;
    totalCredits?: number;
    completedCredits?: number;
  } | null;
  studentSkills: { id: string; skill: { name: string } }[];
}

export function GrowthClient({
  healthMetrics,
  careerMetrics,
  studentProfile,
  studentSkills,
}: GrowthClientProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
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
