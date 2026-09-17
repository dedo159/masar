"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Kanban,
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Sparkles,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronDown,
  Building2,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Eye,
  GripVertical,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScheduleInterviewModal } from "@/components/company/schedule-interview-modal";
import { FeedbackDecisionModal } from "@/components/company/feedback-decision-modal";
import { CandidateOutreachDrawer } from "@/components/company/candidate-outreach-drawer";
import type { ATSCandidate, ATSVacancy } from "@/app/api/company/ats/route";

interface ColumnDef {
  id: ATSCandidate["status"];
  title: string;
  badgeVariant: "secondary" | "outline" | "default" | "success";
  description: string;
}

const KANBAN_COLUMNS: ColumnDef[] = [
  {
    id: "applied",
    title: "طلبات جديدة",
    badgeVariant: "secondary",
    description: "طلبات التقديم الواردة حديثاً",
  },
  {
    id: "technical_review",
    title: "قيد التدقيق التقني",
    badgeVariant: "outline",
    description: "فحص الكود والمشاريع ومؤشر الجاهزية",
  },
  {
    id: "interview_scheduled",
    title: "المقابلات المجدولة",
    badgeVariant: "default",
    description: "مرشحون تم تحديد مواعيد لمقابلتهم",
  },
  {
    id: "accepted",
    title: "تم القبول / العرض التدريبي",
    badgeVariant: "success",
    description: "تم اعتماد قبولهم وإصدار عروض التدريب",
  },
];

