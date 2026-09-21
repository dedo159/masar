"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { getTimeAgo } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import type { Notification } from "@/lib/types";

const typeIconMap = {
  deadline: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  grade: { icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  announcement: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  reminder: { icon: Clock, color: "text-violet-500", bg: "bg-violet-500/10" },
};

export function NotificationsDropdown() {
  const { t, isRtl, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Track previous unread count to detect new notifications
  const prevUnreadCountRef = useRef<number>(0);
  const isFirstFetchRef = useRef<boolean>(true);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => reg.update());
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const subscribeToPush = async (silent: boolean = false) => {
    if (!("serviceWorker" in navigator)) {
      if (!silent) alert("متصفحك لا يدعم Service Worker");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      if (!registration) {
        if (!silent) alert("فشل تسجيل Service Worker");
        return;
      }
      if (!registration.pushManager) {
        if (!silent) alert("متصفحك لا يدعم خدمة الإشعارات الخلفية (PushManager غير متوفر). يرجى فتح الموقع في متصفح كروم أو تثبيته على الشاشة الرئيسية.");
        return;
      }

      const vapidPublicKey = "BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI";
      
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const response = await fetch("/api/updates/push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        if (!silent) alert("تم تفعيل إشعارات الهاتف بنجاح! 🚀");
      } else {
        const errorText = await response.text();
        if (!silent) alert("فشل حفظ الاشتراك في السيرفر: " + errorText);
      }
    } catch (e: any) {
      if (!silent) alert("خطأ أثناء تفعيل الإشعارات: " + e.message);
      console.error("Push subscription failed", e);
    }
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      await subscribeToPush();
    }
  };

  const showSystemNotification = async (title: string, body: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const options = {
      body,
      icon: "/favicon.ico",
      dir: isRtl ? "rtl" : ("ltr" as "rtl" | "ltr" | "auto"),
    };

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, options);
          return;
        }
      }
      // Fallback
      new window.Notification(title, options);
    } catch (e) {
      console.error("Failed to show notification:", e);
      try {
        new window.Notification(title, options);
      } catch (e2) {}
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
      
      const unreadCount = data.filter((n) => !n.read).length;
      
      // If we have more unread notifications than before, and it's not the first fetch
      if (!isFirstFetchRef.current && unreadCount > prevUnreadCountRef.current) {
        const newest = data.find((n) => !n.read);
        if (newest) showSystemNotification(newest.title, newest.body);
      }
      
      prevUnreadCountRef.current = unreadCount;
      isFirstFetchRef.current = false;
    } catch (e) {
      console.error("Failed to fetch notifications from API:", e);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new notifications every 15 seconds to test external notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch (e) {
      console.error("Failed to mark all notifications as read:", e);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.markNotificationRead(id);
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  const clearNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) fetchNotifications();
          setIsOpen((prev) => !prev);
        }}
        aria-label={t.header.notifications}
        aria-expanded={isOpen}
        className={`relative p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all focus:outline-none flex items-center justify-center ${
          isOpen ? "bg-white/15 text-white" : ""
        }`}
      >
        <Bell className="w-5 h-5 text-white/80 hover:text-white" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-[#07132c]" />
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute ${isRtl ? "right-0" : "left-0"} mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-3xl bg-[#141b2d]/98 border border-white/15 shadow-2xl backdrop-blur-3xl text-white z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{t.header.notifications}</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold font-mono">
                  {unreadCount} {language === "en" ? "Unread" : "جديد"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {permission === "default" && (
                <button
                  type="button"
                  onClick={requestPermission}
                  className="text-[11px] bg-white/10 hover:bg-white/20 text-white/90 px-2.5 py-1 rounded-lg border border-white/10 transition-colors font-medium"
                >
                  {language === "en" ? "Enable Alerts" : "تفعيل التنبيهات"}
                </button>
              )}
              {permission === "granted" && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await subscribeToPush(true);
                      const res = await fetch("/api/updates/push/test", { method: "POST" });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok) {
                        alert("تم إرسال الإشعار لهاتفك بنجاح! 🚀\nتفقد شريط الإشعارات أعلى الشاشة.");
                      } else {
                        alert("تنبيه: " + (data.error || "فشل إرسال الإشعار"));
                      }
                    } catch (e: any) {
                      alert("خطأ: " + e.message);
                    }
                  }}
                  className="text-[11px] bg-white/10 hover:bg-white/20 text-white/90 px-2.5 py-1 rounded-lg border border-white/10 transition-colors font-medium"
                >
                  {language === "en" ? "Test Alert" : "تجربة التنبيه"}
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Mark all read" : "قراءة الكل"}</span>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.08]">
            {loading ? (
              <div className="py-8 px-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-9 w-9 rounded-xl bg-white/10 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-36 bg-white/10 rounded" />
                      <div className="h-2.5 w-48 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center mb-2.5 text-white/70">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">{language === "en" ? "No notifications" : "لا توجد إشعارات"}</p>
                <p className="text-xs text-white/60 mt-1">
                  {language === "en" ? "You are all caught up on updates and deadlines" : "أنت مطلع على كافة التحديثات والمواعيد"}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const typeInfo = typeIconMap[item.type] || typeIconMap.reminder;
                const IconComponent = typeInfo.icon;

                const notificationContent = (
                  <div
                    onClick={() => {
                      markAsRead(item.id);
                      if (item.link) setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-white/[0.07] group relative ${
                      !item.read ? "bg-blue-500/[0.09]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${typeInfo.bg} border border-white/10`}
                    >
                      <IconComponent className={`h-4 w-4 ${typeInfo.color}`} strokeWidth={1.8} />
                    </div>

                    {/* Text Container */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4
                          className={`text-xs leading-snug font-semibold truncate ${
                            !item.read ? "text-white" : "text-white/85"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-white/50 shrink-0 font-medium font-mono whitespace-nowrap">
                          {getTimeAgo(item.createdAt, language)}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-normal">
                        {item.body}
                      </p>
                    </div>

                    {/* Unread indicator / dismiss */}
                    <div className="flex flex-col items-center justify-between self-stretch shrink-0 ps-1">
                      {!item.read ? (
                        <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      ) : (
                        <span className="h-2 w-2" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => clearNotification(e, item.id)}
                        className="text-white/40 hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity mt-auto"
                        title={language === "en" ? "Dismiss notification" : "حذف الإشعار"}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );

                if (item.link) {
                  return (
                    <Link key={item.id} href={item.link} className="block">
                      {notificationContent}
                    </Link>
                  );
                }

                return <div key={item.id}>{notificationContent}</div>;
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-white/10 bg-white/[0.02] text-center">
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-xs text-white/60 hover:text-white transition-colors py-1 px-3 font-medium rounded-lg hover:bg-white/10"
              >
                {language === "en" ? "Clear all notifications" : "مسح كل الإشعارات"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
