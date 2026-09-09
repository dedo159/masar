import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function HomeLoading() {
  return (
    <>
      <PageHeader title="مسار" subtitle="جاري التحميل..." />
      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto lg:max-w-none">
        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Deadlines Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
              >
                <Skeleton className="h-2 w-2 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
