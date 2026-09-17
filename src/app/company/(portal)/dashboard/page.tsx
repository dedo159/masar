"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { ExecutiveKpiRibbon } from "@/components/company/executive-kpi-ribbon";
import { ActiveOpeningsPipelineStrip } from "@/components/company/active-openings-pipeline-strip";
import { FacultyTechPulse } from "@/components/company/faculty-tech-pulse";

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [stats, setStats] = useState<any>({
    totalInternships: 4,
    totalApplicants: 86,
    pendingReview: 14,
    readyCandidatesCount: 142,
    readyCandidatesGrowth: "+18% هذا الفصل",
    minReadinessScore: 75,
    scheduledInterviewsCount: 12,
    nearestInterviewToday: {
      time: "2:30 م",
      candidateName: "عمر خالد",
      role: "مهندس واجهات",
    },
    timeToHireDays: 14,
    marketAverageDays: 20,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/company/dashboard");
        if (res.status === 401) {
          router.push("/company/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats((prev: any) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/20 bg-primary/5">
              <Building2 className="h-3 w-3 ml-1 inline text-primary" />
              بوابة الشركاء والتوظيف
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.companyportaldashboardpagetsx.text_8sxs}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.companyportaldashboardpagetsx.text_nhry}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/company/talents">
            <Button variant="outline" className="text-xs font-semibold gap-1.5 h-10 px-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>استقطاب الكفاءات (Talent Search)</span>
            </Button>
          </Link>

          <Link href="/company/internships">
            <Button className="text-xs font-semibold gap-1.5 h-10 px-4">
              <Plus className="h-4 w-4" />
              <span>{t.companyportaldashboardpagetsx.text_ol3e}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Executive KPIs Metrics Ribbon */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-2xl border border-border h-36 flex flex-col justify-between"
            />
          ))}
        </div>
      ) : (
        <ExecutiveKpiRibbon
          readyCandidatesCount={stats.readyCandidatesCount}
          readyCandidatesGrowth={stats.readyCandidatesGrowth}
          minReadinessScore={stats.minReadinessScore}
          totalApplicationsCount={stats.totalApplicants}
          unreadApplicationsCount={stats.pendingReview}
          activeVacanciesCount={stats.totalInternships}
          scheduledInterviewsCount={stats.scheduledInterviewsCount}
          nearestInterviewToday={stats.nearestInterviewToday}
          timeToHireDays={stats.timeToHireDays}
          marketAverageDays={stats.marketAverageDays}
        />
      )}

      {/* Active Openings Pipeline Strip (شريط المتابعة السريعة للشواغر المفتوحة) */}
      <ActiveOpeningsPipelineStrip />

      {/* Faculty Tech Pulse (رصد اتجاهات التقنية ومشاريع الطلاب في كلية الـ IT) */}
      <FacultyTechPulse />



      {/* Trust & Academic Validation Banner */}
      <Card className="p-6 border border-border bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              بيانات أكاديمية وبرمجية موثقة ومعتمدة رسمياً
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
              جميع درجات ومؤشرات الطلاب ومشاريع كود GitHub يتم فحصها وتدقيقها آلياً عبر خوارزميات مسار لضمان أعلى موثوقية في التوظيف.
            </p>
          </div>
        </div>

        <Link href="/company/talents" className="shrink-0">
          <Button size="sm" className="text-xs font-semibold h-9 px-4">
            استكشاف الكفاءات
          </Button>
        </Link>
      </Card>
    </div>
  );
}
