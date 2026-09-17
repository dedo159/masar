"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  X,
  Mail,
  Building2,
  RotateCcw,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { TalentCandidate } from "@/app/api/company/talents/route";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const DEFAULT_POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Docker",
  "PostgreSQL",
  "SQL",
  "Python",
  "Java",
  "Flutter",
  "Kubernetes",
  "Tailwind CSS",
  "AWS",
  "Go",
];

export default function TalentSearchPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
  const [skillCounts, setSkillCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minReadiness, setMinReadiness] = useState<number>(0);
  const [minGpa, setMinGpa] = useState<number>(2.0);
  const [selectedStandings, setSelectedStandings] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"readiness" | "gpa" | "credits" | "name">("readiness");

  // Bookmarking & Preview Modal States
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [previewCandidate, setPreviewCandidate] = useState<TalentCandidate | null>(null);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  // Load candidates from API
  useEffect(() => {
    async function loadTalents() {
      try {
        const res = await fetch("/api/company/talents");
        const data = await res.json();
        if (data.success) {
          setCandidates(data.talents);
          setSkillCounts(data.skillCounts);
        }
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTalents();

    // Load bookmarks from local storage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("masar_company_bookmarked_talents");
        if (saved) setBookmarkedIds(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save bookmarks
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("masar_company_bookmarked_talents", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleStanding = (standing: string) => {
    setSelectedStandings((prev) =>
      prev.includes(standing) ? prev.filter((s) => s !== standing) : [...prev, standing]
    );
  };

  const toggleWorkType = (wt: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(wt) ? prev.filter((w) => w !== wt) : [...prev, wt]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setMinReadiness(0);
    setMinGpa(2.0);
    setSelectedStandings([]);
    setSelectedWorkTypes([]);
    setShowBookmarksOnly(false);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedSkills.length > 0 ||
    minReadiness > 0 ||
    minGpa > 2.0 ||
    selectedStandings.length > 0 ||
    selectedWorkTypes.length > 0 ||
    showBookmarksOnly;

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => {
        // 1. Text Search: name, role, skills, university, major
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matchName = candidate.name.toLowerCase().includes(q);
          const matchRole = candidate.targetRole.toLowerCase().includes(q);
          const matchUniv = candidate.university.toLowerCase().includes(q);
          const matchMajor = candidate.major.toLowerCase().includes(q);
          const matchSkill = candidate.verifiedSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchRole && !matchUniv && !matchMajor && !matchSkill) {
            return false;
          }
        }

        // 2. Bookmarked filter
        if (showBookmarksOnly && !bookmarkedIds.includes(candidate.id)) {
          return false;
        }

        // 3. Readiness Score filter
        if (candidate.readinessScore < minReadiness) {
          return false;
        }

        // 4. GPA filter
        if (candidate.gpa < minGpa) {
          return false;
        }

        // 5. Academic Standing filter
        if (selectedStandings.length > 0) {
          if (!selectedStandings.includes(candidate.academicStanding)) {
            return false;
          }
        }

        // 6. Work Types filter
        if (selectedWorkTypes.length > 0) {
          const hasMatchingType = selectedWorkTypes.some((wt) =>
            candidate.workTypes.includes(wt as any)
          );
          if (!hasMatchingType) return false;
        }

        // 7. Verified Skills filter (Must have all selected skills)
        if (selectedSkills.length > 0) {
          const hasAllSkills = selectedSkills.every((reqSkill) =>
            candidate.verifiedSkills.some(
              (s) => s.toLowerCase() === reqSkill.toLowerCase()
            )
          );
          if (!hasAllSkills) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "readiness") return b.readinessScore - a.readinessScore;
        if (sortBy === "gpa") return b.gpa - a.gpa;
        if (sortBy === "credits") return b.completedCredits - a.completedCredits;
        if (sortBy === "name") return a.name.localeCompare(b.name, "ar");
        return 0;
      });
  }, [
    candidates,
    searchQuery,
    selectedSkills,
    minReadiness,
    minGpa,
    selectedStandings,
    selectedWorkTypes,
    showBookmarksOnly,
    bookmarkedIds,
    sortBy,
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 px-2 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>محرك استقطاب الكفاءات المعتمدة • Talent Search</span>
              </div>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                جاهزية الذكاء الاصطناعي 2026
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              البحث والفرز الذكي لمرشحي الوظائف والتدريب
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              استكشف طلاب الجامعات المتميزين والمطابقين للمهارات التقنية، مفحوصين بناءً على مشاريع GitHub ومؤشرات الجاهزية.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowBookmarksOnly((prev) => !prev)}
              className={`min-h-[40px] px-3.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                showBookmarksOnly
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {showBookmarksOnly ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span>المحفوظات ({bookmarkedIds.length})</span>
            </button>

            <button
              onClick={() => setSidebarOpenMobile((prev) => !prev)}
              className="md:hidden min-h-[40px] px-3 rounded-lg border border-border bg-card text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>الفلاتر ({selectedSkills.length + (minReadiness > 0 ? 1 : 0) + (minGpa > 2.0 ? 1 : 0)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Search & Workspace Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row gap-6 items-start">
        {/* ============================================================ */}
        {/* SIDEBAR FILTERS (لوحة الفلاتر الجانبية)                         */}
        {/* ============================================================ */}
        <aside
          className={`w-full md:w-72 shrink-0 space-y-5 transition-all duration-200 ${
            sidebarOpenMobile ? "block" : "hidden md:block"
          }`}
        >
          {/* Header of Sidebar */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>فلاتر البحث الدقيقة</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>إعادة ضبط</span>
                </button>
              )}
            </div>

            {/* Filter 1: Career Readiness Score Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span>الحد الأدنى للجاهزية:</span>
                </span>
                <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px]">
                  {minReadiness > 0 ? `${minReadiness}%+` : "الكل"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-secondary rounded-lg"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                <button
                  onClick={() => setMinReadiness(0)}
                  className={`hover:text-foreground cursor-pointer ${minReadiness === 0 ? "font-bold text-foreground" : ""}`}
                >
                  0%
                </button>
                <button
                  onClick={() => setMinReadiness(75)}
                  className={`hover:text-foreground cursor-pointer ${minReadiness === 75 ? "font-bold text-primary" : ""}`}
                >
                  +75% (مؤهل)
                </button>
                <button
                  onClick={() => setMinReadiness(85)}
                  className={`hover:text-foreground cursor-pointer ${minReadiness === 85 ? "font-bold text-primary" : ""}`}
                >
                  +85% (جاهز)
                </button>
                <button
                  onClick={() => setMinReadiness(90)}
                  className={`hover:text-foreground cursor-pointer ${minReadiness === 90 ? "font-bold text-primary" : ""}`}
                >
                  +90% (نخبة)
                </button>
              </div>
            </div>

            {/* Filter 2: GPA Slider */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-blue-600" />
                  <span>الحد الأدنى للمعدل التراكمي:</span>
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[11px]">
                  {minGpa > 2.0 ? `${minGpa.toFixed(2)}+` : "الكل (2.00)"}
                </span>
              </div>
              <input
                type="range"
                min="2.00"
                max="3.90"
                step="0.05"
                value={minGpa}
                onChange={(e) => setMinGpa(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-secondary rounded-lg"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>2.00</span>
                <span>2.75 (جيد)</span>
                <span>3.50 (امتياز)</span>
                <span>4.00</span>
              </div>
            </div>

            {/* Filter 3: Academic Standing (حالة الطالب الأكاديمية) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-foreground">
                حالة الطالب الأكاديمية والساعات:
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "internship_ready", label: "جاهز للتدريب (90+ ساعة)", icon: Briefcase },
                  { id: "fresh_graduate", label: "خريج جديد (120+ ساعة)", icon: GraduationCap },
                  { id: "third_year", label: "طالب سنة ثالثة", icon: UserCheck },
                ].map((item) => {
                  const checked = selectedStandings.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        checked
                          ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                          : "border-transparent hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStanding(item.id)}
                          className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                        />
                        <span>{item.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 4: Work Type (نوع الدوام المناسب) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-foreground">
                نوع الدوام المتاح:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "internship", label: "تدريب ميداني" },
                  { id: "full_time", label: "دوام كامل" },
                  { id: "part_time", label: "دوام جزئي" },
                ].map((wt) => {
                  const checked = selectedWorkTypes.includes(wt.id);
                  return (
                    <button
                      key={wt.id}
                      type="button"
                      onClick={() => toggleWorkType(wt.id)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        checked
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {wt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 5: Verified Skills Badges (المهارات المعتمدة مع العداد) */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  المهارات البرمجية المعتمدة:
                </label>
                {selectedSkills.length > 0 && (
                  <button
                    onClick={() => setSelectedSkills([])}
                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    مسح المهارات
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pr-1">
                {DEFAULT_POPULAR_SKILLS.map((skill) => {
                  const count = skillCounts[skill] || 0;
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs scale-102"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border/80"
                      }`}
                    >
                      <span>{skill}</span>
                      <span
                        className={`text-[9px] px-1 rounded-full ${
                          isSelected
                            ? "bg-black/20 text-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN TALENT SEARCH & RESULTS AREA (شبكة المرشحين)             */}
        {/* ============================================================ */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Smart Search Bar & Sorting Bar */}
          <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، المسمى الوظيفي (Frontend, DevOps), أو المهارة (React, Docker, Java)..."
                  className="pr-10 pl-9 min-h-[42px] text-xs bg-background/50 border-border focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="hidden sm:inline text-muted-foreground text-[11px]">ترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="min-h-[42px] px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="readiness">الأعلى جاهزية لسوق العمل</option>
                  <option value="gpa">الأعلى معدلاً تراكمياً</option>
                  <option value="credits">الأقرب للتخرج (الساعات)</option>
                  <option value="name">أبجدياً بالاسم</option>
                </select>
              </div>
            </div>

            {/* Active Filters Tags Readout */}
            <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2 pt-1 border-t border-border/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-[11px]">
                  النتائج المطابقة:
                </span>
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[11px]">
                  {filteredCandidates.length} كفاءة تقنية
                </span>

                {selectedSkills.map((sk) => (
                  <Badge
                    key={sk}
                    variant="secondary"
                    className="text-[10px] gap-1 bg-secondary text-foreground cursor-pointer"
                    onClick={() => toggleSkill(sk)}
                  >
                    <span>{sk}</span>
                    <X className="h-3 w-3 hover:text-destructive" />
                  </Badge>
                ))}

                {minReadiness > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-1 text-primary border-primary/30 cursor-pointer"
                    onClick={() => setMinReadiness(0)}
                  >
                    <span>جاهزية: +{minReadiness}%</span>
                    <X className="h-3 w-3" />
                  </Badge>
                )}

                {minGpa > 2.0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-1 text-blue-600 border-blue-500/30 cursor-pointer"
                    onClick={() => setMinGpa(2.0)}
                  >
                    <span>معدل: +{minGpa.toFixed(2)}</span>
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  إلغاء جميع الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Results State */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-8">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-xl border border-border bg-card p-5 animate-pulse space-y-4"
                >
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-xl bg-secondary" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-secondary rounded" />
                      <div className="h-3 w-48 bg-secondary/60 rounded" />
                    </div>
                  </div>
                  <div className="h-10 bg-secondary/40 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-secondary rounded" />
                    <div className="h-6 w-16 bg-secondary rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-foreground">
                لم يتم العثور على مرشحين مطابقين لهذه الفلاتر
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                جرب تخفيض الحد الأدنى لنسبة الجاهزية، أو إزالة بعض المهارات المحددة، أو مسح شريط البحث لمشاهدة جميع الطلاب.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="mt-2 text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>إعادة ضبط كافة الفلاتر</span>
              </Button>
            </div>
          ) : (
            /* Talent Cards Grid (شبكة بطاقات الكفاءات) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCandidates.map((candidate) => {
                const isBookmarked = bookmarkedIds.includes(candidate.id);
                const scoreColor =
                  candidate.readinessScore >= 90
                    ? "text-primary bg-primary/10 border-primary/30"
                    : candidate.readinessScore >= 75
                    ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30"
                    : "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30";

                return (
                  <div
                    key={candidate.id}
                    onClick={() => setPreviewCandidate(candidate)}
                    className="group relative rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top Row: Avatar/Initials + Name + Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Avatar / Initials */}
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/15 to-blue-500/15 border border-primary/20 text-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {candidate.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors truncate">
                              {candidate.name}
                            </h3>
                            {candidate.featured && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                ملف مميز ⭐
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-primary truncate mt-0.5">
                            {candidate.targetRole}
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span className="truncate">{candidate.university}</span>
                            <span>•</span>
                            <span className="truncate">{candidate.major}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(candidate.id, e)}
                        aria-label="حفظ في المفضلة"
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isBookmarked
                            ? "border-primary/40 bg-primary/15 text-primary"
                            : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Metrics Row: Readiness Score Pill + Academic Badges */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* GPA badge */}
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border/80">
                          ⭐ {candidate.gpa.toFixed(2)}
                        </span>

                        {/* Credits / Standing badge */}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60">
                          {candidate.standingLabel}
                        </span>
                      </div>

                      {/* Career Readiness Score Badge */}
                      <div
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono inline-flex items-center gap-1.5 shrink-0 ${scoreColor}`}
                      >
                        <TrendingUp className="h-3 w-3" />
                        <span>{candidate.readinessScore}% جاهزية</span>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {candidate.bio}
                    </p>

                    {/* Verified Skills Tags */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.verifiedSkills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSkill(skill);
                            }}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                              selectedSkills.includes(skill)
                                ? "bg-primary text-primary-foreground border-primary font-bold"
                                : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 border-border"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.verifiedSkills.length > 5 && (
                          <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                            +{candidate.verifiedSkills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border gap-2">
                      <div className="flex items-center gap-2">
                        {candidate.githubUrl && (
                          <a
                            href={candidate.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="GitHub"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {candidate.portfolioUrl && (
                          <a
                            href={candidate.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="المحفظة / الموقع"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-h-[34px] text-xs font-semibold px-2 gap-1 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewCandidate(candidate);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>معاينة سريعة</span>
                        </Button>
                        <Link
                          href={`/company/talents/${candidate.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="min-h-[34px] text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-primary inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
                        >
                          <span>الملف الكامل</span>
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CANDIDATE DOSSIER MODAL (نافذة معاينة ملف المرشح الكاملة)       */}
      {/* ============================================================ */}
      {previewCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setPreviewCandidate(null)}
          dir="rtl"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card text-foreground p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-start gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-primary/30 text-foreground flex items-center justify-center font-bold text-lg shrink-0">
                  {previewCandidate.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-foreground">
                      {previewCandidate.name}
                    </h2>
                    {previewCandidate.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                        مرشح معتمد ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {previewCandidate.targetRole}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {previewCandidate.university} — {previewCandidate.major}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewCandidate(null)}
                className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border bg-secondary/30 text-center">
                <span className="text-[10px] text-muted-foreground block">مؤشر الجاهزية (AI)</span>
                <span className="text-lg font-extrabold font-mono text-primary">
                  {previewCandidate.readinessScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-secondary/30 text-center">
                <span className="text-[10px] text-muted-foreground block">المعدل التراكمي</span>
                <span className="text-lg font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  {previewCandidate.gpa.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-secondary/30 text-center">
                <span className="text-[10px] text-muted-foreground block">الساعات المنجزة</span>
                <span className="text-lg font-extrabold font-mono text-foreground">
                  {previewCandidate.completedCredits} / {previewCandidate.totalCredits}
                </span>
              </div>
            </div>

            {/* AI Career Readiness Audit Report */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>تقرير تدقيق الجاهزية التقنية (Masar AI Engine):</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {previewCandidate.auditSummary}
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground">النبذة المهنية:</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {previewCandidate.bio}
              </p>
            </div>

            {/* Highlights & Projects */}
            {previewCandidate.highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground">أبرز المشاريع والإنجازات المعتمدة:</h4>
                <div className="space-y-1.5">
                  {previewCandidate.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/30 p-2 rounded-lg border border-border/60"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Skills Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">المهارات والتقنيات المعتمدة:</h4>
              <div className="flex flex-wrap gap-1.5">
                {previewCandidate.verifiedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border/80 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {previewCandidate.githubUrl && (
                  <a
                    href={previewCandidate.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[38px] px-3 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold inline-flex items-center gap-1.5 text-foreground transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>مستودعات GitHub</span>
                  </a>
                )}
                {previewCandidate.portfolioUrl && (
                  <a
                    href={previewCandidate.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[38px] px-3 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold inline-flex items-center gap-1.5 text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>محفظة الأعمال</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/company/talents/${previewCandidate.id}`}
                  className="min-h-[38px] px-3.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-primary text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>فتح الملف التفاعلي المباشر (Live Profile)</span>
                </Link>

                <button
                  type="button"
                  onClick={() => toggleBookmark(previewCandidate.id)}
                  className={`min-h-[38px] px-3.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    bookmarkedIds.includes(previewCandidate.id)
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-card border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>
                    {bookmarkedIds.includes(previewCandidate.id) ? "في المفضلة" : "حفظ في المفضلة"}
                  </span>
                </button>

                <a
                  href={`mailto:${previewCandidate.email}?subject=دعوة لمقابلة تدريب / عمل — منصة مسار&body=مرحباً ${previewCandidate.name}،%0D%0A%0D%0Aاطلعنا على ملفك التقني ومشاريعك عبر منصة مسار ونود دعوتك لإجراء مقابلة تقنية بخصوص فرص العمل والتدريب المتاحة لدينا.`}
                  className="min-h-[38px] px-4 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm shadow-sm active:scale-95 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>دعوة لمقابلة وتواصل ✉️</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
