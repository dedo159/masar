import { Suspense } from "react";
import { ScheduleClient } from "./schedule-client";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "الجدول الدراسي — مسار",
  description: "عرض مواعيد المحاضرات وتكامل تقويم Microsoft Teams وروابط الاجتماعات المباشرة",
};

export default function SchedulePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <Suspense fallback={<div className="h-48 flex items-center justify-center text-muted-foreground text-sm">جاري تحميل الجدول الدراسي...</div>}>
        <ScheduleClient />
      </Suspense>
    </div>
  );
}
