"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Megaphone, Pin, Calendar, Briefcase, GraduationCap, Info, Search, Loader2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { useLanguage } from "@/components/providers/language-provider";

interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  isPinned: boolean;
  publishedAt: string;
  likesCount: number;
  isLiked: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  [`عام`]: 'bg-blue-500/20 text-blue-300 border-blue-400/35',
  [`أكاديمي`]: 'bg-purple-500/20 text-purple-300 border-purple-400/35',
  [`فعاليات`]: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35',
  [`تدريب`]: 'bg-amber-500/20 text-amber-300 border-amber-400/35',
};

const CATEGORY_ICONS: Record<string, any> = {
  [`عام`]: Info,
  [`أكاديمي`]: GraduationCap,
  [`فعاليات`]: Calendar,
  [`تدريب`]: Briefcase,
};

export default function AnnouncementsPage() {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("الكل");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // Optimistic UI update
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          isLiked: !a.isLiked,
          likesCount: a.isLiked ? a.likesCount - 1 : a.likesCount + 1
        };
      }
      return a;
    }));
    
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      } : null);
    }

    try {
      await fetch(`/api/announcements/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["الكل", ...Array.from(new Set(announcements.map(a => a.category)))];
  
  const filteredAnnouncements = announcements.filter(a => 
    filter === "الكل" ? true : a.category === filter
  );

  return (
    <>
      <PageHeader
        title={t.nav.announcements}
        subtitle={language === "en" ? "Faculty News, Official Memos & Campus Opportunities" : "أهم الأخبار والتعاميم والفرص في الحرم الجامعي"}
      />

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-white tracking-tight">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Megaphone className="w-5 h-5" />
              </div>
              <span>{language === "en" ? "Official Announcements" : "الإعلانات الرسمية"}</span>
            </h2>
            <p className="text-slate-300 mt-1 text-xs sm:text-sm font-normal">
              {language === "en" ? "Latest news and updates from your university administration" : "أحدث التنبيهات والأخبار المعتمدة من عمادة الكلية وإدارة الجامعة"}
            </p>
          </div>
        </div>

      {!loading && announcements.length > 0 && (
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {categories.map(cat => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full whitespace-nowrap text-xs font-semibold px-4 py-2 transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border border-blue-400/40" 
                    : "bg-white/[0.05] hover:bg-white/[0.10] text-slate-200 border border-white/10 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="apple-glass-card flex flex-col items-center justify-center py-20 text-slate-300 shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-400" />
          <p className="text-sm font-medium">جاري تحميل الإعلانات الرسمية...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="apple-glass-card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed shadow-xl">
          <div className="w-16 h-16 bg-white/[0.06] border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-blue-400 shadow-md">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">لا توجد إعلانات حالياً</h3>
          <p className="text-slate-300 text-sm max-w-md">
            لم تقم الجامعة بنشر أي إعلانات في هذا التصنيف بعد. يرجى التحقق لاحقاً.
          </p>
          {filter !== "الكل" && (
            <Button 
              variant="link" 
              onClick={() => setFilter("الكل")} 
              className="mt-4 text-blue-400 hover:text-blue-300 font-semibold"
            >
              عرض كل الإعلانات
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnnouncements.map((announcement) => {
            const Icon = CATEGORY_ICONS[announcement.category] || Info;
            const categoryBadgeStyle = CATEGORY_COLORS[announcement.category] || "bg-slate-500/20 text-slate-300 border-slate-400/35";

            return (
              <div 
                key={announcement.id} 
                className={cn(
                  "apple-glass-card p-5 md:p-6 cursor-pointer hover:border-white/25 active:scale-[0.99] transition-all duration-200 group shadow-xl relative overflow-hidden",
                  announcement.isPinned && "border-s-4 border-s-blue-400"
                )}
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="flex justify-between items-start mb-2.5 gap-4">
                  <div className="flex items-center gap-2">
                    {announcement.isPinned && (
                      <span className="bg-blue-500/25 text-blue-300 border border-blue-400/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                        <Pin className="w-3 h-3" />
                        <span>مثبت</span>
                      </span>
                    )}
                    <span 
                      className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs", categoryBadgeStyle)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{announcement.category}</span>
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
                    {formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true, locale: ar })}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-blue-300 transition-colors line-clamp-1 mb-2 tracking-tight">
                  {announcement.title}
                </h3>
                
                <p className="text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed font-normal">
                  {announcement.body}
                </p>
                
                <div className="flex items-center gap-4 text-slate-300 pt-2 border-t border-white/10">
                  <button 
                    onClick={(e) => handleLike(e, announcement.id)}
                    className={cn(
                      "flex items-center gap-2 text-xs font-semibold transition-colors hover:text-red-400 cursor-pointer",
                      announcement.isLiked ? "text-red-400 font-bold" : "text-slate-300"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", announcement.isLiked && "fill-current text-red-400")} />
                    <span>{announcement.likesCount} إعجاب</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" 
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            className="bg-[#0c152a]/95 border border-white/15 backdrop-blur-3xl rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto relative shadow-2xl text-white space-y-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {selectedAnnouncement.isPinned && (
                  <span className="bg-blue-500/25 text-blue-300 border border-blue-400/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Pin className="w-3 h-3" />
                    <span>مثبت</span>
                  </span>
                )}
                <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", CATEGORY_COLORS[selectedAnnouncement.category] || "bg-slate-500/20 text-slate-300 border-slate-400/35")}>
                  {selectedAnnouncement.category}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-white tracking-tight">
                {selectedAnnouncement.title}
              </h2>
              <div className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>نُشر {formatDistanceToNow(new Date(selectedAnnouncement.publishedAt), { addSuffix: true, locale: ar })}</span>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-white/10 whitespace-pre-wrap leading-relaxed text-slate-200 text-sm md:text-base font-normal">
              {selectedAnnouncement.body}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button 
                onClick={(e) => handleLike(e, selectedAnnouncement.id)}
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-colors hover:text-red-400 cursor-pointer",
                  selectedAnnouncement.isLiked ? "text-red-400" : "text-slate-300"
                )}
              >
                <Heart className={cn("w-5 h-5", selectedAnnouncement.isLiked && "fill-current text-red-400")} />
                <span>{selectedAnnouncement.likesCount} إعجاب</span>
              </button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold border-white/15 rounded-xl text-xs px-5"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
