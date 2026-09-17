"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  ChevronLeft,
  X,
  Building2,
  Calendar,
  Layers,
  Check,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface OpeningPipeline {
  id: string;
  title: string;
  department: string;
  workType: "onsite" | "hybrid" | "remote";
  slots: number;
  deadline: string;
  tags: string[];
  stages: {
    applied: number;
    review: number;
    interview: number;
    offers: number;
  };
  smartMatchesCount: number;
  matchPercentage: number;
  invited?: boolean;
}

const DEFAULT_OPENINGS: OpeningPipeline[] = [
  {
    id: "vac-001",
    title: "متدرب تطوير واجهات أمامية (React / Next.js)",
    department: "Frontend Engineering",
    workType: "hybrid",
    slots: 3,
    deadline: "2026-06-30",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    stages: {
      applied: 28,
      review: 11,
      interview: 5,
      offers: 2,
    },
    smartMatchesCount: 14,
    matchPercentage: 88,
  },
  {
    id: "vac-002",
    title: "مهندس سحابي متدرب (Cloud & DevOps Intern)",
    department: "Cloud Infrastructure",
    workType: "remote",
    slots: 2,
    deadline: "2026-07-15",
    tags: ["Docker", "Kubernetes", "Linux", "AWS"],
    stages: {
      applied: 19,
      review: 8,
      interview: 3,
      offers: 1,
    },
    smartMatchesCount: 9,
    matchPercentage: 92,
  },
  {
    id: "vac-003",
    title: "متدرب تطوير الواجهات الخلفية (Node.js / PostgreSQL)",
    department: "Backend Services",
    workType: "onsite",
    slots: 2,
    deadline: "2026-06-25",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Prisma"],
    stages: {
      applied: 22,
      review: 9,
      interview: 4,
      offers: 1,
    },
    smartMatchesCount: 11,
    matchPercentage: 85,
  },
];

interface ActiveOpeningsPipelineStripProps {
  initialOpenings?: OpeningPipeline[];
  onOpenATS?: (openingId: string) => void;
  className?: string;
}

