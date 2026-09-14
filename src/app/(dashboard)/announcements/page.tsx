"use client";

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
  [`عام`]: 'bg-blue-100 text-blue-800 border-blue-200',
  [`أكاديمي`]: 'bg-purple-100 text-purple-800 border-purple-200',
  [`فعاليات`]: 'bg-green-100 text-green-800 border-green-200',
  [`تدريب`]: 'bg-orange-100 text-orange-800 border-orange-200',
};

const CATEGORY_ICONS: Record<string, any> = {
  [`عام`]: Info,
  [`أكاديمي`]: GraduationCap,
  [`فعاليات`]: Calendar,
  [`تدريب`]: Briefcase,
};

export default function AnnouncementsPage() {
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            إعلانات الكلية
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            أهم الأخبار والتحديثات الخاصة بجامعتك
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
          <p>جاري تحميل الإعلانات...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-xl bg-card/50 border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد إعلانات حالياً</h3>
          <p className="text-muted-foreground max-w-md">
            لم تقم الجامعة بنشر أي إعلانات في هذا التصنيف بعد. يرجى التحقق لاحقاً.
          </p>
          {filter !== "الكل" && (
            <Button variant="link" onClick={() => setFilter("الكل")} className="mt-4">
              عرض كل الإعلانات
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
                          مثبت
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
                    مثبت
                  </Badge>
                )}
                <Badge variant="outline" className={cn(CATEGORY_COLORS[selectedAnnouncement.category])}>
                  {selectedAnnouncement.category}
                </Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{selectedAnnouncement.title}</h2>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                نُشر {formatDistanceToNow(new Date(selectedAnnouncement.publishedAt), { addSuffix: true, locale: ar })}
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
                <span className="text-base">{selectedAnnouncement.likesCount} إعجاب</span>
              </button>
              <Button variant="outline" onClick={() => setSelectedAnnouncement(null)}>
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
