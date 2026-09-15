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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">{t.universityportaldashboardpagetsx.text_r1ns}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
            📊
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.universityportaldashboardpagetsx.text_g2hr}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-foreground">{activeStudents}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
            ⚠️
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.universityportaldashboardpagetsx.text_1ufv}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-foreground">{atRiskStudents}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
            🔗
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.universityportaldashboardpagetsx.text_kf3n}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-foreground">{moodlePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
