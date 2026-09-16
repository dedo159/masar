"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Briefcase, Code, GitBranch, ShieldCheck, AlertTriangle, ArrowUpRight, Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function ReadinessClient() {
    const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Form State
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [githubLanguages, setGithubLanguages] = useState("TypeScript, React, Tailwind CSS");
  const [githubReposCount, setGithubReposCount] = useState("12");
  const [topProjects, setTopProjects] = useState(t.readinessclient.key_s1yrnd);

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/students/me")
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setFetchingProfile(false);
      })
      .catch(() => setFetchingProfile(false));
  }, []);

  const handleAudit = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Mocking completed courses based on profile if available, otherwise fallback
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
        self_declared_skills: (profile?.skills && Array.isArray(profile?.skills) && profile.skills.length > 0) ? profile.skills.join(", ") : githubLanguages
      };

      const res = await fetch("/api/student/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) { const errorData = await res.json().catch(() => ({})); throw new Error(errorData.error || `فشل في جلب التقييم: HTTP ${res.status}`); }
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
        <div className="md:col-span-5 space-y-6">
          <Card className="vercel-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0070f3]" />
                {t.readinessclient.key_t1qqxv}</CardTitle>
              <CardDescription>
                {t.readinessclient.key_xvxtxz}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.readinessclient.key_ywqfcx}</label>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.readinessclient.key_3ux84x}</label>
                <Input 
                  value={githubLanguages} 
                  onChange={(e) => setGithubLanguages(e.target.value)} 
                  placeholder={t.readinessclient.key_4srqlt}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.readinessclient.key_kqgzve}</label>
                <Input 
                  type="number"
                  value={githubReposCount} 
                  onChange={(e) => setGithubReposCount(e.target.value)} 
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.readinessclient.key_mlp3m9}</label>
                <textarea 
                  value={topProjects} 
                  onChange={(e) => setTopProjects(e.target.value)} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                  placeholder={t.readinessclient.key_733los}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAudit} 
                disabled={loading || fetchingProfile} 
                className="w-full bg-[#0070f3] hover:bg-[#0070f3]/90 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.readinessclient.key_sfodt2}</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 ml-2" />
                    {t.readinessclient.key_18c4so}</>
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