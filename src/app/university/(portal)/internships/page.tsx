import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function InternshipsPage() {
  const internships = await prisma.internship.findMany({
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">فرص التدريب المتاحة</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض جميع فرص التدريب ونسب إقبال الطلاب عليها</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{internship.title}</h3>
              <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                {internship.type === 'remote' ? 'عن بُعد' : internship.type === 'hybrid' ? 'هجين' : 'حضوري'}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-4">{internship.company}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                <span>📍</span>
                <span>{internship.location || 'عمان، الأردن'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                <span>⏱️</span>
                <span>{internship.duration || '3 أشهر'}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">عدد المتقدمين</span>
              <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
                {internship._count.applications} طالب
              </span>
            </div>
          </div>
        ))}

        {internships.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">لا توجد فرص تدريب متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
