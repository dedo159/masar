"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Building2, Calendar, Clock, AlertCircle, Loader2, X } from "lucide-react";
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

  const categories = [
    { id: "all", label: t.deals.categories.all, matchAr: "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ", matchEn: "all" },
    { id: "restaurants", label: t.deals.categories.restaurants, matchAr: "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ·ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦", matchEn: "restaurant" },
    { id: "bookstores", label: t.deals.categories.bookstores, matchAr: "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾", matchEn: "bookstore" },
    { id: "transport", label: t.deals.categories.transport, matchAr: "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¹آ¾", matchEn: "transport" },
    { id: "shops", label: t.deals.categories.shops, matchAr: "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¬ط·آ·ط¢آ±", matchEn: "shop" },
    { id: "courses", label: t.deals.categories.courses, matchAr: "ط·آ¸ط¦â€™ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¹آ¾", matchEn: "course" },
    { id: "other", label: t.deals.categories.other, matchAr: "ط·آ·ط¢آ£ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸أ¢â‚¬آ°", matchEn: "other" },
  ];

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
    if (cat.includes("ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ·ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦") || lower.includes("restaurant") || lower.includes("food") || lower.includes("dining")) return t.deals.categories.restaurants;
    if (cat.includes("ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾") || lower.includes("bookstore") || lower.includes("library") || lower.includes("print")) return t.deals.categories.bookstores;
    if (cat.includes("ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¹آ¾") || lower.includes("transport") || lower.includes("transit") || lower.includes("bus")) return t.deals.categories.transport;
    if (cat.includes("ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¬ط·آ·ط¢آ±") || lower.includes("shop") || lower.includes("store")) return t.deals.categories.shops;
    if (cat.includes("ط·آ¸ط¦â€™ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¹آ¾") || lower.includes("course") || lower.includes("training")) return t.deals.categories.courses;
    if (cat.includes("ط·آ·ط¢آ£ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸أ¢â‚¬آ°") || lower.includes("other")) return t.deals.categories.other;
    return language === "en" ? t.deals.categories.other : cat;
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
      } else {
        alert(data.error || (language === "en" ? "An error occurred" : "ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ« ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£"));
      }
    } catch {
      alert(language === "en" ? "Connection error" : "ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ« ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ");
    } finally {
      setLoading(false);
      setRedeemLoading(false);
    }
  };

  const closeDialog = () => {
    setSelectedDeal(null);
    setRedeemSuccess(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title={t.deals.title} 
        subtitle={t.deals.subtitle} 
      />
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full flex overflow-x-auto justify-start no-scrollbar mb-4 h-auto py-2 px-1 bg-black/20 border border-white/5 rounded-[16px]">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm whitespace-nowrap px-4 py-2 rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white font-bold">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="rounded-[20px] border border-white/5 bg-card shadow-sm">
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
                      className="group cursor-pointer rounded-[20px] border border-white/5 bg-card hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:border-white/20 active:scale-[0.98] transition-all duration-300 relative overflow-hidden"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <CardTitle className="text-base font-bold text-white line-clamp-1">
                              {translateMerchantName(deal.merchant.businessName, language)}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 text-xs text-white/50 font-medium">
                              <Building2 className="h-3 w-3" />
                              {getCategoryLabel(deal.merchant.category)}
                            </CardDescription>
                          </div>
                          <span className="shrink-0 font-bold px-2 py-1 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[10px]">
                            {translateDiscountLabel(deal.discountLabel, language)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <h4 className="font-bold text-sm mb-1 text-white">{translateDealTitle(deal.title, language)}</h4>
                        <p className="text-xs text-white/60 line-clamp-2 font-medium">
                          {translateDealDescription(deal.description, language)}
                        </p>
                        <div className="flex items-center gap-1 mt-4 text-[10px] text-white/40 font-bold">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {t.deals.expiresOn} {new Date(deal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" className="w-full h-10 min-h-[44px] text-xs font-bold bg-white/5 border-white/5 text-white group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] group-hover:border-[#F97316]/20 transition-colors active:scale-95 rounded-xl"
                        >
                          {t.deals.viewDetails}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-[20px] border border-dashed border-white/10 bg-card/50 transition-colors">
                  <div className="h-16 w-16 rounded-2xl fintech-gradient-orange flex items-center justify-center mb-4 shadow-md text-white">
                    <Tag className="h-8 w-8 fill-white/20" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.deals.emptyTitle}</h3>
                  <p className="text-sm text-white/50 max-w-sm font-medium">
                    {t.deals.emptyDesc}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Modal / Dialog Overlay */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#151530] w-full max-w-lg rounded-[24px] shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-[16px] fintech-gradient-orange flex items-center justify-center text-white shrink-0 shadow-md">
                  <Tag className="h-6 w-6 fill-white/20" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">{translateMerchantName(selectedDeal.merchant.businessName, language)}</h2>
                  <span className="text-xs text-white/50 font-medium">{getCategoryLabel(selectedDeal.merchant.category)}</span>
                </div>
              </div>
              <button 
                onClick={closeDialog}
                aria-label={t.deals.close}
                className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 relative z-10">
              <div>
                <span className="mb-3 text-sm px-3 py-1 font-bold rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 inline-block">
                  {translateDiscountLabel(selectedDeal.discountLabel, language)}
                </span>
                <h3 className="text-2xl font-extrabold text-white leading-tight mb-2">{translateDealTitle(selectedDeal.title, language)}</h3>
                {selectedDeal.description && (
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {translateDealDescription(selectedDeal.description, language)}
                  </p>
                )}
              </div>
              
              {selectedDeal.termsConditions && (
                <div className="bg-black/20 rounded-[16px] p-5 border border-white/5 flex flex-col gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                    <AlertCircle className="h-4 w-4 text-[#F97316]" />
                    {t.deals.terms}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">
                    {translateDealTerms(selectedDeal.termsConditions, language)}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-white/50 font-bold bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t.deals.expiresOn} {new Date(selectedDeal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{t.deals.availableNow}</span>
                </div>
              </div>

              {redeemSuccess && (
                <div className="bg-[#059669]/10 border border-[#059669]/20 text-[#059669] p-3 rounded-xl text-sm font-bold text-center transition-all duration-300">
                  {t.deals.successMsg}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-white/10 bg-black/20 relative z-10">
              <Button 
                className="w-full font-bold h-12 min-h-[48px] text-sm active:scale-95 transition-transform fintech-gradient-orange text-white hover:fintech-glow-orange border-0 rounded-[14px]" onClick={() => handleRedeem(selectedDeal)}
                disabled={redeemLoading || redeemSuccess || redeemedDeals.has(selectedDeal.id)}
              >
                {redeemLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>{t.deals.activating}</span>
                  </>
                ) : redeemSuccess || redeemedDeals.has(selectedDeal.id) ? (
                  t.deals.redeemed
                ) : (
                  t.deals.redeemNow
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
