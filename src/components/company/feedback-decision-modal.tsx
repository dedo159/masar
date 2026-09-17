"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Sparkles, Send, MessageSquare, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ATSCandidate } from "@/app/api/company/ats/route";

interface FeedbackDecisionModalProps {
  candidate: ATSCandidate;
  vacancyTitle: string;
  onClose: () => void;
  onDecision: (decision: "accepted" | "rejected", feedback: string, reason?: string) => void;
}

export function FeedbackDecisionModal({
  candidate,
  vacancyTitle,
  onClose,
  onDecision,
}: FeedbackDecisionModalProps) {
  const [decision, setDecision] = useState<"accepted" | "rejected">("accepted");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  // Smart feedback templates generated based on candidate profile & AI skill hints
  const templates = [
    {
      title: "نصيحة تقنية: تعزيز الاختبارات والـ CI/CD",
      text: `عزيزي ${candidate.name}،\n\nنشكرك جزيلاً على اهتمامك بفرصة التدريب في فريقنا والوقت الذي قضيته معنا. بناءً على مراجعة ملفك البرمجي، أظهرت أساساً قوياً في ${candidate.topSkills.join(" و ")}. ننصحك بالتركيز خلال الفترة القادمة على كتابة الاختبارات الآلية (Unit & Integration Testing) وأتمتة النشر عبر Docker و CI/CD لتعزيز محفظتك البرمجية. نتطلع لرؤية تقدمك في الفرص المستقبلية!`,
      reason: "حاجة لمزيد من الخبرة العملية في الاختبارات والنشر السحابي",
    },
    {
      title: "نصيحة معمارية: تعميق المشاريع الكاملة (Full-Stack Depth)",
      text: `عزيزي ${candidate.name}،\n\nشكراً لتقديمك لفرصة التدريب. لاحظنا شغفك وإنجازك الأكاديمي المتميز (معدل ${candidate.gpa.toFixed(2)}). نوصيك ببناء مشروع متكامل من الصفر يربط قواعد البيانات السحابية بإدارة الحالة المتقدمة ونظام مصادقة موثوق لرفع جاهزيتك لسوق العمل. نتمنى لك دوام التوفيق والنجاح.`,
      reason: "أولوية لمن يملكون مشاريع متكاملة منشورة على السحابة",
    },
    {
      title: "رسالة قبول مبدئي وعرض تدريبي",
      text: `عزيزي ${candidate.name}،\n\nيسرنا إعلامك بقبولك المبدئي للانضمام إلى برنامج التدريب العملي لشاغر "${vacancyTitle}" لدى شركتنا! أثبتت مراجعة كودك ومؤشر جاهزيتك (${candidate.readinessScore}%) كفاءتك العالية. سنتواصل معك خلال 48 ساعة لتنسيق تاريخ البدء وتوقيع اتفاقية التدريب الجامعي المعتمدة. أهلاً بك في الفريق!`,
      reason: "اجتياز كافة معايير التدقيق التقني والجدارة الهندسية",
    },
  ];

  const [customMessage, setCustomMessage] = useState(
    decision === "accepted" ? templates[2].text : templates[0].text
  );
  const [reason, setReason] = useState(
    decision === "accepted" ? templates[2].reason : templates[0].reason
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSelectDecision = (newDecision: "accepted" | "rejected") => {
    setDecision(newDecision);
    if (newDecision === "accepted") {
      setCustomMessage(templates[2].text);
      setReason(templates[2].reason);
    } else {
      setCustomMessage(templates[0].text);
      setReason(templates[0].reason);
      setSelectedTemplateIndex(0);
    }
  };

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomMessage(templates[idx].text);
    setReason(templates[idx].reason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 500));
      onDecision(decision, customMessage, reason);
      setDone(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>أداة التغذية الراجعة والقرار (Feedback & Decision)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              للمرشح: <strong className="text-foreground">{candidate.name}</strong> · جاهزية {candidate.readinessScore}%
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              {decision === "accepted" ? "تم اعتماد القبول وإرسال العرض!" : "تم اعتماد القرار وإرسال التغذية الراجعة البنّاءة!"}
            </h4>
            <p className="text-xs text-muted-foreground">
              تم تحديث مسار المرشح في لوحة الـ ATS وإشعاره بالبريد الإلكتروني.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick 1-Click Decision Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                القرار بنقرة واحدة:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDecision("accepted")}
                  className={`p-3 rounded-xl border text-xs text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    decision === "accepted"
                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
                      : "border-border bg-secondary/30 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-bold">قبول مبدئي (Offer)</div>
                    <div className="text-[10px] opacity-80">نقل لخانة المقبولين وإرسال العرض</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDecision("rejected")}
                  className={`p-3 rounded-xl border text-xs text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    decision === "rejected"
                      ? "border-destructive bg-destructive/10 text-destructive font-bold shadow-xs"
                      : "border-border bg-secondary/30 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-bold">رفض مع إشعار تشجيعي</div>
                    <div className="text-[10px] opacity-80">تغذية راجعة بنّاءة ونصائح تطوير</div>
                  </div>
                </button>
              </div>
            </div>

            {/* If Rejected: Constructive Quick Templates */}
            {decision === "rejected" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>قوالب جاهزة للرفض البنّاء (مبنية على تحليل مهارات الطالب):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(0)}
                    className={`p-2.5 rounded-lg border text-right text-xs transition-all cursor-pointer ${
                      selectedTemplateIndex === 0
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-card hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    💡 نصيحة تعزيز الاختبارات و Docker
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(1)}
                    className={`p-2.5 rounded-lg border text-right text-xs transition-all cursor-pointer ${
                      selectedTemplateIndex === 1
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-card hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    💡 نصيحة تعميق المشاريع والـ Cloud
                  </button>
                </div>
              </div>
            )}

            {/* Reason Tag */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                السبب المرجعي للقرار:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="سبب القرار الداخلي..."
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Custom Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <span>نص الإشعار المرسل للطالب:</span>
              </label>
              <textarea
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="text-xs"
              >
                إلغاء
              </Button>

              <Button
                type="submit"
                disabled={loading || !customMessage.trim()}
                className={`text-xs font-semibold gap-1.5 ${
                  decision === "accepted" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>{loading ? "جاري الحفظ..." : decision === "accepted" ? "تأكيد القبول وإرسال العرض" : "إرسال الإشعار التشجيعي"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
