"use client";

import { useState } from "react";
import { X, Calendar, Clock, Video, Code2, Users, CheckCircle2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ATSCandidate } from "@/app/api/company/ats/route";

interface ScheduleInterviewModalProps {
  candidate: ATSCandidate;
  vacancyTitle: string;
  onClose: () => void;
  onScheduled: (details: {
    type: "technical" | "hr";
    date: string;
    time: string;
    meetingUrl: string;
    codingNotes?: string;
  }) => void;
}

export function ScheduleInterviewModal({
  candidate,
  vacancyTitle,
  onClose,
  onScheduled,
}: ScheduleInterviewModalProps) {
  const [type, setType] = useState<"technical" | "hr">("technical");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("https://meet.google.com/new");
  const [codingNotes, setCodingNotes] = useState(
    type === "technical"
      ? "تمرين برمجي عملي مدته 45 دقيقة يركز على حل مسألة خوارزمية وكتابة كود نظيف وتوضيح طريقة التفكير المعماري."
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTypeChange = (newType: "technical" | "hr") => {
    setType(newType);
    if (newType === "technical" && !codingNotes) {
      setCodingNotes("تمرين برمجي عملي مدته 45 دقيقة يركز على حل مسألة خوارزمية وكتابة كود نظيف وتوضيح طريقة التفكير المعماري.");
    } else if (newType === "hr") {
      setCodingNotes("مقابلة تعريفية ومناقشة الملاءمة الثقافية وتوقعات التدريب وساعات الالتزام.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      onScheduled({
        type,
        date,
        time,
        meetingUrl,
        codingNotes,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
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
              <Calendar className="h-4 w-4 text-primary" />
              <span>جدولة مقابلة للمرشح (Interview Scheduling)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              للمرشح: <strong className="text-foreground">{candidate.name}</strong> · {candidate.university}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              تم حجز وتأكيد المقابلة بنجاح!
            </h4>
            <p className="text-xs text-muted-foreground">
              تم نقل المرشح إلى مرحلة "المقابلات" وإرسال تفاصيل الموعد ورابط الاجتماع إلى بريده ({candidate.email}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interview Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                نوع المقابلة المجدولة:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("technical")}
                  className={`p-3 rounded-xl border text-xs text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    type === "technical"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-secondary/30 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Code2 className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-bold">مقابلة تقنية (Technical)</div>
                    <div className="text-[10px] opacity-80">فحص الكود والمسائل الهندسية</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("hr")}
                  className={`p-3 rounded-xl border text-xs text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    type === "hr"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-secondary/30 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-bold">مقابلة عامة (HR)</div>
                    <div className="text-[10px] opacity-80">الملاءمة الثقافية وتوقعات التدريب</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>تاريخ المقابلة:</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>الوقت:</span>
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Meeting URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-muted-foreground" />
                <span>رابط الاجتماع (Google Meet / Zoom):</span>
              </label>
              <input
                type="url"
                required
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Coding Challenge or Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>متطلبات أو ملاحظات الاختبار البرمجي قبل المقابلة:</span>
                <span className="text-[10px] text-muted-foreground font-normal">اختياري</span>
              </label>
              <textarea
                rows={3}
                value={codingNotes}
                onChange={(e) => setCodingNotes(e.target.value)}
                placeholder="أدخل أي مهام مسبقة، روابط لمستودع التحدي البرمجي، أو إرشادات للمرشح..."
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
                disabled={loading || !date || !time}
                className="text-xs font-semibold gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{loading ? "جاري الحفظ..." : "تأكيد وإرسال دعوة المقابلة"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
