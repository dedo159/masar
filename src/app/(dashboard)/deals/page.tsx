"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tag,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  RotateCw,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/components/providers/language-provider";
import {
  translateMerchantName,
  translateDiscountLabel,
  translateDealTitle,
  translateDealDescription,
  translateDealTerms,
} from "@/lib/translations/deals";

// Type definitions based on schema
interface Merchant {
  businessName: string;
  logoUrl: string | null;
  category: string;
}

interface Deal {
  id: string;
  title: string;
  description: string | null;
  discountLabel: string;
  termsConditions: string | null;
  validFrom: string;
  validUntil: string;
  merchant: Merchant;
  usedCount?: number;
  maxUsesPerStudent?: number;
}

// Crisp 25x25 Procedural SVG QR Code Renderer
function StudentQrSvg({ payload, seed = 1234 }: { payload: string; seed?: number }) {
  const size = 25;
  const grid: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
  }

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        grid[16 + r][16 + c] = true;
      }
    }
  }

  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 31 + payload.charCodeAt(i) + seed) & 0x7fffffff;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const inAlign = r >= 15 && r <= 21 && c >= 15 && c <= 21;
      const isTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);

      if (!inTL && !inTR && !inBL && !inAlign && !isTiming) {
        const bit = ((hash ^ (r * 17 + c * 37 + seed)) >>> ((r + c) % 16)) & 1;
        grid[r][c] = bit === 1;
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full rounded-lg bg-white p-2">
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill="#090d14"
              rx={0.15}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function DealsPage() {
  const { t, language } = useLanguage();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [redeemedDeals, setRedeemedDeals] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState(false);
  const [rollingTimer, setRollingTimer] = useState(30);
  const [rollingToken, setRollingToken] = useState("MSR-8829-X");
  const [tokenSeed, setTokenSeed] = useState(8829);

  // Track student usage count per deal: { dealId: number of times used }
  const [studentUsageMap, setStudentUsageMap] = useState<Record<string, number>>({
    "deal-1": 1, // عمر خالد استخدم العرض الأول مرة واحدة
    "deal-2": 2, // استخدم العرض الثاني مرتين
    "deal-3": 1, // استخدم العرض الثالث مرة واحدة
  });

  // Helper to determine allowed usage limit for each deal (e.g. 3 times, 5 times)
  const getDealUsageLimit = (deal: Deal) => {
    if (deal.maxUsesPerStudent) return deal.maxUsesPerStudent;
    const title = deal.title.toLowerCase();
    if (title.includes("شاورما") || title.includes("برغر") || title.includes("burger")) return 3;
    if (title.includes("قهوة") || title.includes("مشروب") || title.includes("coffee")) return 5;
    if (title.includes("bogo") || title.includes("مجانية")) return 2;
    return 3; // Default limit: 3 times per student
  };

  const getStudentUsedCount = (dealId: string) => {
    return studentUsageMap[dealId] || 0;
  };

  const categories = [
    { id: "all", label: t.deals.categories.all, matchAr: "الكل", matchEn: "all" },
    { id: "restaurants", label: t.deals.categories.restaurants, matchAr: "مطاعم", matchEn: "restaurant" },
    { id: "bookstores", label: t.deals.categories.bookstores, matchAr: "مكتبات", matchEn: "bookstore" },
    { id: "transport", label: t.deals.categories.transport, matchAr: "مواصلات", matchEn: "transport" },
    { id: "shops", label: t.deals.categories.shops, matchAr: "متاجر", matchEn: "shop" },
    { id: "courses", label: t.deals.categories.courses, matchAr: "كورسات", matchEn: "course" },
    { id: "other", label: t.deals.categories.other, matchAr: "أخرى", matchEn: "other" },
  ];

  // Dynamic 30s token refresh loop - runs once every 30 seconds only
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (selectedDeal) {
      interval = setInterval(() => {
        setRollingTimer((prev) => {
          if (prev <= 1) {
            const num = Math.floor(1000 + Math.random() * 9000);
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            const char = chars[Math.floor(Math.random() * chars.length)];
            setRollingToken(`MSR-${num}-${char}`);
            setTokenSeed(num); // only changes once every 30s
            return 30; // resets for exactly another 30 seconds
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedDeal]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/student/deals");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error("Error loading deals", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (!cat) return "";
    const lower = cat.toLowerCase();
    if (cat.includes("مطاعم") || lower.includes("restaurant") || lower.includes("food") || lower.includes("dining")) return t.deals.categories.restaurants;
    if (cat.includes("مكتبات") || lower.includes("bookstore") || lower.includes("library") || lower.includes("print")) return t.deals.categories.bookstores;
    if (cat.includes("مواصلات") || lower.includes("transport") || lower.includes("transit") || lower.includes("bus")) return t.deals.categories.transport;
    if (cat.includes("متاجر") || lower.includes("shop") || lower.includes("store")) return t.deals.categories.shops;
    if (cat.includes("كورسات") || lower.includes("course") || lower.includes("training")) return t.deals.categories.courses;
    if (cat.includes("أخرى") || lower.includes("other")) return t.deals.categories.other;
    return language === "en" ? t.deals.categories.other : cat;
  };

  // Derive the voucher code to present to cashier
  const getVoucherCode = (deal: Deal) => {
    const title = deal.title.toLowerCase();
    if (title.includes("برغر") || title.includes("burger") || deal.discountLabel.includes("50")) return "BURGER50";
    if (title.includes("قهوة") || title.includes("مشروب") || title.includes("coffee") || title.includes("مجاني")) return "FREECOFFEE";
    return "MASAR20";
  };

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const filteredDeals = activeCategory === "all" 
    ? deals 
    : deals.filter((deal) => {
        const cat = (deal.merchant.category || "").toLowerCase();
        return (
          (currentCategory?.matchAr && cat.includes(currentCategory.matchAr)) ||
          (currentCategory?.matchEn && cat.includes(currentCategory.matchEn)) ||
          cat === currentCategory?.id
        );
      });

  const handleRedeem = async (deal: Deal) => {
    const currentUsage = getStudentUsedCount(deal.id);
    const maxAllowed = getDealUsageLimit(deal);
    if (currentUsage >= maxAllowed) {
      alert(language === "en" ? "You have reached the maximum allowed uses for this deal" : "لقد استنفدت الحد الأقصى المسموح به لاستخدام هذا العرض");
      return;
    }

    setRedeemLoading(true);
    setRedeemSuccess(false);
    try {
      const res = await fetch(`/api/student/deals/${deal.id}/redeem`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setRedeemSuccess(true);
        setRedeemedDeals((prev) => new Set(prev).add(deal.id));
        setStudentUsageMap((prev) => ({
          ...prev,
          [deal.id]: (prev[deal.id] || 0) + 1,
        }));
      } else {
        alert(data.error || (language === "en" ? "An error occurred" : "حدث خطأ"));
      }
    } catch {
      alert(language === "en" ? "Connection error" : "حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
      setRedeemLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const closeDialog = () => {
    setSelectedDeal(null);
    setRedeemSuccess(false);
    setRollingTimer(30);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title={t.deals.title} 
        subtitle={t.deals.subtitle} 
      />
      
      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full flex overflow-x-auto justify-start no-scrollbar mb-4 h-auto py-2 px-1 bg-secondary/50 border border-border rounded-lg">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm whitespace-nowrap px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium text-muted-foreground">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="vercel-card">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-2 w-full">
                              <Skeleton className="h-5 w-3/4 max-w-[200px]" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-md shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-2.5">
                          <Skeleton className="h-4 w-full" />
                          <div className="space-y-1.5 pt-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                          </div>
                          <Skeleton className="h-3 w-32 mt-4" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 min-h-[44px] w-full rounded-md" />
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : filteredDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDeals.map((deal) => (
                    <Card 
                      key={deal.id} 
                      className="group cursor-pointer vercel-card relative overflow-hidden active:scale-[0.99] transition-transform"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <CardTitle className="text-base font-medium text-foreground line-clamp-1">
                              {translateMerchantName(deal.merchant.businessName, language)}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 text-xs text-muted-foreground text-xs">
                              <Building2 className="h-3 w-3" />
                              {getCategoryLabel(deal.merchant.category)}
                            </CardDescription>
                          </div>
                          <span className="shrink-0 font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px]">
                            {translateDiscountLabel(deal.discountLabel, language)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <h4 className="font-bold text-sm mb-1 text-foreground">{translateDealTitle(deal.title, language)}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 text-sm">
                          {translateDealDescription(deal.description, language)}
                        </p>
                        {/* Usage Counter Pill (عدد مرات الاستخدام من أصل المسموح) */}
                        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">مرات الاستخدام:</span>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                            getStudentUsedCount(deal.id) >= getDealUsageLimit(deal)
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}>
                            {getStudentUsedCount(deal.id)} / {getDealUsageLimit(deal)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-2.5 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {t.deals.expiresOn} {new Date(deal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full h-10 min-h-[44px] text-xs font-medium group-hover:bg-primary/5 group-hover:text-primary transition-colors active:scale-95"
                        >
                          {t.deals.viewDetails}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4 rounded-lg border border-dashed border-border bg-secondary/30">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Tag className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">{t.deals.emptyTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm font-medium">
                    {t.deals.emptyDesc}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Modal / Dialog Overlay with Student QR Code & Voucher Bar */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 relative text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border z-10 relative">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-foreground">
                    {translateMerchantName(selectedDeal.merchant.businessName, language)}
                  </h2>
                  <span className="text-xs text-muted-foreground">{getCategoryLabel(selectedDeal.merchant.category)}</span>
                </div>
              </div>
              <button 
                onClick={closeDialog}
                aria-label={t.deals.close}
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 relative z-10">
              {/* Deal Heading */}
              <div>
                <span className="mb-2 text-xs px-2.5 py-0.5 font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-block">
                  {translateDiscountLabel(selectedDeal.discountLabel, language)}
                </span>
                <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight mb-1">
                  {translateDealTitle(selectedDeal.title, language)}
                </h3>
                {selectedDeal.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {translateDealDescription(selectedDeal.description, language)}
                  </p>
                )}
              </div>

              {/* ========================================================================= */}
              {/* عداد مرات استخدام الكود من أصل المسموح (Deal Usage Quota Tracker) */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-border bg-background/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>مرات استخدام الكود:</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-base font-bold text-foreground">
                      {getStudentUsedCount(selectedDeal.id)}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {getDealUsageLimit(selectedDeal)} مرات مسموحة
                    </span>
                  </div>
                </div>

                {/* Progress bar of usage quota */}
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      getStudentUsedCount(selectedDeal.id) >= getDealUsageLimit(selectedDeal)
                        ? "bg-rose-500"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (getStudentUsedCount(selectedDeal.id) / getDealUsageLimit(selectedDeal)) * 100
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {getDealUsageLimit(selectedDeal) - getStudentUsedCount(selectedDeal.id) > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        متبقي لك {getDealUsageLimit(selectedDeal) - getStudentUsedCount(selectedDeal.id)} استخدامات
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium">
                        استنفدت كامل الحد المسموح لهذا العرض
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground">حصة الطالب الفردية</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* باركود الطالب وكود القسيمة (Student QR Code & Voucher Presentation) */}
              {/* ========================================================================= */}
              <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 flex flex-col items-center text-center relative overflow-hidden space-y-3">
                {/* QR Header */}
                <div className="w-full flex items-center justify-center pb-2 border-b border-border/70 text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span>رمز الاستبدال عند الكاشير (QR Voucher):</span>
                  </span>
                </div>

                {/* The QR Code Graphic Box */}
                <div className="relative w-48 h-48 rounded-xl p-2.5 bg-white shadow-md flex items-center justify-center border-2 border-primary/20">
                  <StudentQrSvg
                    payload={`MASAR:STU:202310890:${rollingToken}`}
                    seed={tokenSeed}
                  />

                  {/* Anti-screenshot Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 opacity-25 select-none rotate-[-12deg]">
                    <span className="text-[8px] font-mono text-slate-900 font-bold uppercase">
                      عمر خالد • ****1089
                    </span>
                    <span className="text-[8px] font-mono text-slate-900 font-bold uppercase text-right">
                      {rollingToken}
                    </span>
                  </div>
                </div>

                {/* Linear Countdown Bar (30s cycle) */}
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <RotateCw className={`h-3 w-3 text-cyan-500 ${rollingTimer <= 5 ? "animate-spin" : ""}`} />
                      <span>يتجدد الرمز تلقائياً خلال:</span>
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{rollingTimer} ثانية</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${(rollingTimer / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Voucher Code Strings & Copy Buttons */}
                <div className="w-full space-y-2">
                  <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-background border border-border">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block font-medium">
                        رمز التحقق المتغير (يتجدد كل 30 ثانية):
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest block">
                        {rollingToken}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(rollingToken)}
                      className="border-border text-xs gap-1.5 h-8 sm:h-9 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>نسخ الرمز</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-background/60 border border-border/60 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground">كود العرض الثابت:</span>
                      <span className="font-mono font-semibold text-foreground mr-1.5">
                        {getVoucherCode(selectedDeal)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(getVoucherCode(selectedDeal))}
                      className="text-[11px] text-primary hover:underline font-mono"
                    >
                      نسخ الكوبون
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  أبرز هذا الرمز لموظف الصندوق / الكاشير ليقوم بمسحه مباشرة بكاميرا نقطة البيع أو إدخال الكود أعلاه. يتجدد الرمز مرة واحدة كل 30 ثانية لضمان الأمان ومكافحة الاحتيال.
                </p>
              </div>

              {/* Terms & Conditions */}
              {selectedDeal.termsConditions && (
                <div className="bg-muted/60 rounded-xl p-3.5 border border-border flex flex-col gap-1.5">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>{t.deals.terms}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {translateDealTerms(selectedDeal.termsConditions, language)}
                  </p>
                </div>
              )}
              
              {/* Expiry Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 rounded-xl p-3 border border-border font-mono">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t.deals.expiresOn} {new Date(selectedDeal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t.deals.availableNow}</span>
                </div>
              </div>

              {redeemSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تم تفعيل العرض وتوثيق الحصة للطالب بنجاح!</span>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 relative z-10 flex items-center justify-end">
              <Button 
                variant="outline"
                className="w-full font-medium h-10 text-xs border-border hover:bg-muted active:scale-95 transition-transform cursor-pointer" 
                onClick={closeDialog}
              >
                {t.deals.close || "إغلاق"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
