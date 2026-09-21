"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Grid,
  Plus,
  User,
  LayoutDashboard,
  Calendar,
  TrendingUp,
  BookOpen,
  Megaphone,
  Store,
  GraduationCap,
  Building2,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/language-provider";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import { MasarLogo } from "@/components/ui/logo";

interface StudentInfo {
  name: string;
  email: string;
  major: string;
  avatar?: string | null;
  studentId?: string;
}

export function AppleTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isAr = language === "ar";

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const launcherRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/students/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setStudent(data);
        }
      })
      .catch(() => {});
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node)) {
        setShowAppLauncher(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAdd(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/student/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const portalApps = [
    { href: "/", label: isAr ? "الرئيسية" : "Home", icon: LayoutDashboard, color: "bg-blue-500", desc: isAr ? "لوحة التحكم السحابية" : "Dashboard" },
    { href: "/schedule", label: isAr ? "التقويم والجدول" : "Calendar", icon: Calendar, color: "bg-red-500", desc: isAr ? "المحاضرات والمواعيد" : "Lectures & Times" },
    { href: "/readiness", label: isAr ? "المسار المهني" : "Readiness", icon: TrendingUp, color: "bg-gradient-to-tr from-amber-500 to-pink-500", desc: isAr ? "فحص الجاهزية والـ AI" : "AI Career Audit" },
    { href: "/courses", label: isAr ? "المقررات (Drive)" : "Drive & Files", icon: BookOpen, color: "bg-cyan-500", desc: isAr ? "ملفات ومحاضرات Moodle" : "Course Materials" },
    { href: "/announcements", label: isAr ? "الإعلانات" : "News", icon: Megaphone, color: "bg-purple-500", desc: isAr ? "أخبار الجامعة المعتمدة" : "University Feed" },
    { href: "/profile", label: isAr ? "الهوية الأكاديمية" : "Student Pass", icon: User, color: "bg-emerald-500", desc: isAr ? "البطاقة والشهادات" : "Pass & Certificates" },
  ];

  const externalPortals = [
    { href: "/university/login", label: isAr ? "بوابة الجامعة" : "University Portal", icon: GraduationCap, color: "text-blue-400" },
    { href: "/company/login", label: isAr ? "بوابة الشركات" : "Company Portal", icon: Building2, color: "text-emerald-400" },
    { href: "/merchant/login", label: isAr ? "بوابة المتاجر" : "Merchants", icon: Store, color: "text-amber-400" },
  ];

  const studentName = student?.name || "ضياء الدين الملكاوي";
  const studentEmail = student?.email || "deyaamalkawi2008@outlook.com";
  const studentAvatar = student?.avatar;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-black/25 border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
        
        {/* Left Side: Avatar, App Launcher & Quick Add */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* User Avatar & Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative h-8 w-8 rounded-full overflow-hidden border border-white/30 hover:border-white/60 transition-all focus:outline-none focus:ring-2 focus:ring-white/40 group shadow-sm flex items-center justify-center bg-white/10"
              title="الملف الشخصي والحساب"
            >
              {studentAvatar ? (
                <img
                  src={studentAvatar}
                  alt={studentName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-xs font-semibold text-white">
                  {studentName.charAt(0)}
                </span>
              )}
            </button>

            {/* Profile Popover */}
            {showProfileMenu && (
              <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2.5 w-72 rounded-2xl bg-[#1c2438]/95 border border-white/15 p-4 shadow-2xl backdrop-blur-2xl text-white animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="h-11 w-11 rounded-full overflow-hidden border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                    {studentAvatar ? (
                      <img src={studentAvatar} alt={studentName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-white/80" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{studentName}</p>
                    <p className="text-xs text-slate-300 truncate font-mono">{studentEmail}</p>
                    <span className="inline-block mt-1 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-medium">
                      طالب مسار — جامعة عمان الأهلية
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="h-4 w-4 text-blue-400" />
                    <span>إعدادات الحساب والبطاقة الجامعية</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-purple-400" />
                    <span>تفضيلات المنصة والربط</span>
                  </Link>

                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-start"
                  >
                    <span className="flex items-center gap-2.5">
                      {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
                      <span>تبديل المظهر</span>
                    </span>
                    <span className="text-[10px] opacity-60 uppercase">{theme === "dark" ? "Dark" : "Light"}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-start font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3x3 Grid Dots (Apple App Launcher) */}
          <div className="relative" ref={launcherRef}>
            <button
              onClick={() => setShowAppLauncher(!showAppLauncher)}
              className={`p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all focus:outline-none ${
                showAppLauncher ? "bg-white/15 text-white" : ""
              }`}
              title="مشغّل التطبيقات والخدمات"
            >
              {/* Authentic 3x3 Dots Grid SVG */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <circle cx="5" cy="5" r="2" />
                <circle cx="12" cy="5" r="2" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="12" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
              </svg>
            </button>

            {/* Apple Launchpad Popover */}
            {showAppLauncher && (
              <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-[#141b2d]/98 border border-white/15 p-5 shadow-2xl backdrop-blur-3xl text-white animate-in fade-in zoom-in-95 duration-150 z-50">
                {/* Launchpad Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    تطبيقات وخدمات مسار
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium">منظومة مسار الرقمية</span>
                </div>

                {/* Primary Student Apps Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {portalApps.map((app) => {
                    const isActive = pathname === app.href;
                    const Icon = app.icon;
                    return (
                      <Link
                        key={app.href}
                        href={app.href}
                        onClick={() => setShowAppLauncher(false)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all group text-center ${
                          isActive ? "bg-white/15 shadow-inner" : "hover:bg-white/10"
                        }`}
                      >
                        <div className={`h-11 w-11 rounded-2xl ${app.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-2 text-white`}>
                          <Icon className="h-5 w-5" strokeWidth={2.2} />
                        </div>
                        <span className="text-xs font-medium text-white truncate w-full">
                          {app.label}
                        </span>
                        <span className="text-[10px] text-slate-300 truncate w-full mt-0.5 font-normal">
                          {app.desc}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Other Portals Switcher */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="text-[10px] text-slate-300 block mb-2 font-medium">بوابات الشركاء والجامعة:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {externalPortals.map((portal) => {
                      const Icon = portal.icon;
                      return (
                        <Link
                          key={portal.href}
                          href={portal.href}
                          onClick={() => setShowAppLauncher(false)}
                          className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white text-[10px] font-medium transition-colors"
                        >
                          <Icon className={`h-3.5 w-3.5 ${portal.color} shrink-0`} />
                          <span className="truncate">{portal.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action (+) Button */}
          <div className="relative" ref={quickAddRef}>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className={`h-7 w-7 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all ${
                showQuickAdd ? "bg-white/20 text-white" : "hover:bg-white/10"
              }`}
              title="إجراءات سريعة"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>

            {showQuickAdd && (
              <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2.5 w-56 rounded-2xl bg-[#1c2438]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl text-white animate-in fade-in zoom-in-95 duration-150 z-50">
                <Link
                  href="/readiness"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>فحص الجاهزية الآن</span>
                </Link>
                <Link
                  href="/courses"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  <span>تصفح المواد والمحاضرات</span>
                </Link>
                <Link
                  href="/schedule"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>عرض الجدول الدراسي</span>
                </Link>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <NotificationsDropdown />
        </div>

        {/* Right Side: Masar Official Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <MasarLogo size="sm" variant="white" priority />
        </Link>

      </div>
    </header>
  );
}
