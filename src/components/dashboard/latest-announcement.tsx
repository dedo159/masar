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
    <Link href="/announcements" className="block mb-5 group">
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-[#2F7BFF]/10 via-white/[0.03] to-[#E83D84]/10 p-3.5 md:p-4 flex items-center justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] active:scale-[0.99] overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#2F7BFF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] p-0.5 shadow-[0_0_15px_rgba(47,123,255,0.35)] shrink-0">
            <div className="h-full w-full rounded-[10px] bg-[#0D0E22] flex items-center justify-center text-white">
              <Megaphone className="w-4 h-4 text-[#38BDF8]" strokeWidth={2.2} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                {announcement.isPinned ? "إعلان هام ومثبت" : "أحدث إعلان جامعي"}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#38BDF8]" />
            </div>
            <div className="text-sm font-semibold text-white truncate group-hover:text-[#38BDF8] transition-colors">
              {announcement.title}
            </div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 z-10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
          <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-white rtl:rotate-0 ltr:rotate-180" />
        </div>
      </div>
    </Link>
  );
}