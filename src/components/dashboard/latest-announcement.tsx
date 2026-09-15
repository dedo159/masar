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
      <div className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-sm active:scale-[0.98] min-h-[44px]">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-primary mb-0.5">
              {announcement.isPinned ? "إعلان مهم" : "إعلان جديد"}
            </div>
            <div className="text-sm font-medium text-foreground line-clamp-1">
              {announcement.title}
            </div>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-muted-foreground rtl:rotate-180" />
      </div>
    </Link>
  );
}
