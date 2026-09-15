import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function HomeLoading() {
  return (
    <>
      <PageHeader title="مسار" subtitle="جاري التحميل وتحديث البيانات..." />

      <div className="px-4 py-5 space-y-6 max-w-7xl mx-auto">
        {/* Latest Announcement Skeleton */}
        <div className="mb-6 bg-muted/20 border border-border/50 rounded-lg p-4 flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-3 w-full">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1.5 flex-1 max-w-[200px]">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>

        {/* 1. Quick Stats Skeleton (4 cards) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 min-h-[96px] shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="space-y-1.5 mt-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* 2. Main Dashboard Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column */}
          <div className="lg:col-span-12 xl:col-span-12 space-y-6">
            {/* Today Schedule Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 min-h-[56px] shadow-sm"
                  >
                    <Skeleton className="h-10 w-1.5 rounded-full" />
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-3 w-28" />
                      <div className="flex gap-2 pt-1">
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadlines Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 rounded-lg border border-border bg-card p-3.5 min-h-[52px] shadow-sm"
                  >
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
