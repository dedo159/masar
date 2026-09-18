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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {t.universityportalatriskpagetsx.text_abyp}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            قائمة الطلاب ذوي مؤشرات التعثر الأكاديمي للتدخل الوقائي السريع
          </p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] shadow-sm dark:shadow-2xl backdrop-blur-2xl overflow-hidden">
        {atRiskStudents.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <span className="text-4xl block mb-3 animate-bounce">🎉</span>
            <p className="text-base font-bold text-foreground">{t.universityportalatriskpagetsx.text_tjhp}</p>
            <p className="text-xs text-muted-foreground mt-1">جميع الطلبة ضمن نطاق الأداء الأكاديمي المستقر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="text-[11px] uppercase bg-muted/40 dark:bg-white/[0.04] text-muted-foreground border-b border-border/60 dark:border-white/[0.08]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_jbh9}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_d3r8}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_d4bi}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_egiz}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">{t.universityportalatriskpagetsx.text_jo2g}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/[0.06]">
                {atRiskStudents.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {record.student.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground" dir="ltr">{record.student.studentId}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {record.lastLoginAt ? new Date(record.lastLoginAt).toLocaleDateString('ar-JO') : t.universityportalatriskpagetsx.text_78rq}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 rounded-full">
                        {record.lateAssignments}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-medium rounded-lg">
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
