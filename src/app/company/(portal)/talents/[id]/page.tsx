"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  GitCommit,
  FolderGit2,
  Award,
  Mail,
  Phone,
  Building2,
  Calendar,
  Send,
  X,
  Code2,
  BookOpen,
  Star,
  Copy,
  Check,
  ShieldCheck,
  FileCode2,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DetailedTalentCandidate } from "@/lib/talents-service";

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

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const candidateId = resolvedParams.id;

  const [candidate, setCandidate] = useState<DetailedTalentCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Readme preview active project
  const [expandedReadme, setExpandedReadme] = useState<string | null>(null);

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [interviewType, setInterviewType] = useState<"remote" | "onsite">("remote");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [inviteNotes, setInviteNotes] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/company/talents/${candidateId}`);
        const data = await res.json();
        if (!res.ok || !data.candidate) {
          throw new Error(data.error || "تعذر العثور على ملف المرشح");
        }
        setCandidate(data.candidate);
        // Default first project readme preview opened
        if (data.candidate.topProjects?.length > 0) {
          setExpandedReadme(data.candidate.topProjects[0].id);
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل الملف التعريفي");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [candidateId]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteModal(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full py-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse">
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 animate-pulse space-y-6">
          <div className="flex gap-5 items-center">
            <div className="h-20 w-20 rounded-2xl bg-muted"></div>
            <div className="space-y-3 flex-1">
              <div className="h-6 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
            </div>
          </div>
          <div className="h-32 bg-muted/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold">{error || "لم يتم العثور على المرشح"}</h2>
        <p className="text-sm text-muted-foreground">
          قد يكون الملف المطلوب غير موجود أو تم نقل معرف المرشح.
        </p>
        <div className="pt-4">
          <Button onClick={() => router.push("/company/talents")}>
            العودة إلى محرك الكفاءات
          </Button>
        </div>
      </div>
    );
  }

  // Color theme according to readiness score
  const isHigh = candidate.aiAudit.readinessScore >= 90;
  const isMedium = candidate.aiAudit.readinessScore >= 75 && !isHigh;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          <span>العودة إلى استقطاب الكفاءات (Talent Search)</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2.5 py-1 bg-background">
            معرّف المرشح: {candidate.id}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs px-2.5 py-1 text-primary bg-primary/10 border border-primary/20"
          >
            <ShieldCheck className="h-3 w-3 ml-1 text-primary inline" />
            بيانات مدققة وموثقة رسمياً
          </Badge>
        </div>
      </div>

      {/* =========================================================================
          1. HEADER SECTION (رأس الصفحة)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Candidate Identity */}
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-secondary text-foreground font-bold text-2xl md:text-3xl flex items-center justify-center border border-border shadow-xs">
                {candidate.avatar ? (
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="h-full w-full object-cover rounded-2xl"
                  />
                ) : (
                  candidate.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              {candidate.featured && (
                <div
                  className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white p-1 rounded-full shadow-md"
                  title="مرشح مميز"
                >
                  <Star className="h-3.5 w-3.5 fill-white" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {candidate.name}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-secondary text-foreground border-border text-xs font-semibold px-2.5 py-0.5"
                >
                  {candidate.standingLabel}
                </Badge>
              </div>

              <p className="text-base font-semibold text-primary">
                {candidate.targetRole}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  {candidate.major}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {candidate.university}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  المعدل: {candidate.gpa.toFixed(2)} / 4.00
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Quick Social Links */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto self-stretch md:self-center">
            {/* Quick Links: GitHub & LinkedIn */}
            <div className="flex items-center gap-2 justify-center">
              {candidate.githubUrl && (
                <a
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-3.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
                  title="مستودع GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}

              {candidate.linkedInUrl && (
                <a
                  href={candidate.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-3.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
                  title="حساب LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4 text-[#0077b5]" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}

              {candidate.portfolioUrl && (
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-3.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
                  title="المحفظة الشخصية"
                >
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">Portfolio</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={() => setShowInviteModal(true)}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>دعوة لمقابلة / تواصل</span>
            </Button>
          </div>
        </div>

        {/* Bio quote / snapshot */}
        {candidate.bio && (
          <div className="mt-6 pt-5 border-t border-border/80">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {candidate.bio}
            </p>
          </div>
        )}

        {/* Verified skills tags */}
        <div className="mt-4 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground ml-2">
            المهارات المعتمدة:
          </span>
          {candidate.verifiedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs font-mono py-0.5 px-2 bg-secondary/70 hover:bg-secondary text-secondary-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. AI AUDIT SUMMARY (بطاقة تدقيق الذكاء الاصطناعي مع إطار متوهج مضيء)
          ========================================================================= */}
      <div className="relative rounded-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs transition-all">
        {/* Ambient Top Glow Line */}
        <div className="absolute -top-px right-10 left-10 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </span>
              <h2 className="text-lg font-bold text-foreground">
                تدقيق الذكاء الاصطناعي والجاهزية لسوق العمل (AI Audit Summary)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              تحليل تلقائي معتمد يفحص جودة الكود، أسلوب كتابة الاختبارات، والمشاريع البرمجية المنشورة على GitHub.
            </p>
          </div>

          {/* Readiness Score Gauge Badge */}
          <div className="flex items-center gap-4 bg-background/80 backdrop-blur-xs border border-border px-5 py-3 rounded-2xl shadow-inner">
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground font-medium">مؤشر الجاهزية المعتمد</div>
              <div className="text-xl md:text-2xl font-black font-mono text-primary">
                {candidate.aiAudit.marketReadinessLabel}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center font-bold text-sm text-foreground">
              {candidate.aiAudit.readinessScore}%
            </div>
          </div>
        </div>

        {/* Content: Strengths (3 lines) & Skill Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* 3-Line Technical Strengths */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>ملخص نقاط القوة الهندسية (Core Strengths):</span>
              </h3>
              <span className="text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">
                {candidate.aiAudit.recommendationLevel}
              </span>
            </div>

            <ul className="space-y-2.5">
              {candidate.aiAudit.threeLineStrengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="text-xs md:text-sm leading-relaxed p-3 rounded-xl bg-secondary/30 border border-border/70 flex items-start gap-3 text-foreground"
                >
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-background/50 border border-border text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">خلاصة التدقيق: </span>
              {candidate.aiAudit.overallAssessment}
            </div>
          </div>

          {/* Skill Gaps (الفجوات التقنية الحالية) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>فجوات التطوير والمهارات المستهدفة (Skill Gaps):</span>
            </h3>

            <div className="space-y-3">
              {candidate.aiAudit.skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground font-mono">
                      {gap.skill}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 border ${
                        gap.impact === "مرتفع"
                          ? "border-destructive/40 text-destructive bg-destructive/10"
                          : gap.impact === "متوسط"
                          ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                          : "border-muted-foreground/40 text-muted-foreground"
                      }`}
                    >
                      تأثير {gap.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {gap.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. VERIFIED CODE PROOF & GITHUB SECTION (قسم المشاريع و GitHub)
          ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              <span>إثبات الكود ومشاريع GitHub المعتمدة (Verified Code Proof)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              سجل برمجي تم فحصه ومطابقته مباشرة عبر GitHub API
            </p>
          </div>
        </div>

        {/* GitHub Quick Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-primary" />
              <span>المستودعات العامة</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {candidate.gitHubProof.publicRepos}
            </div>
            <div className="text-[11px] text-muted-foreground">مستودع كود مفحوص</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <GitCommit className="h-3.5 w-3.5 text-primary" />
              <span>المساهمات خلال العام</span>
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              {candidate.gitHubProof.totalCommitsPastYear}+
            </div>
            <div className="text-[11px] text-muted-foreground">Commits في مستودعات نشطة</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>أطول سلسلة التزام متواصلة</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {candidate.gitHubProof.commitStreakDays} يوم
            </div>
            <div className="text-[11px] text-muted-foreground">Daily Active Streak</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>تقييم جودة وهندسة الكود</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {candidate.gitHubProof.codeQualityRating}
            </div>
            <div className="text-[11px] text-primary font-medium">Clean Code & Tests</div>
          </div>
        </div>

        {/* Top Languages Distribution Bar */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>توزيع لغات البرمجة الأكثر استخداماً (Top Languages):</span>
            <span className="text-muted-foreground font-mono">100% Verified</span>
          </div>

          {/* Color bar */}
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex">
            {candidate.gitHubProof.topLanguages.map((lang, idx) => (
              <div
                key={idx}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                title={`${lang.name}: ${lang.percentage}%`}
                className="h-full transition-all"
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap pt-1 text-xs">
            {candidate.gitHubProof.topLanguages.map((lang, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-medium text-foreground">{lang.name}</span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  ({lang.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 2 Featured Projects Cards with README preview */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-foreground">
            أبرز مشروعين معتمدين (Featured Projects & Architecture):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidate.topProjects.map((project) => {
              const isReadmeOpen = expandedReadme === project.id;
              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border bg-card flex flex-col justify-between overflow-hidden hover:border-primary/40 transition-all shadow-xs"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-foreground">
                          {project.title}
                        </h4>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {project.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {project.stars !== undefined && (
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-md">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {project.stars}
                          </span>
                        )}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="رابط المستودع المباشر على GitHub"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Architecture Highlights */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-foreground">
                        أبرز الحلول المعمارية المطبقة:
                      </div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {project.architectureHighlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-primary mt-1">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      {project.languages.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-[10px] font-mono py-0.5 px-2 bg-secondary/80"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* README preview toggle and drawer */}
                  <div className="border-t border-border bg-secondary/20 p-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setExpandedReadme(isReadmeOpen ? null : project.id)
                        }
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <FileCode2 className="h-3.5 w-3.5" />
                        <span>
                          {isReadmeOpen ? "إخفاء توثيق الـ README" : "معاينة توثيق الـ README"}
                        </span>
                      </button>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
                      >
                        <span>تصفح الكود</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* README snippet viewer */}
                    {isReadmeOpen && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 max-h-56">
                        <pre className="whitespace-pre-wrap">
                          {project.readmePreview}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. ACADEMIC PROOF SECTION (سجل الإنجاز الأكاديمي)
          ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>سجل الإنجاز الأكاديمي المعتمد (Academic Proof)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              سجل موثق بالدرجات في المواد البرمجية التأسيسية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">الساعات المنجزة</div>
              <div className="text-sm font-bold font-mono text-foreground">
                {candidate.completedCredits} / {candidate.totalCredits} ساعة
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">المعدل التراكمي</div>
              <div className="text-sm font-bold font-mono text-primary">
                {candidate.gpa.toFixed(2)} / 4.00
              </div>
            </div>
          </div>
        </div>

        {/* Academic Note Badge */}
        {candidate.academicProof.academicStandingNote && (
          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border flex items-center gap-3 text-xs text-foreground">
            <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>{candidate.academicProof.academicStandingNote}</span>
          </div>
        )}

        {/* Core Programming Courses Grades Table */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>العلامات المعتمدة في المواد البرمجية الأساسية (Core CS Courses):</span>
            <span className="text-muted-foreground text-[11px]">توثيق التسجيل الجامعي</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs text-right">
              <thead className="bg-secondary/60 text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">رمز المادة</th>
                  <th className="py-2.5 px-4 font-semibold">اسم المساق الأكاديمي</th>
                  <th className="py-2.5 px-4 font-semibold">الفصل</th>
                  <th className="py-2.5 px-4 font-semibold">الساعات</th>
                  <th className="py-2.5 px-4 font-semibold text-center">الدرجة</th>
                  <th className="py-2.5 px-4 font-semibold text-center">النسبة</th>
                  <th className="py-2.5 px-4 font-semibold text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {candidate.academicProof.coreCourses.map((course, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {course.courseCode}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {course.courseName}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {course.semester}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">
                      {course.credits}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/50 text-primary border border-emerald-300 dark:border-emerald-800">
                        {course.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-foreground">
                      {course.score}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
                        <Check className="h-3 w-3" />
                        موثق
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. INTERVIEW INVITATION MODAL (نافذة الدعوة لمقابلة / تواصل)
          ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  دعوة المرشح لمقابلة عمل أو تدريب
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  إرسال دعوة رسمية مباشرة إلى {candidate.name}
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {inviteSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  تم إرسال الدعوة وتجهيز تفاصيل المقابلة بنجاح!
                </h4>
                <p className="text-xs text-muted-foreground">
                  تم إرسال الإشعار إلى بريد المرشح ({candidate.email}) وسيصلك إشعار عند الرد.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvitation} className="space-y-4">
                {/* Candidate contact quick view */}
                <div className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-foreground">{candidate.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(candidate.email)}
                    className="text-primary hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    {copiedEmail ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedEmail ? "تم النسخ" : "نسخ البريد"}</span>
                  </button>
                </div>

                {/* Interview Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    نوع المقابلة:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInterviewType("remote")}
                      className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        interviewType === "remote"
                          ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-primary font-bold"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      عن بُعد (Google Meet / Teams)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterviewType("onsite")}
                      className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        interviewType === "onsite"
                          ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-primary font-bold"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      حضورياً في مقر الشركة
                    </button>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      التاريخ المقترح:
                    </label>
                    <input
                      type="date"
                      required
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      الوقت:
                    </label>
                    <input
                      type="time"
                      required
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    رسالة ترحيبية أو ملاحظات للمرشح:
                  </label>
                  <textarea
                    rows={3}
                    value={inviteNotes}
                    onChange={(e) => setInviteNotes(e.target.value)}
                    placeholder={`مرحباً ${candidate.name}، يسعدنا دعوتك لمقابلة تقنية لمناقشة انضمامك لفريقنا...`}
                    className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border gap-3">
                  <a
                    href={`mailto:${candidate.email}?subject=${encodeURIComponent(
                      `دعوة لمقابلة تقنية — مسار`
                    )}&body=${encodeURIComponent(
                      `عزيزي/عزيزتي ${candidate.name}،\n\nنود دعوتك لمقابلة تقنية.\nالتاريخ: ${interviewDate}\nالوقت: ${interviewTime}\nالنوع: ${
                        interviewType === "remote" ? "عن بُعد" : "في مقر الشركة"
                      }\n\nمع التحية،\nفريق التوظيف`
                    )}`}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
                  >
                    فتح عبر تطبيق البريد
                  </a>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowInviteModal(false)}
                      className="text-xs"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                    >
                      إرسال الدعوة الآن
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
