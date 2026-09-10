"use client";

import { BottomNav, Sidebar } from "@/components/layout/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRtl } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "pb-[72px] md:pb-0 min-h-screen transition-all duration-150",
        isRtl ? "md:pr-60 md:pl-0" : "md:pl-60 md:pr-0"
      )}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
