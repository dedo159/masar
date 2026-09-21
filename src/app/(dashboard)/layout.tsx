"use client";

import { AppleTopNav } from "@/components/layout/apple-top-nav";
import { BottomNav } from "@/components/layout/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen apple-fluid-bg text-white relative flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* 1. Apple iCloud Sleek Top Navigation */}
      <AppleTopNav />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 w-full pb-20 md:pb-10 transition-all">
        {children}
      </main>

      {/* 3. Mobile Navigation */}
      <BottomNav />
    </div>
  );
}
