import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  // Fetch data
  const activeStudents = await prisma.student.count();
  const moodleConnected = await prisma.moodleConnection.count();
  const atRiskStudents = await prisma.studentEngagementSnapshot.count({ where: { riskFlag: true } });
  const avgGpaResult = await prisma.student.aggregate({ _avg: { gpa: true } });
  
  const moodlePercentage = activeStudents > 0 ? Math.round((moodleConnected / activeStudents) * 100) : 0;
  const avgGpa = avgGpaResult._avg.gpa ? avgGpaResult._avg.gpa.toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة البيانات</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
            📊
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">عدد الطلاب النشطين</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeStudents}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
            🎓
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">متوسط المعدل التراكمي</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgGpa}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
            ⚠️
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">طلاب معرضون للخطر</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{atRiskStudents}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
            🔗
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">معدل اعتماد Moodle</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{moodlePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
