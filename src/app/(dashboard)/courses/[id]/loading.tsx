import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function CourseDetailLoading() {
  return (
    <>
      <PageHeader title="تحميل المادة" subtitle="جاري تحميل التفاصيل..." />
      <div className="px-4 py-5 max-w-5xl mx-auto space-y-6">
        
        {/* Main Course Info Card Skeleton */}
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <Skeleton className="h-6 w-3/4 max-w-[250px]" />
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md shrink-0 hidden sm:block" />
          </div>
          <div className="px-4 py-3 bg-secondary/30 flex flex-wrap items-center justify-between gap-3 border-t border-border/50">
            <div className="flex gap-4 w-full sm:w-auto">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
