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
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal
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
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Initial fetch of profile + automatic GitHub scan
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

  const handleAudit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const completedCourses = profile?.completedCredits > 0 
        ? t.readinessclient.key_kgt7q3
        : t.readinessclient.key_kt4wl5;
      
      const payload = {
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
    <div className="space-y-6">
      <PageHeader title={t.readinessclient.key_toyy3w} />
      <p className="text-muted-foreground text-sm mt-2">{t.readinessclient.key_mjhxrk}</p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Form Column */}
        <div className="md:col-span-5 space-y-5">
          <Card className="vercel-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0070f3]" />
                {t.readinessclient.key_t1qqxv}
              </CardTitle>
              <CardDescription>
                يتم استخراج لغات ومشاريع GitHub ومهاراتك المعتمدة تلقائياً من حسابك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {t.readinessclient.key_ywqfcx}
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="flex h-11 min-h-[44px] w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Software Engineer">{t.readinessclient.key_oc39qi}</option>
                  <option value="Frontend Developer">{t.readinessclient.key_dxblft}</option>
                  <option value="Backend Developer">{t.readinessclient.key_iwjtu4}</option>
                  <option value="Full Stack Developer">{t.readinessclient.key_sxnr1z}</option>
                  <option value="Mobile App Developer">{t.readinessclient.key_ret7r9}</option>
                  <option value="UI/UX Designer">{t.readinessclient.key_4qr617}</option>
                  <option value="Data Analyst">{t.readinessclient.key_1puped}</option>
                  <option value="Data Scientist">{t.readinessclient.key_v07ldw}</option>
                  <option value="DevOps Engineer">{t.readinessclient.key_wo3szo}</option>
                  <option value="Cybersecurity Analyst">{t.readinessclient.key_czkscp}</option>
                  <option value="AI/Machine Learning Engineer">{t.readinessclient.key_tgrs1e}</option>
                  <option value="Systems Analyst">{t.readinessclient.key_7glvz5}</option>
                  <option value="Cloud Architect">{t.readinessclient.key_gosnwx}</option>
                </select>
              </div>

              {/* GitHub Auto-Sync Box */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-[#0070f3]" />
                    المزامنة التلقائية مع GitHub
                  </span>
                  {scannedMeta?.username && (
                    <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
                      <Check className="w-3 h-3" />
                      متصل: @{scannedMeta.username}
                    </Badge>
                  )}
                </div>

                {scannedMeta ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/60">
                      <span>المستودعات المرصودة: <strong className="text-foreground">{githubReposCount || 0}</strong></span>
                      <span>اللغات الأساسية: <strong className="text-foreground">{githubLanguages || "مكتشفة"}</strong></span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <p className="text-[11px] text-muted-foreground truncate">
                        المشاريع: {topProjects ? topProjects.slice(0, 60) + "..." : "تم رصد المشاريع"}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={scanningGithub}
                        onClick={() => handleManualScan()}
                        className="h-7 text-xs gap-1 text-[#0070f3] hover:text-[#0070f3] flex-shrink-0"
                      >
                        <RefreshCw className={`w-3 h-3 ${scanningGithub ? "animate-spin" : ""}`} />
                        تحديث الفحص
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      أدخل رابط أو اسم مستخدم GitHub لاستخراج مشاريعك ولغاتك تلقائياً:
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="text-xs h-9 bg-background"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleManualScan()}
                        disabled={scanningGithub}
                        className="h-9 text-xs gap-1 bg-[#0070f3] text-white flex-shrink-0"
                      >
                        {scanningGithub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        فحص الآن
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Skills Box */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    المهارات المعتمدة في ملفك الشخصي
                  </span>
                  <Link href="/profile" className="text-[11px] text-[#0070f3] hover:underline">
                    تعديل في الملف
                  </Link>
                </div>

                {profileSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profileSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[11px] font-normal py-0.5 px-2 bg-background border border-border/80">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground pt-1">
                    لم تقم بإضافة مهارات في ملفك بعد. يمكنك إضافتها من صفحة الملف الشخصي لتعزيز دقة التقييم.
                  </p>
                )}
              </div>

              {/* Collapsible Advanced Edit */}
              <div className="border-t border-border/50 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
                  className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground py-1.5 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    تخصيص البيانات التقنية يدوياً (اختياري)
                  </span>
                  {showAdvancedEdit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvancedEdit && (
                  <div className="space-y-3 pt-3 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{t.readinessclient.key_3ux84x}</label>
                      <Input 
                        value={githubLanguages} 
                        onChange={(e) => setGithubLanguages(e.target.value)} 
                        placeholder={t.readinessclient.key_4srqlt}
                        className="bg-background text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{t.readinessclient.key_kqgzve}</label>
                      <Input 
                        type="number"
                        value={githubReposCount} 
                        onChange={(e) => setGithubReposCount(e.target.value)} 
                        className="bg-background text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{t.readinessclient.key_mlp3m9}</label>
                      <textarea 
                        value={topProjects} 
                        onChange={(e) => setTopProjects(e.target.value)} 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[70px]"
                        placeholder={t.readinessclient.key_733los}
                      />
                    </div>
                  </div>
                )}
              </div>

            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                onClick={handleAudit} 
                disabled={loading || fetchingProfile || scanningGithub} 
                className="w-full bg-[#0070f3] hover:bg-[#0070f3]/90 text-white font-semibold h-11 text-sm shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 ml-2 animate-spin" />
                    {t.readinessclient.key_sfodt2}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 ml-2" />
                    بدء التدقيق المهني الذكي
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Results Column */}
        <div className="md:col-span-7">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/20 border-border">
              <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">{t.readinessclient.key_uietee}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">
                {t.readinessclient.key_nb66j7}</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/20 border-border">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#0070f3]/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-[#0070f3] animate-spin relative z-10" />
              </div>
              <h3 className="text-lg font-medium text-foreground mt-6">{t.readinessclient.key_rsmy05}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t.readinessclient.key_hbomh7}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Card */}
              <Card className="vercel-card border-[#0070f3]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0070f3]" />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t.readinessclient.key_52yk5p}</p>
                      <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <span className={getScoreColor(result.readiness_score)}>
                          {result.readiness_score}%
                        </span>
                        <Badge variant="outline" className="bg-background text-foreground font-normal text-sm">
                          {result.readiness_status}
                        </Badge>
                      </h2>
                    </div>
                    <div className="text-right w-full md:w-1/2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.strengths_summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Skills */}
              <Card className="vercel-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {t.readinessclient.key_eys6lg}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.verified_skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400  border border-emerald-500/20 hover:bg-emerald-500/20 font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Gaps */}
              <Card className="vercel-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#ff5b4f]" />
                    {t.readinessclient.key_75megy}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.critical_gaps.map((gap: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${gap.priority === 'High' ? 'bg-[#ff5b4f] animate-pulse' : gap.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{gap.skill}</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {gap.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actionable Next Step */}
              <Card className="vercel-card border-border/50 bg-blue-500/100/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[#0070f3]" />
                    {t.readinessclient.key_n3bmys}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-card border border-blue-500/20 shadow-sm">
                    <p className="text-foreground font-medium leading-relaxed">
                      {result.actionable_next_step.recommended_project}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#0070f3] font-semibold bg-blue-500/10 w-fit px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4" />
                      {t.readinessclient.key_a06ono}{result.actionable_next_step.project_impact}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}