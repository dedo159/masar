import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getTodayDayInAmman, JORDAN_TIMEZONE } from "@/lib/timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string, locale: "ar" | "en" = "ar"): string {
  if (!time || time === "--:--") return "--:--";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  if (isNaN(h)) return time;
  const isEn = locale === "en";
  const period = h >= 12 ? (isEn ? "PM" : "م") : (isEn ? "AM" : "ص");
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${minutes || "00"} ${period}`;
}

export function getDayLabel(day: string, locale: "ar" | "en" = "ar"): string {
  const daysAr: Record<string, string> = {
    sun: "الأحد",
    mon: "الاثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    fri: "الجمعة",
    sat: "السبت",
  };
  const daysEn: Record<string, string> = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  };
  return (locale === "en" ? daysEn[day] : daysAr[day]) || day;
}

export function getTodayDay(): string {
  return getTodayDayInAmman();
}

export function getRelativeTime(dateString: string, timeString?: string, locale: "ar" | "en" = "ar"): string {
  const isEn = locale === "en";
  if (!dateString || dateString === "بدون موعد تسليم محدد" || dateString === "غير محدد") {
    return isEn ? "No deadline set" : "بدون موعد تسليم محدد";
  }

  // Construct precise ISO with Jordan offset (+03:00)
  const fullIso = (timeString && timeString !== "--:--")
    ? `${dateString}T${timeString}:00+03:00`
    : `${dateString}T23:59:59+03:00`;

  let date = new Date(fullIso);
  if (isNaN(date.getTime())) {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) {
    return isEn ? "No deadline set" : "بدون موعد تسليم محدد";
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return isEn ? "Ended" : "انتهى";
  if (diffHours < 1) return isEn ? "In < 1 hr" : "خلال أقل من ساعة";
  if (diffHours < 24) return isEn ? `In ${diffHours} hrs` : `خلال ${diffHours} ساعة`;
  if (diffDays === 1) return isEn ? "Tomorrow" : "غداً";
  if (diffDays < 7) return isEn ? `In ${diffDays} days` : `خلال ${diffDays} أيام`;
  return date.toLocaleDateString(isEn ? "en-US" : "ar-JO", {
    timeZone: JORDAN_TIMEZONE,
    month: "short",
    day: "numeric",
  });
}

export function getDeadlineStatus(dueDate: string, dueTime?: string): "urgent" | "soon" | "normal" {
  if (!dueDate || dueDate === "بدون موعد تسليم محدد" || dueDate === "غير محدد") {
    return "normal";
  }

  const fullIso = (dueTime && dueTime !== "--:--")
    ? `${dueDate}T${dueTime}:00+03:00`
    : `${dueDate}T23:59:59+03:00`;

  let date = new Date(fullIso);
  if (isNaN(date.getTime())) {
    date = new Date(dueDate);
  }
  if (isNaN(date.getTime())) {
    return "normal";
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 24) return "urgent";
  if (diffHours <= 72) return "soon";
  return "normal";
}

export function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 45) return "D+";
  if (percentage >= 40) return "D";
  return "F";
}

export function getTimeAgo(dateString: string, locale: "ar" | "en" = "ar"): string {
  const isEn = locale === "en";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return isEn ? "Just now" : "الآن";
  if (diffMins < 60) return isEn ? `${diffMins}m ago` : `منذ ${diffMins} دقيقة`;
  if (diffHours === 1) return isEn ? "1h ago" : "منذ ساعة";
  if (diffHours < 24) return isEn ? `${diffHours}h ago` : `منذ ${diffHours} ساعات`;
  if (diffDays === 1) return isEn ? "1d ago" : "منذ يوم";
  if (diffDays < 7) return isEn ? `${diffDays}d ago` : `منذ ${diffDays} أيام`;
  return date.toLocaleDateString(isEn ? "en-US" : "ar-JO", {
    timeZone: JORDAN_TIMEZONE,
    month: "short",
    day: "numeric",
  });
}
