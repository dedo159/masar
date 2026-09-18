import { PageHeader } from "@/components/layout/page-header";
import { StudentIdCard } from "@/components/dashboard/student-id-card";
import { QuickStatsSection } from "@/components/dashboard/quick-stats";
import { TodayScheduleSection } from "@/components/dashboard/today-schedule";
import { UrgentDeadlinesSection } from "@/components/dashboard/urgent-deadlines";
import { LatestAnnouncementWidget } from "@/components/dashboard/latest-announcement";
import { ActionMatchesCard } from "@/components/dashboard/action-matches-card";
import { getServerTranslations } from "@/lib/translations/server";
import { getStudentProfile } from "@/lib/db-queries";

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

  let student = null;
  try {
    student = await getStudentProfile();
  } catch (e) {
    // SSR fallback handled in component
  }

  return (
    <>
      <PageHeader
        title={t.srcappdashboardpagetsx.text_c5ze}
        subtitle={today}
      />

      <div className="max-w-6xl mx-auto px-3.5 py-4 md:px-6 md:py-6 space-y-6">
        {/* 1. University Announcement (if any active) */}
        <LatestAnnouncementWidget />

        {/* 2. Hero: Academic Identity & Graduation Progress (Modern Glassmorphic Hero) */}
        <StudentIdCard student={student} />

        {/* 3. Quick Stats KPIs (Enrolled Courses, GPA, Deadlines, Credits) */}
        <QuickStatsSection />

        {/* 4. Core Academic Dashboard: Today's Schedule & Urgent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Today's Lectures & Classes Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <TodayScheduleSection />
          </div>

          {/* Urgent Deadlines & Action Matches (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <UrgentDeadlinesSection />
            <ActionMatchesCard />
          </div>
        </div>
      </div>
    </>
  );
}
