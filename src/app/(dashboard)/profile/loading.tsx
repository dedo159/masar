import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfileLoading() {
  return (
    <>
      <PageHeader title="الملف الشخصي" subtitle="جاري التحميل..." />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto lg:max-w-none">
        {/* Profile Card Skeleton */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Stats Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3.5 flex flex-col items-center space-y-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Progress Card Skeleton */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Skills Card Skeleton */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
