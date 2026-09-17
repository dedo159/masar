"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, Users, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [stats, setStats] = useState({ totalInternships: 0, totalApplicants: 0, pendingReview: 0 });
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
          setStats(data);
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.companyportaldashboardpagetsx.text_8sxs}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.companyportaldashboardpagetsx.text_nhry}
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* KPI Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card p-6 rounded-xl border border-border h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Internships */}
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-border/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.companyportaldashboardpagetsx.text_unk2}
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1 tabular-nums font-mono">
                  {stats.totalInternships}
                </h3>
              </div>
            </div>
            <Link
              href="/company/internships"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* Card 2: Applicants */}
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-border/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary text-foreground flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.companyportaldashboardpagetsx.text_ma4a}
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1 tabular-nums font-mono">
                  {stats.totalApplicants}
                </h3>
              </div>
            </div>
            <Link
              href="/company/internships"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* Card 3: Pending Review */}
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-border/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.companyportaldashboardpagetsx.text_p5u1}
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1 tabular-nums font-mono">
                  {stats.pendingReview}
                </h3>
              </div>
            </div>
            <Link
              href="/company/internships"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      )}

      {/* Talent Search Quick Callout Card */}
      <Card className="p-6 border border-border bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              محرك البحث الذكي عن الكفاءات الطلابية (Talent Search)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            استكشف طلاب الجامعات المتميزين بناءً على فحص كود GitHub الفعلي، ومؤشر الجاهزية لسوق العمل، ومعدل المواد البرمجية الأساسية.
          </p>
        </div>

        <Link href="/company/talents">
          <Button className="text-xs font-semibold h-10 px-5">
            استعراض الكفاءات المعتمدة
          </Button>
        </Link>
      </Card>
    </div>
  );
}
