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
    { id: "all", label: t.deals.categories.all, matchAr: "الكل" },
    { id: "restaurants", label: t.deals.categories.restaurants, matchAr: "مطاعم" },
    { id: "bookstores", label: t.deals.categories.bookstores, matchAr: "مكتبات" },
    { id: "transport", label: t.deals.categories.transport, matchAr: "مواصلات" },
    { id: "shops", label: t.deals.categories.shops, matchAr: "متاجر" },
    { id: "courses", label: t.deals.categories.courses, matchAr: "كورسات" },
    { id: "other", label: t.deals.categories.other, matchAr: "أخرى" },
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

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const filteredDeals = activeCategory === "all" 
    ? deals 
    : deals.filter((deal) => {
        const cat = deal.merchant.category || "";
        return cat === currentCategory?.matchAr || cat.includes(currentCategory?.matchAr || "");
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
          <TabsList className="w-full flex overflow-x-auto justify-start no-scrollbar mb-4 h-auto py-2 px-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm whitespace-nowrap px-4 py-2">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDeals.map((deal) => (
                    <Card 
                      key={deal.id} 
                      className="group cursor-pointer hover:border-primary/50 transition-colors duration-200"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <CardTitle className="text-base font-semibold line-clamp-1">
                              {deal.merchant.businessName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                              <Building2 className="h-3 w-3" />
                              {deal.merchant.category}
                            </CardDescription>
                          </div>
                          <Badge variant="warning" className="shrink-0 font-bold px-2 py-1">
                            {deal.discountLabel}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <h4 className="font-medium text-sm mb-1">{deal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {deal.description || (language === "en" ? "No additional description." : "لا يوجد وصف إضافي.")}
                        </p>
                        <div className="flex items-center gap-1 mt-4 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {t.deals.expiresOn} {new Date(deal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full text-xs font-medium group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                        >
                          {t.deals.viewDetails}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">{t.deals.emptyTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
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
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-base">{selectedDeal.merchant.businessName}</h2>
                  <span className="text-xs text-muted-foreground">{selectedDeal.merchant.category}</span>
                </div>
              </div>
              <button 
                onClick={closeDialog}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              <div>
                <Badge variant="warning" className="mb-3 text-sm px-3 py-1 font-bold">
                  {selectedDeal.discountLabel}
                </Badge>
                <h3 className="text-xl font-bold leading-tight mb-2">{selectedDeal.title}</h3>
                {selectedDeal.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedDeal.description}
                  </p>
                )}
              </div>
              
              {selectedDeal.termsConditions && (
                <div className="bg-secondary/50 rounded-xl p-4 border border-border flex flex-col gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    {t.deals.terms}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedDeal.termsConditions}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-background rounded-lg p-3 border border-border">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t.deals.expiresOn} {new Date(selectedDeal.validUntil).toLocaleDateString(language === "en" ? "en-US" : "ar-JO")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{language === "en" ? "Available Now" : "متاح الآن"}</span>
                </div>
              </div>

              {redeemSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm font-medium text-center transition-all duration-300">
                  {t.deals.successMsg}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <Button 
                className="w-full font-bold h-11 text-sm" 
                onClick={() => handleRedeem(selectedDeal)}
                disabled={redeemLoading || redeemSuccess || redeemedDeals.has(selectedDeal.id)}
              >
                {redeemLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>{language === "en" ? "Activating..." : "جاري التفعيل..."}</span>
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
