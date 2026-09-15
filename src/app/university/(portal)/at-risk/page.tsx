import { prisma } from '@/lib/prisma';
import { getServerTranslations } from "@/lib/translations/server";

export default async function AtRiskPage() {
    const t = await getServerTranslations();
  const atRiskStudents = await prisma.studentEngagementSnapshot.findMany({
    where: { riskFlag: true },
    include: { student: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">{t.universityportalatriskpagetsx.text_abyp}</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {atRiskStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-lg">{t.universityportalatriskpagetsx.text_tjhp}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-gray-600 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4">{t.universityportalatriskpagetsx.text_jbh9}</th>
                  <th scope="col" className="px-6 py-4">{t.universityportalatriskpagetsx.text_d3r8}</th>
                  <th scope="col" className="px-6 py-4">{t.universityportalatriskpagetsx.text_d4bi}</th>
                  <th scope="col" className="px-6 py-4">{t.universityportalatriskpagetsx.text_egiz}</th>
                  <th scope="col" className="px-6 py-4">{t.universityportalatriskpagetsx.text_jo2g}</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-foreground">
                      {record.student.name}
                    </td>
                    <td className="px-6 py-4 font-mono" dir="ltr">{record.student.studentId}</td>
                    <td className="px-6 py-4">
                      {record.lastLoginAt ? new Date(record.lastLoginAt).toLocaleDateString('ar-JO') : t.universityportalatriskpagetsx.text_78rq}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {record.lateAssignments}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded dark:bg-red-900 dark:text-red-300">
                        {t.universityportalatriskpagetsx.text_ets3}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
