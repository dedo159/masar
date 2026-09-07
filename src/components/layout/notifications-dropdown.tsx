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
import type { Notification } from "@/lib/types";

const typeIconMap = {
  deadline: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  grade: { icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  announcement: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  reminder: { icon: Clock, color: "text-violet-500", bg: "bg-violet-500/10" },
};

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error("Failed to fetch notifications from API:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
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
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => {
          if (!isOpen) fetchNotifications();
          setIsOpen((prev) => !prev);
        }}
        aria-label="الإشعارات"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
          </span>
        )}
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl shadow-black/10 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">الإشعارات</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="text-[10px] h-5 px-1.5">
                  {unreadCount} غير مقروء
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                قراءة الكل
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="py-8 px-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-36 bg-secondary rounded" />
                      <div className="h-2.5 w-48 bg-secondary/60 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">لا توجد إشعارات</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  أنت مطلع على جميع التحديثات والمواعيد
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
                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-secondary/50 group relative ${
                      !item.read ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeInfo.bg}`}
                    >
                      <IconComponent className={`h-4 w-4 ${typeInfo.color}`} strokeWidth={1.5} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs leading-tight truncate ${
                            !item.read ? "font-medium text-foreground" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {getTimeAgo(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {/* Unread indicator / dismiss */}
                    <div className="flex flex-col items-center justify-between self-stretch flex-shrink-0">
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => clearNotification(e, item.id)}
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mt-auto"
                        title="حذف الإشعار"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );

                if (item.link) {
                  return (
                    <Link key={item.id} href={item.link}>
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
            <div className="p-2 border-t border-border bg-secondary/20 text-center">
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2 font-medium"
              >
                مسح كل الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
