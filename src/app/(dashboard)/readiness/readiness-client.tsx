"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Briefcase, Code, GitBranch, ShieldCheck, AlertTriangle, ArrowUpRight, Loader2, CheckCircle2, TrendingUp } from "lucide-react";

export function ReadinessClient() {
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Form State
  const [targetRole, setTargetRole] = useState("Junior Frontend Developer");
  const [githubLanguages, setGithubLanguages] = useState("TypeScript, React, Tailwind CSS");
  const [githubReposCount, setGithubReposCount] = useState("12");
  const [topProjects, setTopProjects] = useState("منصة تجارة إلكترونية متكاملة، وتطبيق لإدارة المهام باستخدام Next.js");

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
        ? "مقدمة في البرمجة، هياكل البيانات، هندسة البرمجيات، قواعد البيانات"
        : "لا يوجد מסاقات مسجلة";
      
      const payload = {
        target_role: targetRole,
        completed_courses_list: completedCourses,
        gpa: profile?.gpa || 3.0,
        completed_credit_hours: profile?.completedCredits || 90,
        total_credit_hours: profile?.totalCredits || 132,
        github_languages: githubLanguages,
        github_repos_count: githubReposCount,
        top_projects_descriptions: topProjects,
        self_declared_skills: profile?.skills ? JSON.parse(profile.skills).join(", ") : "React, Node.js"
      };

      const res = await fetch("/api/student/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("فشل في جلب التقييم");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الاتصال بالمدقق الآلي.");
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
      <PageHeader title="التدقيق المهني الذكي" />
      <p className="text-[#666666] text-sm mt-2">قيم جاهزيتك الفعلية لسوق العمل واكتشف الفجوات المهارية بدقة، مدعوماً بالذكاء الاصطناعي.</p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Form Column */}
        <div className="md:col-span-5 space-y-6">
          <Card className="vercel-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0070f3]" />
                بيانات التقييم
              </CardTitle>
              <CardDescription>
                أدخل مسارك المهني وبياناتك التقنية ليبدأ التدقيق.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#666666]">المسمى الوظيفي المستهدف</label>
                <Input 
                  value={targetRole} 
                  onChange={(e) => setTargetRole(e.target.value)} 
                  placeholder="مثال: Junior Backend Developer"
                  className="bg-[#fafafa]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#666666]">لغات وتقنيات GitHub</label>
                <Input 
                  value={githubLanguages} 
                  onChange={(e) => setGithubLanguages(e.target.value)} 
                  placeholder="مثال: Python, Django, PostgreSQL"
                  className="bg-[#fafafa]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#666666]">عدد المستودعات العامة (Repos)</label>
                <Input 
                  type="number"
                  value={githubReposCount} 
                  onChange={(e) => setGithubReposCount(e.target.value)} 
                  className="bg-[#fafafa]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#666666]">ملخص لأبرز مشاريعك</label>
                <textarea 
                  value={topProjects} 
                  onChange={(e) => setTopProjects(e.target.value)} 
                  className="w-full rounded-md border border-input bg-[#fafafa] px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                  placeholder="اكتب نبذة عن مشاريعك البرمجية الفعلية..."
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
                    جاري التدقيق...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 ml-2" />
                    بدء التدقيق الصارم
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Results Column */}
        <div className="md:col-span-7">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-[#fafafa]/50 border-border">
              <ShieldCheck className="w-16 h-16 text-[#666666]/30 mb-4" />
              <h3 className="text-lg font-medium text-[#171717]">في انتظار البيانات</h3>
              <p className="text-sm text-[#666666] max-w-sm mt-2">
                قم بتعبئة النموذج واضغط على "بدء التدقيق" للحصول على تحليل تفصيلي لمدى جاهزيتك لسوق العمل.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-[#fafafa]/50 border-border">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#0070f3]/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-[#0070f3] animate-spin relative z-10" />
              </div>
              <h3 className="text-lg font-medium text-[#171717] mt-6">يتم تحليل السجل والمشاريع...</h3>
              <p className="text-sm text-[#666666] mt-2">
                نطابق مهاراتك مع متطلبات سوق العمل الحالية
              </p>
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
                      <p className="text-sm font-medium text-[#666666] mb-1">مؤشر الجاهزية الكلي</p>
                      <h2 className="text-3xl font-bold text-[#171717] flex items-center gap-3">
                        <span className={getScoreColor(result.readiness_score)}>
                          {result.readiness_score}%
                        </span>
                        <Badge variant="outline" className="bg-[#fafafa] text-[#171717] font-normal text-sm">
                          {result.readiness_status}
                        </Badge>
                      </h2>
                    </div>
                    <div className="text-right w-full md:w-1/2">
                      <p className="text-sm text-[#666666] leading-relaxed">
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
                    المهارات المعتمدة عملياً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.verified_skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium">
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
                    الفجوات الحرجة (Critical Gaps)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.critical_gaps.map((gap: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-[#fafafa] border border-border">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${gap.priority === 'High' ? 'bg-[#ff5b4f] animate-pulse' : gap.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#171717]">{gap.skill}</h4>
                        <p className="text-sm text-[#666666] mt-1 leading-relaxed">
                          {gap.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actionable Next Step */}
              <Card className="vercel-card border-border/50 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[#0070f3]" />
                    الخطوة القادمة المقترحة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-white border border-blue-100 shadow-sm">
                    <p className="text-[#171717] font-medium leading-relaxed">
                      {result.actionable_next_step.recommended_project}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#0070f3] font-semibold bg-blue-50 w-fit px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4" />
                      الأثر المتوقع: {result.actionable_next_step.project_impact}
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