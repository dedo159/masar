import { AppleBentoGrid } from "@/components/dashboard/apple-bento-grid";
import { TodayScheduleSection } from "@/components/dashboard/today-schedule";
import { QuickStatsSection } from "@/components/dashboard/quick-stats";
import { getStudentProfile } from "@/lib/db-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let student = null;
  try {
    student = await getStudentProfile();
  } catch (e) {
    // Fallback handled in widget
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Primary Apple iCloud Bento Experience */}
      <AppleBentoGrid student={student} />

      {/* Secondary Academic Schedule & Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="apple-glass-card p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span>الجدول والمحاضرات اليومية المتزامنة</span>
            </h4>
            <span className="text-xs text-slate-300 font-medium">Moodle Realtime Sync</span>
          </div>
          <TodayScheduleSection />
        </div>

        <div className="apple-glass-card p-5 sm:p-6">
          <QuickStatsSection />
        </div>
      </div>
    </div>
  );
}
