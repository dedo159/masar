"use client";

import { useLanguage } from "@/components/providers/language-provider";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { language, t } = useLanguage();

  const titleMap: Record<string, string> = {
    "courses": t.courses.title,
    "المواد": t.courses.title,
    "المواد المسجلة": t.courses.title,
    "تفاصيل المادة": t.courseDetail.scheduleTab,
    "internships": t.internships.title,
    "لوحة التدريب": t.internships.title,
    "deals": t.deals.title,
    "العروض والخصومات": t.deals.title,
    "التذكرة": t.deals.title,
    "profile": t.profile.title,
    "الملف الشخصي": t.profile.title,
    "settings": t.settings.title,
    "الإعدادات": t.settings.title,
  };

  const displayTitle = titleMap[title] || title;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 select-none">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{displayTitle}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/60 mt-1" suppressHydrationWarning>
              {subtitle === "date" 
                ? new Date().toLocaleDateString(language === "ar" ? "ar-JO" : "en-US", {
                    timeZone: "Asia/Amman",
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : (subtitle === "loading" || subtitle === "جاري التحميل..." || subtitle === "جاري تحميل البيانات...")
                ? t.common.loading
                : subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
