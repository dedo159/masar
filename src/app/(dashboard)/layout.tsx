import { BottomNav, Sidebar } from "@/components/layout/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pr-60 pb-[72px] md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