export default function ATSPipelinePage() {
  const [vacancies, setVacancies] = useState<ATSVacancy[]>([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers States
  const [activeInterviewCandidate, setActiveInterviewCandidate] = useState<ATSCandidate | null>(null);
  const [activeDecisionCandidate, setActiveDecisionCandidate] = useState<ATSCandidate | null>(null);
  const [activeOutreachCandidate, setActiveOutreachCandidate] = useState<ATSCandidate | null>(null);
  const [quickPreviewCandidate, setQuickPreviewCandidate] = useState<ATSCandidate | null>(null);
  const [showNewVacancyModal, setShowNewVacancyModal] = useState(false);

  // New Vacancy Form States
  const [newTitle, setNewTitle] = useState("");
  const [newWorkType, setNewWorkType] = useState<"hybrid" | "onsite" | "remote">("hybrid");
  const [newSlots, setNewSlots] = useState(2);
  const [newRequirements, setNewRequirements] = useState("");
  const [creatingVacancy, setCreatingVacancy] = useState(false);

  // Drag and Drop States
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Fetch vacancies and candidates
  const fetchVacancies = async () => {
    try {
      const res = await fetch("/api/company/ats");
      const data = await res.json();
      if (data?.vacancies) {
        // If we also get selectedVacancy from backend
        const fullRes = await fetch(`/api/company/ats?vacancyId=${data.selectedVacancy?.id || data.vacancies[0]?.id}`);
        const fullData = await fullRes.json();
        if (fullData?.vacancy) {
          setVacancies([fullData.vacancy]);
          setSelectedVacancyId(fullData.vacancy.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch ATS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const currentVacancy = useMemo(() => {
    return vacancies.find((v) => v.id === selectedVacancyId) || vacancies[0];
  }, [vacancies, selectedVacancyId]);

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!currentVacancy?.candidates) return [];
    if (!searchQuery.trim()) return currentVacancy.candidates;
    const q = searchQuery.toLowerCase();
    return currentVacancy.candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.university.toLowerCase().includes(q) ||
        c.topSkills.some((s) => s.toLowerCase().includes(q))
    );
  }, [currentVacancy, searchQuery]);

  // Column partitioning
  const columnsData = useMemo(() => {
    return {
      applied: filteredCandidates.filter((c) => c.status === "applied"),
      technical_review: filteredCandidates.filter((c) => c.status === "technical_review"),
      interview_scheduled: filteredCandidates.filter((c) => c.status === "interview_scheduled"),
      accepted: filteredCandidates.filter((c) => c.status === "accepted"),
    };
  }, [filteredCandidates]);

  // KPI calculations
  const totalCount = currentVacancy?.candidates?.length || 0;
  const reviewCount = currentVacancy?.candidates?.filter((c) => c.status === "technical_review").length || 0;
  const interviewCount = currentVacancy?.candidates?.filter((c) => c.status === "interview_scheduled").length || 0;
  const acceptedCount = currentVacancy?.candidates?.filter((c) => c.status === "accepted").length || 0;

  // Move candidate to new status
  const handleMoveStatus = async (
    candidateId: string,
    newStatus: ATSCandidate["status"],
    extra?: Partial<ATSCandidate>
  ) => {
    if (!currentVacancy) return;

    // Optimistic UI update
    setVacancies((prev) =>
      prev.map((vac) => {
        if (vac.id !== currentVacancy.id) return vac;
        return {
          ...vac,
          candidates: vac.candidates.map((cand) => {
            if (cand.id !== candidateId) return cand;
            return {
              ...cand,
              status: newStatus,
              ...extra,
            };
          }),
        };
      })
    );

    try {
      await fetch("/api/company/ats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vacancyId: currentVacancy.id,
          candidateId,
          newStatus,
          ...extra,
        }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData("text/plain", candidateId);
    setDraggedCandidateId(candidateId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: ATSCandidate["status"]) => {
    e.preventDefault();
    setDragOverColumn(null);
    const candidateId = e.dataTransfer.getData("text/plain") || draggedCandidateId;
    if (candidateId) {
      handleMoveStatus(candidateId, targetColumnId);
    }
    setDraggedCandidateId(null);
  };

  // Add new vacancy
  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreatingVacancy(true);

    try {
      const res = await fetch("/api/company/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          workType: newWorkType,
          slots: newSlots,
          requirements: newRequirements,
        }),
      });
      const data = await res.json();
      if (data?.vacancy) {
        setVacancies((prev) => [data.vacancy, ...prev]);
        setSelectedVacancyId(data.vacancy.id);
        setShowNewVacancyModal(false);
        setNewTitle("");
        setNewRequirements("");
      }
    } catch (err) {
      console.error("Failed to create vacancy:", err);
    } finally {
      setCreatingVacancy(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          1. TOP CONTROL BAR (شريط التحكم العلوي)
          ========================================================================= */}
      <div className="flex flex-col gap-5 border-b border-border pb-6">
        {/* Row 1: Title, Vacancy Dropdown, New Vacancy Action */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Kanban className="h-5 w-5 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                مسار التوظيف وتتبع المتقدمين (ATS Pipeline)
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              إدارة وتتبع مسار مرشحي التدريب الجامعي من مرحلة التقديم حتى اعتماد العرض النهائي.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Vacancy Selector Dropdown */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <select
                value={selectedVacancyId}
                onChange={(e) => setSelectedVacancyId(e.target.value)}
                className="w-full h-10 px-3.5 pr-9 text-xs font-semibold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer shadow-xs truncate"
              >
                {vacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Add Vacancy Button */}
            <Button
              onClick={() => setShowNewVacancyModal(true)}
              className="h-10 px-4 text-xs font-semibold gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة شاغر تدريبي جديد</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">إجمالي المتقدمين</p>
                <p className="text-lg font-bold font-mono text-foreground leading-tight">{totalCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">قيد التدقيق التقني</p>
                <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 leading-tight">{reviewCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">المقابلات المجدولة</p>
                <p className="text-lg font-bold font-mono text-primary leading-tight">{interviewCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">المقبولين / العروض</p>
                <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 leading-tight">{acceptedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Search filter & Vacancy info badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative max-w-sm w-full">
            <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم المرشح، الجامعة، أو المهارة..."
              className="w-full h-9 pr-9 pl-3 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {currentVacancy && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>نمط العمل: </span>
                <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase">
                  {currentVacancy.workType === "hybrid" ? "هجين (Hybrid)" : currentVacancy.workType === "onsite" ? "حضوري (On-site)" : "عن بُعد (Remote)"}
                </Badge>
              </span>
              <span>•</span>
              <span>المقاعد الشاغرة: <strong className="text-foreground">{currentVacancy.slots}</strong></span>
              <span>•</span>
              <span>آخر موعد: <strong className="text-foreground">{currentVacancy.deadline}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. KANBAN BOARD (لوحة كانبان بـ 4 أعمدة رئيسية)
          ========================================================================= */}
      <div className="flex xl:grid xl:grid-cols-4 gap-4 items-start overflow-x-auto pb-4 snap-x min-w-0">
        {KANBAN_COLUMNS.map((col) => {
          const columnCandidates = columnsData[col.id as keyof typeof columnsData] || [];
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`min-w-[280px] sm:min-w-[320px] xl:min-w-0 flex-1 snap-center rounded-xl border transition-all duration-150 flex flex-col min-h-[520px] ${
                isOver
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-secondary/20"
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-border bg-card/60 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-foreground">{col.title}</h3>
                  <Badge variant={col.badgeVariant} className="text-[10px] py-0 px-1.5 font-mono">
                    {columnCandidates.length}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {col.description}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {columnCandidates.length === 0 ? (
                  <div className="h-32 border border-dashed border-border/80 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                    <p className="text-xs text-muted-foreground">لا يوجد مرشحون حالياً</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-0.5">اسحب وأفلت بطاقة المرشح هنا</p>
                  </div>
                ) : (
                  columnCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id)}
                      className="group rounded-xl border border-border bg-card p-3.5 space-y-3 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing"
                    >
                      {/* Card Header: Avatar, Name, Drag Handle */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {candidate.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {candidate.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {candidate.university}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono font-bold">
                            {candidate.readinessScore}%
                          </Badge>
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground" />
                        </div>
                      </div>

                      {/* Top 3 Verified Skills */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {candidate.topSkills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Interview details preview if scheduled */}
                      {candidate.status === "interview_scheduled" && candidate.interviewDetails && (
                        <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 text-[10px] space-y-1">
                          <div className="flex items-center justify-between text-primary font-semibold">
                            <span>مقابلة {candidate.interviewDetails.type === "technical" ? "تقنية" : "عامة"}</span>
                            <span>{candidate.interviewDetails.date}</span>
                          </div>
                          <div className="text-muted-foreground truncate">
                            {candidate.interviewDetails.time} · <a href={candidate.interviewDetails.meetingUrl} target="_blank" rel="noreferrer" className="underline text-primary">رابط Meet</a>
                          </div>
                        </div>
                      )}

                      {/* Card Actions Footer */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-1 text-xs">
                        {/* Quick Action Icons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setQuickPreviewCandidate(candidate)}
                            title="معاينة سريعة"
                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveOutreachCandidate(candidate)}
                            title="مراسلة مباشرة"
                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveInterviewCandidate(candidate)}
                            title="جدولة مقابلة"
                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Quick Decision / Reject */}
                        <button
                          type="button"
                          onClick={() => setActiveDecisionCandidate(candidate)}
                          className="text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        >
                          تحديد القرار ▾
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          3. MODALS AND DRAWERS
          ========================================================================= */}

      {/* Schedule Interview Modal */}
      {activeInterviewCandidate && currentVacancy && (
        <ScheduleInterviewModal
          candidate={activeInterviewCandidate}
          vacancyTitle={currentVacancy.title}
          onClose={() => setActiveInterviewCandidate(null)}
          onScheduled={(details) => {
            handleMoveStatus(activeInterviewCandidate.id, "interview_scheduled", {
              interviewDetails: details,
            });
          }}
        />
      )}

      {/* Feedback Decision Modal */}
      {activeDecisionCandidate && currentVacancy && (
        <FeedbackDecisionModal
          candidate={activeDecisionCandidate}
          vacancyTitle={currentVacancy.title}
          onClose={() => setActiveDecisionCandidate(null)}
          onDecision={(decision, feedback, reason) => {
            handleMoveStatus(activeDecisionCandidate.id, decision, {
              constructiveFeedback: feedback,
              rejectionReason: reason,
            });
          }}
        />
      )}

      {/* Candidate Outreach Direct Messages Drawer */}
      {activeOutreachCandidate && (
        <CandidateOutreachDrawer
          candidate={activeOutreachCandidate}
          onClose={() => setActiveOutreachCandidate(null)}
        />
      )}

      {/* Quick Preview Modal */}
      {quickPreviewCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">معاينة ملف المرشح السريعة</h3>
              <button
                onClick={() => setQuickPreviewCandidate(null)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center">
                  {quickPreviewCandidate.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{quickPreviewCandidate.name}</h4>
                  <p className="text-muted-foreground">{quickPreviewCandidate.major} · {quickPreviewCandidate.university}</p>
                  <p className="text-[11px] font-semibold text-primary mt-0.5">المعدل التراكمي: {quickPreviewCandidate.gpa.toFixed(2)} / 4.00</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border space-y-1.5">
                <span className="font-semibold text-foreground">المهارات المعتمدة:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {quickPreviewCandidate.topSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/company/talents/${quickPreviewCandidate.id}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>عرض الملف الكامل الموثق</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                <Button
                  size="sm"
                  onClick={() => {
                    setActiveOutreachCandidate(quickPreviewCandidate);
                    setQuickPreviewCandidate(null);
                  }}
                  className="text-xs gap-1 h-8"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>بدء محادثة</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Vacancy Modal */}
      {showNewVacancyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <span>إضافة شاغر تدريبي جديد</span>
              </h3>
              <button
                onClick={() => setShowNewVacancyModal(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVacancy} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">مسمى الشاغر التدريبي:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: متدرب هندسة الواجهات الأمامية (Next.js)"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">نمط العمل:</label>
                  <select
                    value={newWorkType}
                    onChange={(e) => setNewWorkType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="hybrid">هجين (Hybrid)</option>
                    <option value="onsite">حضوري (On-site)</option>
                    <option value="remote">عن بُعد (Remote)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">عدد المقاعد الشاغرة:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">المتطلبات والتقنيات (مفصولة بفواصل):</label>
                <input
                  type="text"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="مثال: React, TypeScript, Tailwind, Git"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewVacancyModal(false)}
                  disabled={creatingVacancy}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={creatingVacancy || !newTitle.trim()}>
                  {creatingVacancy ? "جاري الإضافة..." : "حفظ ونشر الشاغر"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
