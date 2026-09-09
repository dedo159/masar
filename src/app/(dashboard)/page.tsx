import { PageHeader } from "@/components/layout/page-header";
import { QuickStatsSection } from "@/components/dashboard/quick-stats";
import { TodayScheduleSection } from "@/components/dashboard/today-schedule";
import { UrgentDeadlinesSection } from "@/components/dashboard/urgent-deadlines";
import { DegreeProgressSummary } from "@/components/dashboard/degree-progress-summary";

export const revalidate = 60;

export default function HomePage() {
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
        title="مسار"
        subtitle={today}
      />

      <div className="px-4 py-5 space-y-6 max-w-7xl mx-auto">
        {/* 1. Quick Stats (KPIs) */}
        <QuickStatsSection />

        {/* 2. Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column: Daily Operations (Schedule & Urgent Deadlines) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <TodayScheduleSection />
            <UrgentDeadlinesSection />
          </div>

          {/* Side Column: Degree Progress & Long-term Growth */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <DegreeProgressSummary />
          </div>
        </div>
      </div>
    </>
  );
}
