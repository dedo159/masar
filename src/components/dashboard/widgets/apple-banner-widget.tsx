"use client";

import { useState } from "react";
import { Download, X, ArrowLeft, Laptop } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function AppleBannerWidget() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl bg-[#141d33]/85 border border-white/15 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-white overflow-hidden group transition-all">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-[#0071e3]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left / Action Button */}
        <div className="flex items-center gap-3 order-3 sm:order-1 self-start sm:self-auto">
          <a
            href="/manifest.webmanifest"
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm group-hover:border-white/30"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            <span>{isAr ? "تثبيت التطبيق السحابي" : "Install Cloud App"}</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="إخفاء"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Center Text Details */}
        <div className="flex-1 text-center sm:text-end order-2">
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center justify-center sm:justify-end gap-2">
            <span>{isAr ? "الحصول على تطبيق مسار لـ Windows و الجوال" : "Get Masar for Windows & Mobile"}</span>
          </h4>
          <p className="text-xs text-white/70 leading-relaxed mt-1 max-w-2xl">
            {isAr
              ? "يمكنك الوصول إلى المقررات والملفات والواجبات والتنبيهات المباشرة على جهاز الكمبيوتر والهاتف بشكل متزامن وآمن."
              : "Access your courses, files, assignments, and instant notifications synchronously and securely on your computer and phone."}
          </p>
        </div>

        {/* Right / Icon inside Squircle */}
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-700/40 border border-white/20 flex items-center justify-center text-blue-300 shadow-inner shrink-0 order-1 sm:order-3">
          <Laptop className="h-6 w-6 text-white" />
        </div>

      </div>
    </div>
  );
}