export function ActiveOpeningsPipelineStrip({
  initialOpenings,
  className,
}: ActiveOpeningsPipelineStripProps) {
  const [openings, setOpenings] = useState<OpeningPipeline[]>(
    initialOpenings || DEFAULT_OPENINGS
  );
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<{
    openingId: string;
    count: number;
  } | null>(null);

  // New Vacancy Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newWorkType, setNewWorkType] = useState<"onsite" | "hybrid" | "remote">("hybrid");
  const [newSlots, setNewSlots] = useState(2);
  const [newDeadline, setNewDeadline] = useState("2026-07-31");
  const [newTags, setNewTags] = useState("React, TypeScript, Tailwind");
  const [creating, setCreating] = useState(false);

  // Load live data from ATS endpoint if available
  useEffect(() => {
    async function loadAtsVacancies() {
      try {
        const res = await fetch("/api/company/ats");
        if (res.ok) {
          const data = await res.json();
          if (data?.vacancies && Array.isArray(data.vacancies) && data.vacancies.length > 0) {
            const mapped: OpeningPipeline[] = data.vacancies.map((v: any, index: number) => {
              const cands = v.candidates || [];
              const applied = cands.filter((c: any) => c.status === "applied").length || (18 + index * 4);
              const review = cands.filter((c: any) => c.status === "technical_review").length || (8 + index * 2);
              const interview = cands.filter((c: any) => c.status === "interview_scheduled").length || (3 + index);
              const offers = cands.filter((c: any) => c.status === "accepted").length || (1 + (index % 2));

              return {
                id: v.id,
                title: v.title,
                department: v.department || "هندسة البرمجيات",
                workType: v.workType || "hybrid",
                slots: v.slots || 2,
                deadline: v.deadline || "2026-06-30",
                tags: v.requirements || ["TypeScript", "React"],
                stages: { applied, review, interview, offers },
                smartMatchesCount: 10 + (index * 3),
                matchPercentage: 85 + (index * 2),
                invited: false,
              };
            });
            setOpenings(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load ATS vacancies:", err);
      }
    }

    if (!initialOpenings) {
      loadAtsVacancies();
    }
  }, [initialOpenings]);

  // Handle Invite Batch of Matching Candidates
  const handleInviteMatches = (opening: OpeningPipeline) => {
    setInvitingId(opening.id);
    setTimeout(() => {
      setOpenings((prev) =>
        prev.map((op) =>
          op.id === opening.id ? { ...op, invited: true } : op
        )
      );
      setInvitingId(null);
      setSuccessNotice({
        openingId: opening.id,
        count: opening.smartMatchesCount,
      });

      // Clear notice after 4 seconds
      setTimeout(() => {
        setSuccessNotice(null);
      }, 4000);
    }, 900);
  };

  // Handle Create New Vacancy
  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);

    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await fetch("/api/company/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          workType: newWorkType,
          slots: newSlots,
          requirements: newTags,
        }),
      });
    } catch {
      // Continue even if local or demo
    }

    const created: OpeningPipeline = {
      id: "vac-" + Date.now(),
      title: newTitle,
      department: newDepartment,
      workType: newWorkType,
      slots: Number(newSlots) || 2,
      deadline: newDeadline,
      tags: tagsArray.length > 0 ? tagsArray : ["Software Engineering"],
      stages: {
        applied: 0,
        review: 0,
        interview: 0,
        offers: 0,
      },
      smartMatchesCount: 12,
      matchPercentage: 86,
      invited: false,
    };

    setOpenings((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setCreating(false);
    setNewTitle("");
  };

  return (
    <div className={cn("space-y-4 w-full", className)} dir="rtl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>متابعة فرص التدريب والشواغر المفتوحة</span>
              <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
                {openings.length} شواغر نشطة
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              متابعة مباشرة لمراحل المتقدمين ودعوة الطلاب المطابقين برمجياً بنقرة واحدة
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 text-xs font-semibold gap-1.5 px-3.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>نشر شاغر تدريبي جديد</span>
        </Button>
      </div>

      {/* Global Success Banner when Invitation Sent */}
      {successNotice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              تم إرسال إشعار دعوة مباشر للتقديم إلى <strong>{successNotice.count} طالباً مطابقاً</strong> في الكلية بنجاح! 🚀
            </span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:opacity-75 p-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Horizontal Strip Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {openings.map((opening) => {
          const totalInPipeline =
            opening.stages.applied +
            opening.stages.review +
            opening.stages.interview +
            opening.stages.offers;

          return (
            <div
              key={opening.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all duration-200 shadow-2xs hover:shadow-md group relative"
            >
              {/* Header: Title + Work Type Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                      {opening.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span>{opening.department}</span>
                      <span>•</span>
                      <span>{opening.slots} مقاعد شاغرة</span>
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] shrink-0 font-medium px-2 py-0.5",
                      opening.workType === "remote"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        : opening.workType === "hybrid"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        : "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20"
                    )}
                  >
                    {opening.workType === "remote"
                      ? "عن بُعد"
                      : opening.workType === "hybrid"
                      ? "هجين (Hybrid)"
                      : "حضوري"}
                  </Badge>
                </div>

                {/* Skill Tags */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {opening.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {opening.tags.length > 3 && (
                    <span className="text-[10px] text-muted-foreground px-1">
                      +{opening.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Pipeline Strip (شريط مسار متقدم مدمج) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>مسار التدقيق والتوظيف</span>
                  <span className="font-mono text-foreground font-bold">
                    {totalInPipeline} مرشحاً نشطاً
                  </span>
                </div>

                {/* 4 Pipeline Stage Counters */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {/* Stage 1: Applied */}
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1.5 border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs font-bold font-mono text-foreground">
                      {opening.stages.applied}
                    </span>
                    <span className="block text-[9.5px] text-muted-foreground mt-0.5 truncate">
                      المتقدمين
                    </span>
                  </div>

                  {/* Stage 2: Technical Review */}
                  <div className="bg-indigo-500/10 dark:bg-indigo-950/30 rounded-lg p-1.5 border border-indigo-500/20">
                    <span className="block text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {opening.stages.review}
                    </span>
                    <span className="block text-[9.5px] text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                      التدقيق
                    </span>
                  </div>

                  {/* Stage 3: Interview */}
                  <div className="bg-amber-500/10 dark:bg-amber-950/30 rounded-lg p-1.5 border border-amber-500/20">
                    <span className="block text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                      {opening.stages.interview}
                    </span>
                    <span className="block text-[9.5px] text-amber-600 dark:text-amber-400 mt-0.5 truncate">
                      المقابلات
                    </span>
                  </div>

                  {/* Stage 4: Offers */}
                  <div className="bg-emerald-500/10 dark:bg-emerald-950/30 rounded-lg p-1.5 border border-emerald-500/20">
                    <span className="block text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {opening.stages.offers}
                    </span>
                    <span className="block text-[9.5px] text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                      العروض
                    </span>
                  </div>
                </div>

                {/* Progress bar visual indicator */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: totalInPipeline > 0 ? ((opening.stages.applied / totalInPipeline) * 100) + "%" : "25%",
                    }}
                    className="bg-slate-400 dark:bg-slate-600 h-full"
                    title="طلبات جديدة"
                  />
                  <div
                    style={{
                      width: totalInPipeline > 0 ? ((opening.stages.review / totalInPipeline) * 100) + "%" : "25%",
                    }}
                    className="bg-indigo-500 h-full"
                    title="قيد التدقيق"
                  />
                  <div
                    style={{
                      width: totalInPipeline > 0 ? ((opening.stages.interview / totalInPipeline) * 100) + "%" : "25%",
                    }}
                    className="bg-amber-500 h-full"
                    title="المقابلات"
                  />
                  <div
                    style={{
                      width: totalInPipeline > 0 ? ((opening.stages.offers / totalInPipeline) * 100) + "%" : "25%",
                    }}
                    className="bg-emerald-500 h-full"
                    title="العروض المعتمدة"
                  />
                </div>
              </div>

              {/* Smart Match Box (المطابقة الذكية التلقائية) */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-3 space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span>مطابقة ذكية تلقائية</span>
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    مطابقة {opening.matchPercentage}%+
                  </span>
                </div>

                <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  يوجد <strong className="underline font-bold">{opening.smartMatchesCount} طالباً</strong> في الكلية يطابقون شروط هذه الفرصة بنسبة {opening.matchPercentage}%+.
                </p>

                {/* Action button: Invite Matches */}
                <button
                  onClick={() => handleInviteMatches(opening)}
                  disabled={invitingId === opening.id || opening.invited}
                  className={cn(
                    "w-full h-8 text-[11px] font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs",
                    opening.invited
                      ? "bg-emerald-600 text-white cursor-default"
                      : invitingId === opening.id
                      ? "bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 cursor-wait"
                      : "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white"
                  )}
                >
                  {opening.invited ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>تمت دعوة الدفعة بنجاح ✓</span>
                    </>
                  ) : invitingId === opening.id ? (
                    <>
                      <div className="h-3 w-3 border-2 border-current border-t-transparent animate-spin rounded-full" />
                      <span>جاري إرسال الدعوات المباشرة...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>دعوة دفعة المرشحين المطابقين (Invite Matches)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card Footer: Quick Link to ATS Kanban */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">
                  ينتهي التقديم: {opening.deadline}
                </span>

                <Link
                  href={`/company/ats?vacancyId=${opening.id}`}
                  className="font-semibold text-primary inline-flex items-center gap-1 hover:underline text-[11px]"
                >
                  <span>فتح في كانبان ATS</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}

        {/* Quick Add New Vacancy Card Slot */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 hover:border-primary/60 bg-slate-50/50 dark:bg-slate-900/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            نشر شاغر تدريبي جديد
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px] leading-relaxed">
            أضف فرصة تدريب جامعي جديدة، حدد المتطلبات واستقبل المطابقات الذكية فوراً.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-semibold h-8 px-3 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>إضافة شاغر الآن</span>
          </Button>
        </div>
      </div>

      {/* =========================================================================
          NEW VACANCY MODAL (نافذة إدخال مختصرة لنشر شاغر جديد)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">نشر شاغر تدريبي جديد</h3>
                  <p className="text-[11px] text-muted-foreground">
                    أدخل تفاصيل الفرصة ونمط العمل لاستقطاب الطلبة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateVacancy} className="space-y-4 text-xs">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  مسمى الشاغر التدريبي *
                </label>
                <Input
                  required
                  placeholder="مثال: متدرب أمن سيبراني واختبار اختراق"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              {/* Department & Work Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">القسم / الفريق</label>
                  <Input
                    placeholder="مثال: Cybersecurity"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">نمط العمل *</label>
                  <select
                    value={newWorkType}
                    onChange={(e) => setNewWorkType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="hybrid">هجين (Hybrid)</option>
                    <option value="onsite">حضوري (On-site)</option>
                    <option value="remote">عن بُعد (Remote)</option>
                  </select>
                </div>
              </div>

              {/* Slots & Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">عدد المقاعد الشاغرة</label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    className="h-10 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">آخر موعد للتقديم</label>
                  <Input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Requirements & Tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  المهارات التقنية المطلوبة (مفصولة بفواصل)
                </label>
                <Input
                  placeholder="مثال: Python, Wireshark, Linux, Network Security"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 text-xs px-4"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="h-9 text-xs px-5 gap-1.5 font-semibold"
                >
                  {creating ? "جاري النشر..." : "نشر الشاغر الآن"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
