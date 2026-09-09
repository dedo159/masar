"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function MerchantPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/merchant/auth/logout", { method: "POST" });
      router.push("/merchant/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex dir-rtl">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-amber-600 flex items-center gap-2">
            <span>🛍️</span>
            بوابة الشركاء
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/merchant/dashboard"
            className={`block px-4 py-2 rounded-md ${
              pathname === "/merchant/dashboard"
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            لوحة التحكم
          </Link>
          <Link
            href="/merchant/analytics"
            className={`block px-4 py-2 rounded-md ${
              pathname === "/merchant/analytics"
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            التحليلات والمبيعات
          </Link>
          <Link
            href="/merchant/deals/new"
            className={`block px-4 py-2 rounded-md ${
              pathname === "/merchant/deals/new"
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            إضافة عرض جديد
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-amber-600">🛍️ بوابة الشركاء</h1>
          <button onClick={handleLogout} className="text-sm text-red-600">
            خروج
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-gray-200 flex">
          <Link
            href="/merchant/dashboard"
            className={`flex-1 text-center py-3 text-sm ${
              pathname === "/merchant/dashboard" ? "text-amber-600 border-t-2 border-amber-600" : "text-gray-500"
            }`}
          >
            لوحة التحكم
          </Link>
          <Link
            href="/merchant/analytics"
            className={`flex-1 text-center py-3 text-sm ${
              pathname === "/merchant/analytics" ? "text-amber-600 border-t-2 border-amber-600" : "text-gray-500"
            }`}
          >
            التحليلات
          </Link>
          <Link
            href="/merchant/deals/new"
            className={`flex-1 text-center py-3 text-sm ${
              pathname === "/merchant/deals/new" ? "text-amber-600 border-t-2 border-amber-600" : "text-gray-500"
            }`}
          >
            إضافة عرض
          </Link>
        </nav>
      </div>
    </div>
  );
}
