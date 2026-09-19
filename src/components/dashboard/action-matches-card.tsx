"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Briefcase, ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const facultyEvents: Record<string, { titleAr: string; titleEn: string; subtitleAr: string; subtitleEn: string }> = {
  it: { titleAr: "هاكاثون الذكاء الاصطناعي 2026", titleEn: "AI Hackathon 2026", subtitleAr: "كلية تكنولوجيا المعلومات • متبقي 3 أيام", subtitleEn: "Faculty of IT • 3 days left" },
  business: { titleAr: "مسابقة ريادة الأعمال 2026", titleEn: "Business Case Competition 2026", subtitleAr: "كلية الأعمال • متبقي 5 أيام", subtitleEn: "Faculty of Business • 5 days left" },
  engineering: { titleAr: "معرض المشاريع الهندسية", titleEn: "Engineering Projects Expo", subtitleAr: "كلية الهندسة • متبقي أسبوع", subtitleEn: "Faculty of Engineering • 1 week left" },
  pharmacy: { titleAr: "ورشة الصيدلة السريرية", titleEn: "Clinical Pharmacy Workshop", subtitleAr: "كلية الصيدلة • متبقي 4 أيام", subtitleEn: "Faculty of Pharmacy • 4 days left" },
  nursing: { titleAr: "ندوة التمريض المتقدم", titleEn: "Advanced Nursing Seminar", subtitleAr: "كلية التمريض • متبقي 3 أيام", subtitleEn: "Faculty of Nursing • 3 days left" },
  allied_medical: { titleAr: "مؤتمر العلوم الطبية المساندة", titleEn: "Allied Medical Sciences Conference", subtitleAr: "كلية العلوم الطبية المساندة", subtitleEn: "Faculty of Allied Medical Sciences" },
  architecture_design: { titleAr: "معرض التصميم السنوي", titleEn: "Annual Design Exhibition", subtitleAr: "كلية العمارة والتصميم", subtitleEn: "Faculty of Architecture & Design" },
  law: { titleAr: "محكمة صورية — القانون الدولي", titleEn: "Moot Court — International Law", subtitleAr: "كلية الحقوق • متبقي يومين", subtitleEn: "Faculty of Law • 2 days left" },
  arts_sciences: { titleAr: "ندوة الأدب والترجمة", titleEn: "Literature & Translation Seminar", subtitleAr: "كلية الآداب والعلوم", subtitleEn: "Faculty of Arts & Sciences" },
  educational_sciences: { titleAr: "ورشة التربية الخاصة", titleEn: "Special Education Workshop", subtitleAr: "كلية العلوم التربوية", subtitleEn: "Faculty of Educational Sciences" },
  dentistry: { titleAr: "يوم صحة الفم والأسنان", titleEn: "Oral Health Awareness Day", subtitleAr: "كلية طب الأسنان", subtitleEn: "Faculty of Dentistry" },
};

const facultyInternships: Record<string, { titleAr: string; titleEn: string }> = {
  it: { titleAr: "مطور برمجيات Fullstack متدرب • عمان", titleEn: "Frontend / React Intern • Amman" },
  business: { titleAr: "متدرب تسويق رقمي وإدارة • عمان", titleEn: "Digital Marketing Intern • Amman" },
  engineering: { titleAr: "مهندس متدرب • عمان", titleEn: "Engineering Intern • Amman" },
  pharmacy: { titleAr: "متدرب صيدلة سريرية • عمان", titleEn: "Clinical Pharmacy Intern • Amman" },
  nursing: { titleAr: "متدرب تمريض — مستشفى • عمان", titleEn: "Hospital Nursing Intern • Amman" },
  allied_medical: { titleAr: "متدرب مختبرات طبية • عمان", titleEn: "Medical Lab Intern • Amman" },
  architecture_design: { titleAr: "متدرب تصميم وتخطيط • عمان", titleEn: "Design & Architecture Intern • Amman" },
  law: { titleAr: "متدرب قانوني — استشارات • عمان", titleEn: "Legal Intern • Law Firm • Amman" },
  arts_sciences: { titleAr: "مترجم متدرب • عمان", titleEn: "Translation Intern • Amman" },
  educational_sciences: { titleAr: "متدرب إرشاد وتربية • عمان", titleEn: "Teaching Intern • Amman" },
  dentistry: { titleAr: "متدرب طب أسنان — مراكز طبية • عمان", titleEn: "Dental Clinic Intern • Amman" },
};

export function ActionMatchesCard() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [faculty, setFaculty] = useState("it");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("masar_user_faculty");
      if (stored) setFaculty(stored);
    }
  }, []);

  const event = facultyEvents[faculty] || facultyEvents.it;
  const internship = facultyInternships[faculty] || facultyInternships.it;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Recommended Events */}
      <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-4 shadow-sm dark:shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-[#38BDF8] flex items-center gap-1 font-semibold">
              <Calendar className="h-3 w-3" />
              <span>{isAr ? "فعاليات مقترحة" : "Campus Events"}</span>
            </span>
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {isAr ? event.titleAr : event.titleEn}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {isAr ? event.subtitleAr : event.subtitleEn}
            </p>
          </div>
        </div>

        <Link
          href="/announcements"
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#2F7BFF] to-[#A855F7] hover:from-[#256be6] hover:to-[#9333ea] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(47,123,255,0.3)] transition-all active:scale-[0.98]"
        >
          <span>{isAr ? "استكشف وسجل الآن" : "Join to action"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Job/Internship Matches */}
      <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-4 shadow-sm dark:shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-[#E83D84] flex items-center gap-1 font-semibold">
              <Briefcase className="h-3 w-3" />
              <span>{isAr ? "مطابقة تدريب" : "Job Matches"}</span>
            </span>
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {isAr ? "فرص التدريب المتوافقة (92%)" : "Job/Internship Matches"}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {isAr ? internship.titleAr : internship.titleEn}
            </p>
          </div>
        </div>

        <Link
          href="/internships"
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#E83D84] hover:from-[#7c3aed] hover:to-[#d82e75] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(232,61,132,0.3)] transition-all active:scale-[0.98]"
        >
          <span>{isAr ? "عرض الفرص المطابقة" : "Join to action"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
