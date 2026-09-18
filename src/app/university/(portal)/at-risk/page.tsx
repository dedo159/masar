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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.universityportalatriskpagetsx.text_abyp}
          </h1>
          <p className="text-xs text-white/50 mt-1">
            قائمة الطلاب ذوي مؤشرات التعثر الأكاديمي للتدخل الوقائي السريع
          </p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-2xl backdrop-blur-2xl overflow-hidden">
        {atRiskStudents.length === 0 ? (
          <div className="p-12 text-center text-white/70">
            <span className="text-4xl block mb-3 animate-bounce">🎉</span>
            <p className="text-base font-bold text-white">{t.universityportalatriskpagetsx.text_tjhp}</p>
            <p className="text-xs text-white/40 mt-1">جميع الطلبة ضمن نطاق الأداء الأكاديمي المستقر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="text-[11px] uppercase bg-white/[0.04] text-white/60 border-b border-white/[0.08]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_jbh9}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_d3r8}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_d4bi}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_egiz}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_jo2g}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {atRiskStudents.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      {record.student.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-white/70" dir="ltr">{record.student.studentId}</td>
                    <td className="px-5 py-4 text-white/60">
                      {record.lastLoginAt ? new Date(record.lastLoginAt).toLocaleDateString('ar-JO') : t.universityportalatriskpagetsx.text_78rq}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-full">
                        {record.lateAssignments}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium rounded-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                        <span>{t.universityportalatriskpagetsx.text_ets3}</span>
                      </span>
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
