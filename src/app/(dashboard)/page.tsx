import { PageHeader } from "@/components/layout/page-header";
import { QuickStatsSection } from "@/components/dashboard/quick-stats";
import { TodayScheduleSection } from "@/components/dashboard/today-schedule";
import { UrgentDeadlinesSection } from "@/components/dashboard/urgent-deadlines";
import { LatestAnnouncementWidget } from "@/components/dashboard/latest-announcement";
import { getServerTranslations } from "@/lib/translations/server";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getServerTranslations();
  const today = new Date().toLocaleDateString("ar-JO", {
    timeZone: "Asia/Amman",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title={t.srcappdashboardpagetsx.text_c5ze}
        subtitle={today}
      />

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        <LatestAnnouncementWidget />

        {/* 1. Quick Stats (KPIs) */}
        <QuickStatsSection />

        {/* 2. Main Dashboard Grid (Balanced 2-Column on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lecture Schedule */}
          <div className="lg:col-span-7 space-y-6">
            <TodayScheduleSection />
          </div>
          {/* Urgent Homework & Deadlines */}
          <div className="lg:col-span-5 space-y-6">
            <UrgentDeadlinesSection />
          </div>
        </div>
      </div>
    </>
  );
}
