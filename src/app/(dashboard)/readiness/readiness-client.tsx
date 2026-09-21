"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Briefcase, 
  Code2, 
  GitBranch, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Check,
  Clock,
  Zap
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

export function ReadinessClient() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [scanningGithub, setScanningGithub] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);

  // Form State
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [githubUrl, setGithubUrl] = useState("");
  const [githubLanguages, setGithubLanguages] = useState("");
  const [githubReposCount, setGithubReposCount] = useState("");
  const [topProjects, setTopProjects] = useState("");
  const [scannedMeta, setScannedMeta] = useState<{ username?: string; reposCount?: number; languages?: string[] } | null>(null);

  const [result, setResult] = useState<any>(null);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  useEffect(() => {
    // 1. Initial fetch of cached readiness assessment
    fetch("/api/student/readiness")
      .then(res => res.json())
      .then(data => {
        if (data.hasAudit && data.data) {
          setResult(data.data);
          setIsCachedResult(true);
          if (typeof data.cooldownRemainingSeconds === "number") {
            setCooldownRemaining(data.cooldownRemainingSeconds);
          }
        }
      })
      .catch(err => console.warn("Failed to load cached readiness:", err));

    // 2. Initial fetch of profile + automatic GitHub scan
    fetch("/api/student/readiness/scan")
      .then(res => res.json())
      .then(data => {
        if (data.student) setProfile(data.student);
        if (Array.isArray(data.profileSkills)) setProfileSkills(data.profileSkills);
        if (data.githubUrl) setGithubUrl(data.githubUrl);

        if (data.scan) {
          setGithubLanguages(data.scan.languagesString || "");
          setGithubReposCount(String(data.scan.reposCount || 0));
          setTopProjects(data.scan.topProjects || "");
          setScannedMeta({
            username: data.scan.username,
            reposCount: data.scan.reposCount,
            languages: data.scan.languages
          });
        }
        setFetchingProfile(false);
      })
      .catch((err) => {
        console.warn("Auto-scan on mount failed:", err);
        setFetchingProfile(false);
      });
  }, []);

  const handleManualScan = async (overrideUrl?: string) => {
    const urlToScan = (overrideUrl !== undefined ? overrideUrl : githubUrl).trim();
    if (!urlToScan) {
      alert("يرجى إدخال اسم مستخدم أو رابط حساب GitHub");
      return;
    }

    setScanningGithub(true);
    try {
      const res = await fetch("/api/student/readiness/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: urlToScan, skills: profileSkills })
      });

      const data = await res.json();
      if (data.scan) {
        setGithubLanguages(data.scan.languagesString || "");
        setGithubReposCount(String(data.scan.reposCount || 0));
        setTopProjects(data.scan.topProjects || "");
        setScannedMeta({
          username: data.scan.username,
          reposCount: data.scan.reposCount,
          languages: data.scan.languages
        });
      }
    } catch (err: any) {
      console.error("Manual scan error:", err);
      alert(`حدث خطأ أثناء فحص الحساب: ${err.message}`);
    } finally {
      setScanningGithub(false);
    }
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudit = async (force: boolean = false) => {
    setLoading(true);
    setNotice(null);
    try {
      const completedCourses = profile?.completedCredits > 0 
        ? t.readinessclient.key_kgt7q3
        : t.readinessclient.key_kt4wl5;
      
      const payload = {
        force,
        target_role: targetRole,
        completed_courses_list: completedCourses,
        gpa: profile?.gpa || 3.0,
        completed_credit_hours: profile?.completedCredits || 90,
        total_credit_hours: profile?.totalCredits || 132,
        github_languages: githubLanguages,
        github_repos_count: githubReposCount,
        top_projects_descriptions: topProjects,
        self_declared_skills: profileSkills.length > 0 ? profileSkills.join(", ") : githubLanguages
      };

      const res = await fetch("/api/student/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) { 
        const errorData = await res.json().catch(() => ({})); 
        throw new Error(errorData.error || `فشل في جلب التقييم: HTTP ${res.status}`); 
      }
      const data = await res.json();
      setResult(data);
      setIsCachedResult(Boolean(data.cached));
      if (data.notice) setNotice(data.notice);
      if (typeof data.cooldownRemainingSeconds === "number") {
        setCooldownRemaining(data.cooldownRemainingSeconds);
      }
    } catch (error: any) {
      console.error(error);
      alert(`حدث خطأ أثناء الاتصال بالمدقق الآلي: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <>
      <PageHeader
        title={t.readinessclient.key_toyy3w}
        subtitle={t.readinessclient.key_mjhxrk}
      />
      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Input Form Column */}
        <div className="md:col-span-5 space-y-5">
          <div className="apple-glass-card p-6 shadow-xl space-y-5">
            <div className="pb-4 border-b border-white/10 space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>{t.readinessclient.key_t1qqxv}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                يتم استخراج لغات ومشاريع GitHub ومهاراتك المعتمدة تلقائياً من حسابك لتقييم دقيق.
              </p>
            </div>

            <div className="space-y-4">
              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.readinessclient.key_ywqfcx}</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="flex h-11 min-h-[44px] w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <option value="Software Engineer" className="bg-[#0f172a] text-white">{t.readinessclient.key_oc39qi}</option>
                  <option value="Frontend Developer" className="bg-[#0f172a] text-white">{t.readinessclient.key_dxblft}</option>
                  <option value="Backend Developer" className="bg-[#0f172a] text-white">{t.readinessclient.key_iwjtu4}</option>
                  <option value="Full Stack Developer" className="bg-[#0f172a] text-white">{t.readinessclient.key_sxnr1z}</option>
                  <option value="Mobile App Developer" className="bg-[#0f172a] text-white">{t.readinessclient.key_ret7r9}</option>
                  <option value="UI/UX Designer" className="bg-[#0f172a] text-white">{t.readinessclient.key_4qr617}</option>
                  <option value="Data Analyst" className="bg-[#0f172a] text-white">{t.readinessclient.key_1puped}</option>
                  <option value="Data Scientist" className="bg-[#0f172a] text-white">{t.readinessclient.key_v07ldw}</option>
                  <option value="DevOps Engineer" className="bg-[#0f172a] text-white">{t.readinessclient.key_wo3szo}</option>
                  <option value="Cybersecurity Analyst" className="bg-[#0f172a] text-white">{t.readinessclient.key_czkscp}</option>
                  <option value="AI/Machine Learning Engineer" className="bg-[#0f172a] text-white">{t.readinessclient.key_tgrs1e}</option>
                  <option value="Systems Analyst" className="bg-[#0f172a] text-white">{t.readinessclient.key_7glvz5}</option>
                  <option value="Cloud Architect" className="bg-[#0f172a] text-white">{t.readinessclient.key_gosnwx}</option>
                </select>
              </div>

              {/* GitHub Auto-Sync Box */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    المزامنة التلقائية مع GitHub
                  </span>
                  {scannedMeta?.username && (
                    <Badge variant="outline" className="text-[11px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30 gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      متصل: @{scannedMeta.username}
                    </Badge>
                  )}
                </div>

                {scannedMeta ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 bg-white/[0.04] p-3 rounded-xl border border-white/10">
                      <span>المستودعات: <strong className="text-white font-bold">{githubReposCount || 0}</strong></span>
                      <span>اللغات الأساسية: <strong className="text-white font-bold">{githubLanguages || "مكتشفة"}</strong></span>
                    </div>
                    {topProjects && (
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                        <span className="text-[11px] font-bold text-slate-300 block mb-1">
                          أبرز المشاريع المستخرجة:
                        </span>
                        <p className="text-white leading-relaxed text-[11px] max-h-24 overflow-y-auto">
                          {topProjects}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-end pt-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={scanningGithub}
                        onClick={() => handleManualScan()}
                        className="h-7 text-xs gap-1.5 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg flex-shrink-0"
                      >
                        <RefreshCw className={`w-3 h-3 ${scanningGithub ? "animate-spin" : ""}`} />
                        <span>إعادة فحص وتحديث</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-300">
                      أدخل رابط أو اسم مستخدم GitHub لفحص مشاريعك ولغاتك تلقائياً:
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="text-xs h-10 bg-white/[0.06] border-white/15 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-xl"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleManualScan()}
                        disabled={scanningGithub}
                        className="h-10 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex-shrink-0 px-3.5 shadow-md"
                      >
                        {scanningGithub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>فحص</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Skills Box */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    المهارات في ملفك الشخصي
                  </span>
                  <Link href="/profile" className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold hover:underline">
                    تعديل في الملف
                  </Link>
                </div>

                {profileSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profileSkills.map((skill, idx) => (
                      <span key={idx} className="text-[11px] font-medium py-1 px-2.5 bg-white/[0.06] border border-white/12 text-slate-200 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 pt-1">
                    لم تقم بإضافة مهارات في ملفك بعد. يمكنك إضافتها من صفحة الملف الشخصي لتعزيز دقة التقييم.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Button 
                onClick={() => handleAudit(false)} 
                disabled={loading || fetchingProfile || scanningGithub} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold h-12 text-sm rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 ml-2 animate-spin" />
                    {t.readinessclient.key_sfodt2}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 ml-2" />
                    {result ? "إعادة فحص الجاهزية" : "بدء التدقيق المهني الذكي"}
                  </>
                )}
              </Button>

              {cooldownRemaining > 0 && (
                <div className="w-full flex items-center justify-between text-xs text-slate-300 px-1 pt-0.5">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    فترة التبريد نشطة ({formatCooldown(cooldownRemaining)})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAudit(true)}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    فحص مباشر فوري
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="md:col-span-7">
          {!result && !loading && (
            <div className="apple-glass-card h-full min-h-[420px] flex flex-col items-center justify-center text-center p-8 border-dashed shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-blue-400 mb-4 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.readinessclient.key_uietee}</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
                {t.readinessclient.key_nb66j7}
              </p>
            </div>
          )}

          {loading && (
            <div className="apple-glass-card h-full min-h-[420px] flex flex-col items-center justify-center text-center p-8 border-dashed shadow-xl">
              <div className="relative mb-4">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
              </div>
              <h3 className="text-lg font-bold text-white mt-4">{t.readinessclient.key_rsmy05}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm">
                {t.readinessclient.key_hbomh7}
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Notice or Cache banner */}
              {notice && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 font-medium">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{notice}</span>
                </div>
              )}
              {isCachedResult && !notice && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300">
                  <span className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    تم استرجاع تقييمك المحفوظ مسبقاً لحفظ رصيد الذكاء الاصطناعي
                  </span>
                  {cooldownRemaining > 0 && (
                    <span className="text-[11px] opacity-90 font-mono">
                      متاح التحديث بعد: {formatCooldown(cooldownRemaining)}
                    </span>
                  )}
                </div>
              )}

              {/* 1. Score Card */}
              <div className="apple-glass-card p-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <p className="text-xs font-bold text-slate-300 mb-1.5">{t.readinessclient.key_52yk5p}</p>
                    <h2 className="text-4xl font-extrabold text-white flex items-center gap-3">
                      <span className="font-mono bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        {result.readiness_score}%
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-400/35 font-bold text-xs px-3.5 py-1 rounded-full shadow-xs">
                        {result.readiness_status}
                      </span>
                    </h2>
                  </div>
                  <div className="w-full md:w-1/2">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {result.strengths_summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Verified Skills (المهارات المعتمدة عملياً) */}
              <div className="apple-glass-card p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {t.readinessclient.key_eys6lg}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
                    {result.verified_skills?.length || 0} مهارة موثقة
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {result.verified_skills?.map((skill: string, i: number) => (
                    <span 
                      key={i} 
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs px-3.5 py-1.5 rounded-xl font-semibold shadow-xs flex items-center gap-2 transition-all cursor-default"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Critical Gaps (الفجوات الحرجة) */}
              <div className="apple-glass-card p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {t.readinessclient.key_75megy}
                  </h3>
                </div>

                <div className="space-y-3">
                  {result.critical_gaps?.map((gap: any, i: number) => (
                    <div key={i} className="flex gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${gap.priority === 'High' ? 'bg-red-400 shadow-[0_0_10px_#f87171] animate-pulse' : gap.priority === 'Medium' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{gap.skill}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                          {gap.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Actionable Next Step (آخر بطاقة: الخطوات القادمة المقترحة) */}
              <div className="apple-glass-card p-6 border border-blue-500/35 bg-gradient-to-br from-blue-900/30 via-slate-900/70 to-[#0b152d]/95 relative overflow-hidden shadow-2xl">
                {/* Ambient soft blue glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {t.readinessclient.key_n3bmys}
                        </h3>
                        <span className="text-[11px] text-blue-300 font-medium">
                          توصية مخصصة لرفع جاهزيتك لسوق العمل
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full">
                      مشروع مقترح
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.05] border border-white/12 space-y-3.5">
                    <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
                      {result.actionable_next_step.recommended_project}
                    </p>
                    
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-xl shadow-xs">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>{t.readinessclient.key_a06ono} {result.actionable_next_step.project_impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        </div>
      </div>
    </>
  );
}