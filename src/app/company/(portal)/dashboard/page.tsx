"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Briefcase,
  Users,
  Clock,
  ArrowUpRight,
  Sparkles,
  Kanban,
  BarChart3,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-primary/40 transition-all">
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
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-primary/40 transition-all">
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
          <Card className="p-6 flex items-center justify-between shadow-xs hover:border-primary/40 transition-all">
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
              href="/company/ats"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      )}

      {/* Core Platform Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            أقسام بوابة التوظيف وإدارة الكفاءات
          </h2>
          <span className="text-xs text-muted-foreground">وصول سريع لجميع أدوات مسؤول التوظيف</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Module 1: ATS Kanban */}
          <Card className="p-6 border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Kanban className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  لوحة كانبان
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  مسار التوظيف وتتبع المتقدمين (ATS Pipeline)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  نظام تفاعلي متكامل للسحب والإفلات لمتابعة مراحل المرشحين: طلبات جديدة، التدقيق التقني، المقابلات المجدولة، وعروض القبول.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-border/60 mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stats.pendingReview} طلب بانتظار اتخاذ إجراء
              </span>
              <Link
                href="/company/ats"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline"
              >
                <span>فتح لوحة ATS</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Module 2: Talent Search */}
          <Card className="p-6 border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  جاهزية الذكاء الاصطناعي
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  محرك استقطاب الكفاءات (Talent Search Engine)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  بحث وفلترة دقيقة لطلبة وخريجي الجامعات التقنية استناداً إلى تدقيق كود GitHub الفعلي ومؤشر الجاهزية لسوق العمل.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-border/60 mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                كفاءات مفحوصة وموثقة أكاديمياً
              </span>
              <Link
                href="/company/talents"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline"
              >
                <span>استكشاف المرشحين</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Module 3: Analytics */}
          <Card className="p-6 border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  لوحة المؤشرات
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  التحليلات ومؤشرات الأداء (Employer Analytics)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  مؤشرات قمع التوظيف، معدل التطابق، متوسط زمن إغلاق الشواغر، مع رادار المواهب الأكاديمية بالجامعات.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-border/60 mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                تقارير ورؤى استراتيجية
              </span>
              <Link
                href="/company/analytics"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline"
              >
                <span>عرض التحليلات</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Module 4: Internships */}
          <Card className="p-6 border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  الشواغر
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  إدارة الشواغر التدريبية (Internship Listings)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  نشر وتعديل الشواغر التدريبية ومتابعة المتقدمين وقوائم المرشحين لكل فرصة مع تفاصيل التقديم.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-border/60 mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stats.totalInternships} فرصة منشورة
              </span>
              <Link
                href="/company/internships"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline"
              >
                <span>إدارة الشواغر</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

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
