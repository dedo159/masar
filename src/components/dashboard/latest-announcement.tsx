"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  isPinned: boolean;
  publishedAt: string;
}

export function LatestAnnouncementWidget() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then((data: Announcement[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          const isRecent = (new Date().getTime() - new Date(first.publishedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;
          if (first.isPinned || isRecent) {
            setAnnouncement(first);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!announcement) return null;

  return (
    <Link href="/announcements" className="block mb-6">
      <div className="bg-academic-bg/40 dark:bg-academic-bg/10 hover:bg-academic-bg/60 border border-academic-border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-sm active:scale-[0.98] min-h-[44px]">
        <div className="flex items-center gap-4">
          <div className="bg-academic-bg text-academic-fg p-2.5 rounded-xl">
            <Megaphone className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xs font-semibold text-academic-fg/80 mb-1">
              {announcement.isPinned ? "إعلان مثبت" : "أحدث إعلان"}
            </div>
            <div className="text-sm font-medium text-foreground line-clamp-1">
              {announcement.title}
            </div>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-academic-fg/60 rtl:rotate-180" />
      </div>
    </Link>
  );
}