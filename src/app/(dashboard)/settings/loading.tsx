import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function SettingsLoading() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="جاري تحميل الإعدادات..." />
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        
        {/* Account & Profile Summary */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 ms-4" />
          <div className="rounded-2xl border border-border bg-card p-4 min-h-[64px] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Moodle Sync Integration */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 ms-4" />
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-11 min-h-[44px] w-full rounded-md" />
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 ms-4" />
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 min-h-[56px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Generic Setting Rows (Calendar, Notifications, Security) */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-2">
            <Skeleton className="h-4 w-32 ms-4" />
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3 min-h-[40px]">
                <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </>
  );
}
