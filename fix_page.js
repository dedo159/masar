const fs = require('fs');

const arText = {
  all: '\u0627\u0644\u0643\u0644', // الكل
  general: '\u0639\u0627\u0645', // عام
  academic: '\u0623\u0643\u0627\u062F\u064A\u0645\u064A', // أكاديمي
  events: '\u0641\u0639\u0627\u0644\u064A\u0627\u062A', // فعاليات
  internships: '\u062A\u062F\u0631\u064A\u0628', // تدريب
  pinned: '\u0645\u062B\u0628\u062A', // مثبت
  close: '\u0625\u063A\u0644\u0627\u0642', // إغلاق
  announcements: '\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629', // إعلانات الكلية
  subtitle: '\u0623\u0647\u0645 \u0627\u0644\u0623\u062E\u0628\u0627\u0631 \u0648\u0627\u0644\u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u062C\u0627\u0645\u0639\u062A\u0643', // أهم الأخبار والتحديثات الخاصة بجامعتك
  loading: '\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A...', // جاري تحميل الإعلانات...
  emptyTitle: '\u0644\u0627 \u062A\u0648\u062C\u062F \u0625\u0639\u0644\u0627\u0646\u0627\u062A \u062D\u0627\u0644\u064A\u0627\u064B', // لا توجد إعلانات حالياً
  emptyDesc: '\u0644\u0645 \u062A\u0642\u0645 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0628\u0646\u0634\u0631 \u0623\u064A \u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u0628\u0639\u062F. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0644\u0627\u062D\u0642\u0627\u064B.', // لم تقم الجامعة بنشر أي إعلانات في هذا التصنيف بعد. يرجى التحقق لاحقاً.
  showAll: '\u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A', // عرض كل الإعلانات
  published: '\u0646\u064F\u0634\u0631', // نُشر
  likes: '\u0625\u0639\u062C\u0627\u0628', // إعجاب
};

const content = `"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Megaphone, Pin, Calendar, Briefcase, GraduationCap, Info, Search, Loader2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  [\`${arText.general}\`]: 'bg-blue-100 text-blue-800 border-blue-200',
  [\`${arText.academic}\`]: 'bg-purple-100 text-purple-800 border-purple-200',
  [\`${arText.events}\`]: 'bg-green-100 text-green-800 border-green-200',
  [\`${arText.internships}\`]: 'bg-orange-100 text-orange-800 border-orange-200',
};

const CATEGORY_ICONS: Record<string, any> = {
  [\`${arText.general}\`]: Info,
  [\`${arText.academic}\`]: GraduationCap,
  [\`${arText.events}\`]: Calendar,
  [\`${arText.internships}\`]: Briefcase,
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("${arText.all}");
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
      await fetch(\`/api/announcements/\${id}/like\`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["${arText.all}", ...Array.from(new Set(announcements.map(a => a.category)))];
  
  const filteredAnnouncements = announcements.filter(a => 
    filter === "${arText.all}" ? true : a.category === filter
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            ${arText.announcements}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            ${arText.subtitle}
          </p>
        </div>
      </div>

      {!loading && announcements.length > 0 && (
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>${arText.loading}</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-xl bg-card/50 border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">${arText.emptyTitle}</h3>
          <p className="text-muted-foreground max-w-md">
            ${arText.emptyDesc}
          </p>
          {filter !== "${arText.all}" && (
            <Button variant="link" onClick={() => setFilter("${arText.all}")} className="mt-4">
              ${arText.showAll}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnnouncements.map((announcement) => {
            const Icon = CATEGORY_ICONS[announcement.category] || Info;
            return (
              <Card 
                key={announcement.id} 
                className={cn(
                  "cursor-pointer hover:shadow-md transition-all border-l-4",
                  announcement.isPinned ? "border-l-primary" : "border-l-transparent hover:border-l-muted-foreground/30"
                )}
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex items-center gap-2">
                      {announcement.isPinned && (
                        <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 flex items-center gap-1">
                          <Pin className="w-3 h-3" />
                          ${arText.pinned}
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={cn("flex items-center gap-1", CATEGORY_COLORS[announcement.category])}
                      >
                        <Icon className="w-3 h-3" />
                        {announcement.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true, locale: ar })}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{announcement.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {announcement.body}
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <button 
                      onClick={(e) => handleLike(e, announcement.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-500",
                        announcement.isLiked && "text-red-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", announcement.isLiked && "fill-current")} />
                      {announcement.likesCount}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-background rounded-xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto relative shadow-2xl border" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-2">
                {selectedAnnouncement.isPinned && (
                  <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    ${arText.pinned}
                  </Badge>
                )}
                <Badge variant="outline" className={cn(CATEGORY_COLORS[selectedAnnouncement.category])}>
                  {selectedAnnouncement.category}
                </Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{selectedAnnouncement.title}</h2>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                ${arText.published} {formatDistanceToNow(new Date(selectedAnnouncement.publishedAt), { addSuffix: true, locale: ar })}
              </div>
            </div>
            <div className="mt-2 pt-5 border-t whitespace-pre-wrap leading-relaxed text-foreground/90 text-sm md:text-base">
              {selectedAnnouncement.body}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button 
                onClick={(e) => handleLike(e, selectedAnnouncement.id)}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-500",
                  selectedAnnouncement.isLiked ? "text-red-500" : "text-muted-foreground"
                )}
              >
                <Heart className={cn("w-5 h-5", selectedAnnouncement.isLiked && "fill-current")} />
                <span className="text-base">{selectedAnnouncement.likesCount} ${arText.likes}</span>
              </button>
              <Button variant="outline" onClick={() => setSelectedAnnouncement(null)}>
                ${arText.close}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/app/(dashboard)/announcements/page.tsx', content, 'utf8');
