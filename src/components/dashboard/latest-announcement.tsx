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
      <div className="bg-card border border-white/5 rounded-[20px] p-4 flex items-center justify-between transition-all duration-300 hover:border-white/20 hover:fintech-glow-purple active:scale-[0.98] min-h-[44px]">
        <div className="flex items-center gap-4">
          <div className="fintech-gradient-purple text-white p-3 rounded-2xl shadow-lg">
            <Megaphone className="w-5 h-5 fill-white/20" strokeWidth={2} />
          </div>
          <div>
            <div className="text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">
              {announcement.isPinned ? "إعلان مثبت" : "أحدث إعلان"}
            </div>
            <div className="text-sm font-semibold text-white line-clamp-1">
              {announcement.title}
            </div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-white/50 rtl:rotate-180" />
        </div>
      </div>
    </Link>
  );
}