import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function SettingsLoading() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="جاري التحميل..." />
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </>
  );
}
