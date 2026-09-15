import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function InternshipsLoading() {
  return (
    <>
      <PageHeader title="فرص التدريب" subtitle="جاري تحميل الفرص المتاحة..." />
      <div className="px-4 py-5 space-y-5 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              {/* Top info */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                    <div className="space-y-2 flex-1 pt-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-4/5 max-w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-md flex-shrink-0" />
                </div>

                {/* Metadata chips */}
                <div className="flex flex-wrap items-center gap-2 gap-y-1.5 mt-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Skeleton className="h-3 w-32 hidden sm:block" />
                <Skeleton className="h-11 min-h-[44px] w-full sm:w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
