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
    { id: "all", label: t.deals.categories.all, matchAr: "الكل", matchEn: "all" },
    { id: "restaurants", label: t.deals.categories.restaurants, matchAr: "مطاعم", matchEn: "restaurant" },
    { id: "bookstores", label: t.deals.categories.bookstores, matchAr: "مكتبات", matchEn: "bookstore" },
    { id: "transport", label: t.deals.categories.transport, matchAr: "مواصلات", matchEn: "transport" },
    { id: "shops", label: t.deals.categories.shops, matchAr: "متاجر", matchEn: "shop" },
    { id: "courses", label: t.deals.categories.courses, matchAr: "كورسات", matchEn: "course" },
    { id: "other", label: t.deals.categories.other, matchAr: "أخرى", matchEn: "other" },
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
    if (cat.includes("مطاعم") || lower.includes("restaurant") || lower.includes("food") || lower.includes("dining")) return t.deals.categories.restaurants;
    if (cat.includes("مكتبات") || lower.includes("bookstore") || lower.includes("library") || lower.includes("print")) return t.deals.categories.bookstores;
    if (cat.includes("مواصلات") || lower.includes("transport") || lower.includes("transit") || lower.includes("bus")) return t.deals.categories.transport;
    if (cat.includes("متاجر") || lower.includes("shop") || lower.includes("store")) return t.deals.categories.shops;
    if (cat.includes("كورسات") || lower.includes("course") || lower.includes("training")) return t.deals.categories.courses;
    if (cat.includes("أخرى") || lower.includes("other")) return t.deals.categories.other;
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
        alert(data.error || (language === "en" ? "An error occurred" : "حدث خطأ"));
      }
    } catch {
      alert(language === "en" ? "Connection error" : "حدث خطأ في الاتصال");
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
                          <span className="shrink-0 font-medium px-2 py-0.5 rounded bg-[#ff5b4f]/10 text-[#ff5b4f] border border-[#ff5b4f]/20 text-[10px]">
                            {translateDiscountLabel(deal.discountLabel, language)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <h4 className="font-bold text-sm mb-1 text-foreground">{translateDealTitle(deal.title, language)}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 text-sm">
                          {translateDealDescription(deal.description, language)}
                        </p>
                        <div className="flex items-center gap-1 mt-4 text-[11px] text-muted-foreground">
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
                  <div className="h-14 w-14 rounded-full bg-[#ff5b4f]/10 flex items-center justify-center mb-4 text-[#ff5b4f]">
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

      {/* Modal / Dialog Overlay */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-lg rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border z-10 relative">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-[#ff5b4f]/10 flex items-center justify-center text-[#ff5b4f] shrink-0 border border-[#ff5b4f]/20">
                  <Tag className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">{translateMerchantName(selectedDeal.merchant.businessName, language)}</h2>
                  <span className="text-xs text-muted-foreground text-xs">{getCategoryLabel(selectedDeal.merchant.category)}</span>
                </div>
              </div>
              <button 
                onClick={closeDialog}
                aria-label={t.deals.close}
                className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 relative z-10">
              <div>
                <span className="mb-3 text-xs px-2.5 py-1 font-medium rounded-full bg-[#ff5b4f]/10 text-[#ff5b4f] border border-[#ff5b4f]/20 inline-block">
                  {translateDiscountLabel(selectedDeal.discountLabel, language)}
                </span>
                <h3 className="text-2xl font-semibold text-foreground tracking-tight leading-tight mb-2">{translateDealTitle(selectedDeal.title, language)}</h3>
                {selectedDeal.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed text-sm">
                    {translateDealDescription(selectedDeal.description, language)}
                  </p>
                )}
              </div>
              
              {selectedDeal.termsConditions && (
                <div className="bg-[#ff5b4f]/5 rounded-lg p-4 border border-[#ff5b4f]/20 flex flex-col gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertCircle className="h-4 w-4 text-[#ff5b4f]" />
                    {t.deals.terms}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {translateDealTerms(selectedDeal.termsConditions, language)}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground font-bold bg-secondary rounded-lg p-3 border border-border text-foreground font-mono">
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
                <div className="bg-[#0072f5]/10 border border-[#0072f5]/20 text-[#0072f5] p-3 rounded-md text-sm font-medium text-center transition-all duration-300">
                  {t.deals.successMsg}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-secondary/30 relative z-10">
              <Button 
                className="w-full font-bold h-11 min-h-[44px] text-sm active:scale-95 transition-transform" 
                onClick={() => handleRedeem(selectedDeal)}
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
