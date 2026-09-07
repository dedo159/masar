import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function DegreeLoading() {
  return (
    <>
      <PageHeader title="تقدّم التخرج" subtitle="جاري التحميل..." />
      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto lg:max-w-none">
        {/* Overall Ring Skeleton */}
        <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Categories Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
