import { PageHeader } from "@/components/layout/page-header";
import { UrgentDeadlinesSection } from "@/components/dashboard/urgent-deadlines";
import { QuickStatsSection } from "@/components/dashboard/quick-stats";
import { TodayScheduleSection } from "@/components/dashboard/today-schedule";

export const revalidate = 60;

export default function HomePage() {
  const today = new Date().toLocaleDateString("ar-JO", {
    timeZone: "Asia/Amman",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <PageHeader title="مسار" subtitle={today} />
      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto lg:max-w-none">
        <QuickStatsSection />
        <TodayScheduleSection />
        <UrgentDeadlinesSection />
      </div>
    </>
  );
}

