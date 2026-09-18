import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">فرص التدريب الميداني والعملي</h1>
          <p className="text-xs text-white/50 mt-1">عرض جميع فرص التدريب المتاحة ومتابعة إقبال الطلاب عليها</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {internships.map((internship) => (
          <div
            key={internship.id}
            className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-xl backdrop-blur-2xl hover:border-[#2F7BFF]/40 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F7BFF]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                  {internship.title}
                </h3>
                <span className="bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30 text-[10px] px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  {internship.type === 'remote' ? 'عن بُعد' : internship.type === 'hybrid' ? 'هجين' : 'حضوري'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#38BDF8] mb-4">{internship.company}</p>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center text-xs text-white/60 gap-2">
                  <span>📍</span>
                  <span>{internship.location || 'عمان، الأردن'}</span>
                </div>
                <div className="flex items-center text-xs text-white/60 gap-2">
                  <span>⏱️</span>
                  <span>{internship.duration || '3 أشهر'}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-3.5 border-t border-white/[0.08] flex justify-between items-center">
              <span className="text-xs text-white/50">إجمالي المتقدمين</span>
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#2F7BFF] to-[#E83D84] rounded-full shadow-[0_0_12px_rgba(47,123,255,0.3)]">
                {internship._count.applications} طالب
              </span>
            </div>
          </div>
        ))}

        {internships.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-white/50">لا توجد فرص تدريب متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
