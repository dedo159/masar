import { PageHeader } from "@/components/layout/page-header";
import { StudentIdCard } from "@/components/dashboard/student-id-card";
import { ItCareerPathCard } from "@/components/dashboard/it-career-path-card";
import { ActiveTicketCard } from "@/components/dashboard/active-ticket-card";
import { ActionMatchesCard } from "@/components/dashboard/action-matches-card";
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

      <div className="max-w-6xl mx-auto px-3.5 py-4 md:px-6 md:py-6 space-y-6">
        {/* 1. Hero: Student ID & Progress Card (Direct from Official 3D Mockup) */}
        <StudentIdCard />

        {/* 2. Central Dual Column: IT Career Path & Active Rolling QR Ticket */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: IT Career Path (Node Graph & GitHub Activity) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <ItCareerPathCard />
            <TodayScheduleSection />
          </div>

          {/* Right Column: Active Ticket Pass & Action Matches */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <ActiveTicketCard />
            <ActionMatchesCard />
            <UrgentDeadlinesSection />
          </div>
        </div>

        {/* 3. Campus Announcements & Quick Stats */}
        <div className="space-y-5 pt-2">
          <LatestAnnouncementWidget />
          <QuickStatsSection />
        </div>
      </div>
    </>
  );
}
