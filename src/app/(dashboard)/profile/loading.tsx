import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfileLoading() {
  return (
    <>
      <PageHeader title="الملف الشخصي" subtitle="جاري تحميل البيانات..." />
      <div className="px-4 py-5 space-y-5 max-w-4xl mx-auto">
        
        {/* Main User Profile Card Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-2xl border-2 border-border flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-3 w-full">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Moodle Integration Card Skeleton */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-md hidden sm:block" />
          </div>
          <div className="bg-secondary/40 rounded-lg p-3.5 space-y-3 border border-border/50">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Certificates Section Skeleton */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex p-3 rounded-xl border border-border bg-background min-h-[56px]">
                <Skeleton className="h-10 w-10 rounded-md me-3 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Quick Links Skeleton */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden mt-6 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 min-h-[56px]">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-4 w-4 shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
