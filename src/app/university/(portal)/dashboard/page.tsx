import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getServerTranslations } from "@/lib/translations/server";

export default async function DashboardPage() {
    const t = await getServerTranslations();
  // Fetch data
  const session = await getSession();
  if (!session || session.userType !== 'staff' || !session.universityId) {
    throw new Error('Unauthorized');
  }
  const universityId = session.universityId;

  const activeStudents = await prisma.student.count({ where: { universityId } });
  const moodleConnected = await prisma.moodleConnection.count({ where: { student: { universityId } } });
  const atRiskStudents = await prisma.studentEngagementSnapshot.count({ where: { riskFlag: true, student: { universityId } } });
  
  const moodlePercentage = activeStudents > 0 ? Math.round((moodleConnected / activeStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {t.universityportaldashboardpagetsx.text_r1ns}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            مؤشرات المتابعة الأكاديمية اللحظية وحالة الطلاب
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Active Students */}
        <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-5 shadow-sm dark:shadow-xl backdrop-blur-2xl flex items-center gap-4 hover:border-[#2F7BFF]/40 transition-all overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F7BFF]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#00D2FF]/20 to-[#2F7BFF]/20 border border-[#2F7BFF]/30 flex items-center justify-center text-[#2F7BFF] dark:text-[#38BDF8] text-2xl shadow-[0_0_20px_rgba(47,123,255,0.25)]">
            📊
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t.universityportaldashboardpagetsx.text_g2hr}</p>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">{activeStudents}</p>
          </div>
        </div>

        {/* Card 2: At-Risk Students */}
        <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-5 shadow-sm dark:shadow-xl backdrop-blur-2xl flex items-center gap-4 hover:border-rose-500/40 transition-all overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#E83D84]/20 to-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-300 text-2xl shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            ⚠️
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t.universityportaldashboardpagetsx.text_1ufv}</p>
            <p className="text-2xl font-bold font-mono text-rose-500 dark:text-rose-400 mt-0.5">{atRiskStudents}</p>
          </div>
        </div>

        {/* Card 3: Moodle Adoption */}
        <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-5 shadow-sm dark:shadow-xl backdrop-blur-2xl flex items-center gap-4 hover:border-[#38BDF8]/40 transition-all overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2F7BFF]/20 to-[#A855F7]/20 border border-[#A855F7]/30 flex items-center justify-center text-purple-600 dark:text-[#C084FC] text-2xl shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            🔗
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t.universityportaldashboardpagetsx.text_kf3n}</p>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">{moodlePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
