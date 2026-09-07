import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function InternshipsLoading() {
  return (
    <>
      <PageHeader title="لوحة التدريب" subtitle="جاري التحميل..." />
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto lg:max-w-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-52" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-14 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
