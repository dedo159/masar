"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Store,
  MapPin,
  KeyRound,
  DollarSign,
  Bell,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Save,
  Sun,
  Moon,
  Laptop,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  FileText,
  Lock,
  RefreshCw,
  QrCode,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface BranchItem {
  id: string;
  name: string;
  campus: string;
  city: string;
  active: boolean;
  isDefault: boolean;
  cashierName: string;
}

export default function MerchantSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "branches" | "cashier" | "financial" | "notifications" | "system"
  >("profile");

  // Save feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedCashierUrl, setCopiedCashierUrl] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Store Profile State
  const [storeProfile, setStoreProfile] = useState({
    businessName: "مطعم شاورما الضيعة",
    legalName: "شركة الضيعة للمأكولات السريعة ذ.م.م",
    category: "مطاعم ومأكولات سريعة",
    phone: "+962 7 9123 4567",
    whatsapp: "+962 7 9123 4567",
    email: "shawarma@aldiaa.jo",
    website: "https://aldiaa.jo",
    taxNumber: "JO-20491823",
    commercialRegister: "CR-992140",
    description:
      "مطعم شاورما الضيعة يقدم أشهى وجبات الشاورما والمقبلات الشامية الطازجة يومياً للطلاب بأسعار وخصومات حصرية عبر مسار.",
  });

  // Cashier PIN State
  const [cashierPin, setCashierPin] = useState("1234");
  const [cashierUrl, setCashierUrl] = useState("/merchant/cashier");

  // Branches State
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: "uj",
      name: "فرع الجامعة الأردنية",
      campus: "مجمّع العلوم والطب — البوابة الشمالية",
      city: "عمان — الجبيهة",
      active: true,
      isDefault: true,
      cashierName: "كاشير 1 (الرئيسي)",
    },
    {
      id: "amman-ahliyya",
      name: "فرع جامعة عمان الأهلية",
      campus: "بوابة الطلبة الرئيسية — مجمع الخدمات",
      city: "عمان / السلط",
      active: true,
      isDefault: false,
      cashierName: "كاشير الصالة",
    },
    {
      id: "just",
      name: "فرع جامعة العلوم والتكنولوجيا (JUST)",
      campus: "المجمّع التجاري والأنشطة الطلابية",
      city: "إربد — الرمثا",
      active: true,
      isDefault: false,
      cashierName: "كاشير الرمثا",
    },
    {
      id: "yarmouk",
      name: "فرع جامعة اليرموك",
      campus: "شارع الجامعة — مقابل البوابة الجنوبية",
      city: "إربد — قصبة إربد",
      active: true,
      isDefault: false,
      cashierName: "كاشير إربد",
    },
    {
      id: "bau",
      name: "فرع جامعة البلقاء التطبيقية",
      campus: "البوابة الرئيسية — شارع الأكاديمية",
      city: "السلط — المركز",
      active: false,
      isDefault: false,
      cashierName: "كاشير السلط",
    },
  ]);

  // Financial Settings State
  const [payoutMethod, setPayoutMethod] = useState<"iban" | "cliq">("iban");
  const [financialDetails, setFinancialDetails] = useState({
    bankName: "البنك العربي (Arab Bank)",
    beneficiaryName: "شركة الضيعة للمأكولات السريعة ذ.م.م",
    iban: "JO94ARAB0120000001234567890123",
    cliqAlias: "ALDIAA.REST",
    settlementCycle: "weekly_thursday",
    minPayoutAmount: 50,
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    instantRedemption: true,
    capReachedWarning: true,
    weeklyPayoutNotice: true,
    campusDropUpdates: true,
    emailReceipts: true,
    smsAlerts: false,
  });

  // Security Settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordNotice, setPasswordNotice] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedPin = localStorage.getItem("masar_cashier_pin");
      if (savedPin) {
        setCashierPin(savedPin);
      }
      const fullUrl = `${window.location.origin}/merchant/cashier`;
      setCashierUrl(fullUrl);

      const savedName = localStorage.getItem("masar_store_name");
      if (savedName) {
        setStoreProfile((prev) => ({ ...prev, businessName: savedName }));
      }
    }
  }, []);

  const handleCopyPin = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(cashierPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleCopyCashierUrl = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(cashierUrl);
      setCopiedCashierUrl(true);
      setTimeout(() => setCopiedCashierUrl(false), 2000);
    }
  };

  const handleToggleBranch = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const handleSetDefaultBranch = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => ({
        ...b,
        isDefault: b.id === id,
        active: b.id === id ? true : b.active,
      }))
    );
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("masar_cashier_pin", cashierPin);
      localStorage.setItem("masar_store_name", storeProfile.businessName);
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordNotice("كلمة المرور الجديدة يجب أن تتكون من 6 خانات على الأقل");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordNotice("كلمة المرور الجديدة غير متطابقة مع خانة التأكيد");
      return;
    }
    setPasswordNotice("تم تحديث كلمة المرور بنجاح");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordNotice(""), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" dir="rtl">
      {/* Top Header & Save Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Sliders className="h-4 w-4" />
            <span>لوحة التاجر · الإعدادات والتحكم</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            إعدادات المتجر والحساب
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            تحكم ببيانات المتجر، وفروع الجامعات، وأمان الكاشير، والحسابات المالية والتنبيهات
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>تم حفظ كافة التغييرات!</span>
            </div>
          )}

          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/70 border border-border overflow-x-auto scrollbar-none">
        {[
          { id: "profile", label: "بيانات المتجر", icon: Store },
          { id: "branches", label: "فروع الجامعات", icon: MapPin, count: branches.filter((b) => b.active).length },
          { id: "cashier", label: "أمان الكاشير وPIN", icon: KeyRound },
          { id: "financial", label: "البيانات المالية", icon: DollarSign },
          { id: "notifications", label: "التنبيهات", icon: Bell },
          { id: "system", label: "المظهر والأمان", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-mono font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: STORE PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-sm font-bold text-foreground">معلومات النشاط التجاري والعلامة</h2>
                <p className="text-xs text-muted-foreground">
                  البيانات التي تظهر للطلاب في تطبيق مسار وعلى قسائم الخصم
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>اسم المتجر التجاري (Brand Name)</span>
                </label>
                <input
                  type="text"
                  value={storeProfile.businessName}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, businessName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>الاسم القانوني للمنشأة (Legal Entity)</span>
                </label>
                <input
                  type="text"
                  value={storeProfile.legalName}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, legalName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>تصنيف النشاط</span>
                </label>
                <select
                  value={storeProfile.category}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                >
                  <option value="مطاعم ومأكولات سريعة">مطاعم ومأكولات سريعة</option>
                  <option value="كافيهات ومشروبات مختصة">كافيهات ومشروبات مختصة</option>
                  <option value="قرطاسية وخدمات طلابية وطباعة">قرطاسية وخدمات طلابية وطباعة</option>
                  <option value="مكتبات وكتب جامعية">مكتبات وكتب جامعية</option>
                  <option value="أجهزة وإلكترونيات وصيانة">أجهزة وإلكترونيات وصيانة</option>
                  <option value="مراكز تدريب وكورسات">مراكز تدريب وكورسات</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>البريد الإلكتروني للإشعارات والفواتير</span>
                </label>
                <input
                  type="email"
                  value={storeProfile.email}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>رقم الهاتف المعتمد</span>
                </label>
                <input
                  type="text"
                  value={storeProfile.phone}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>رقم الواتساب للتنبيهات الفورية</span>
                </label>
                <input
                  type="text"
                  value={storeProfile.whatsapp}
                  onChange={(e) =>
                    setStoreProfile({ ...storeProfile, whatsapp: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                نبذة تعريفية بالمتجر (تظهر لطلاب الجامعات في صفحة المتجر)
              </label>
              <textarea
                rows={3}
                value={storeProfile.description}
                onChange={(e) =>
                  setStoreProfile({ ...storeProfile, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANCHES */}
      {activeTab === "branches" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-sm font-bold text-foreground">إدارة الفروع الجامعية المعتمدة</h2>
                  <p className="text-xs text-muted-foreground">
                    تفعيل أو تعطيل استقبال الطلاب في كل فرع، وتعيين الفرع الافتراضي
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  الفروع النشطة: {branches.filter((b) => b.active).length} من {branches.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                    branch.active
                      ? "bg-card border-border hover:border-primary/40"
                      : "bg-muted/40 border-border/60 opacity-65"
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                        branch.active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-foreground">
                          {branch.name}
                        </span>
                        {branch.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            الفرع الرئيسي الافتراضي
                          </span>
                        )}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            branch.active
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground border border-border"
                          )}
                        >
                          {branch.active ? "يستقبل الطلاب" : "معطل مؤقتاً"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">{branch.campus}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground font-mono">
                        <span>{branch.city}</span>
                        <span>·</span>
                        <span className="text-foreground font-medium">{branch.cashierName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60 w-full md:w-auto justify-between md:justify-end">
                    {!branch.isDefault && branch.active && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultBranch(branch.id)}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        تعيين كفرع افتراضي
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {branch.active ? "نشط" : "معطّل"}
                      </span>
                      <Switch
                        checked={branch.active}
                        onCheckedChange={() => handleToggleBranch(branch.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CASHIER SECURITY & PIN */}
      {activeTab === "cashier" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <KeyRound className="h-5 w-5 text-amber-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">أمان ووصول نقطة بيع الكاشير (POS PIN)</h2>
                <p className="text-xs text-muted-foreground">
                  رمز الدخول السريع لموظفي الكاشير وروابط شاشة المسح المستقلة
                </p>
              </div>
            </div>

            {/* PIN Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                    رمز PIN السريع للدخول إلى شاشة الكاشير
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    يستخدمه موظف الكاشير عند البوابة للدخول فورياً إلى محطة مسح QR دون كلمة مرور الحساب
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={cashierPin}
                      maxLength={4}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCashierPin(val);
                      }}
                      className="w-32 px-3 py-2 text-center font-mono text-lg font-black tracking-widest rounded-xl bg-background border-2 border-amber-500/40 text-foreground focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title={showPin ? "إخفاء الرمز" : "إظهار الرمز"}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    {copiedPin ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>نسخ PIN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/80 border border-amber-500/20 text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p>
                  يتم حفظ الرمز وتفعيله فورياً. يرجى تزويد موظفي الكاشير في الفروع بالرمز الجديد بعد الحفظ
                  لتمكينهم من تسجيل الدخول.
                </p>
              </div>
            </div>

            {/* Cashier Page Direct Access */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-3">
              <span className="text-xs font-bold text-foreground block">
                رابط محطة الكاشير المستقلة (POS Terminal Link)
              </span>
              <p className="text-xs text-muted-foreground">
                صفحة الكاشير معزولة ومحمية، ولا تحتوي على أي أرباح أو تحويلات بنكية أو قوائم إدارية
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <div className="flex-1 px-3.5 py-2 rounded-xl bg-muted border border-border font-mono text-xs text-foreground truncate text-left" dir="ltr">
                  {cashierUrl}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCashierUrl}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-secondary border border-border text-xs font-semibold hover:bg-secondary/80 cursor-pointer transition-colors shrink-0"
                >
                  {copiedCashierUrl ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">تم نسخ الرابط</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>

                <Link
                  href="/merchant/cashier"
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer transition-colors shrink-0 shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>فتح شاشة الكاشير</span>
                </Link>
              </div>
            </div>

            {/* Cashier Permissions Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>صلاحيات الكاشير المتاحة</span>
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  مسح QR بالكاميرا، التأكد من هوية الطالب، وتأكيد خصم الوجبة أو الكوبون فورياً.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-rose-500" />
                  <span>البيانات المحجوبة تلقائياً</span>
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  حظر كامل للتقارير المالية، التسويات البنكية، أرباح المتجر، وتعديل إعدادات العروض.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>حماية الاحتيال (Dynamic QR)</span>
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  التحقق من صلاحية الكود المتجدد كل 30 ثانية وحظر الكوبونات المستهلكة مسبقاً.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL & PAYOUTS */}
      {activeTab === "financial" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">بيانات الحساب البنكي وتحويل العوائد</h2>
                <p className="text-xs text-muted-foreground">
                  تحديد طريقة استلام المستحقات والتسويات الأسبوعية عن مبيعات وخصومات مسار
                </p>
              </div>
            </div>

            {/* Payout Method Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">طريقة استلام الأرباح المفضلة</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayoutMethod("iban")}
                  className={cn(
                    "p-4 rounded-xl border text-right transition-all cursor-pointer",
                    payoutMethod === "iban"
                      ? "bg-primary/5 border-primary text-primary ring-1 ring-primary/40 shadow-xs"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      تحويل بنكي محلي (IBAN)
                    </span>
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    تحويل مباشر إلى الحساب البنكي التجاري للمنشأة في أي بنك أردني
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPayoutMethod("cliq")}
                  className={cn(
                    "p-4 rounded-xl border text-right transition-all cursor-pointer",
                    payoutMethod === "cliq"
                      ? "bg-primary/5 border-primary text-primary ring-1 ring-primary/40 shadow-xs"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      نظام الدفع الفوري كليك (CliQ)
                    </span>
                    <QrCode className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    تحويل فوري لحظي عبر الاسم المستعار (CliQ Alias) المسجل لدى البنك
                  </p>
                </button>
              </div>
            </div>

            {/* Financial Details Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">اسم البنك المعتمد</label>
                <input
                  type="text"
                  value={financialDetails.bankName}
                  onChange={(e) =>
                    setFinancialDetails({ ...financialDetails, bankName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">اسم المستفيد كما هو في البنك</label>
                <input
                  type="text"
                  value={financialDetails.beneficiaryName}
                  onChange={(e) =>
                    setFinancialDetails({
                      ...financialDetails,
                      beneficiaryName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {payoutMethod === "iban" ? (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">رقم الآيبان الدولي (IBAN)</label>
                  <input
                    type="text"
                    value={financialDetails.iban}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, iban: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono tracking-wider focus:ring-2 focus:ring-primary focus:outline-hidden text-left"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">معرّف كليك (CliQ Alias / Username)</label>
                  <input
                    type="text"
                    value={financialDetails.cliqAlias}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, cliqAlias: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono tracking-wider focus:ring-2 focus:ring-primary focus:outline-hidden text-left"
                    dir="ltr"
                  />
                </div>
              )}
            </div>

            {/* Payout Schedule Notice */}
            <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-foreground block">
                  دورة التسوية التلقائية: كل يوم خميس أسبوعياً
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  يتم تجميع كافة عمليات الخصم المحققة للطلاب من بداية الأسبوع حتى نهايته وتحويلها مباشرة
                  إلى حسابكم المعتمد مع إشعار بالتحويل وفاتورة ضريبية بصيغة PDF قابلة للتحميل من قسم{" "}
                  <Link href="/merchant/settlements" className="text-primary font-bold hover:underline">
                    مركز التسويات والفواتير
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-sm font-bold text-foreground">خيارات التنبيهات والإشعارات</h2>
                <p className="text-xs text-muted-foreground">
                  تحديد الأحداث التي ترغب بتلقي إشعارات فورية وتقارير دورية عنها
                </p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-border/60">
              <div className="flex items-center justify-between pt-3 first:pt-0">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    إشعار فوري عند مسح أي كوبون أو خصم
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    تنبيه حي عند إتمام الطالب عملية شراء ناجحة عبر الكاشير في أي فرع
                  </p>
                </div>
                <Switch
                  checked={notifications.instantRedemption}
                  onCheckedChange={(c) =>
                    setNotifications({ ...notifications, instantRedemption: c })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    تحذير اقتراب سقف العرض من النفاد (80% و 100%)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    تنبيه مبكر قبل إغلاق العرض تلقائياً لتتمكن من تمديده أو زيادة سقفه
                  </p>
                </div>
                <Switch
                  checked={notifications.capReachedWarning}
                  onCheckedChange={(c) =>
                    setNotifications({ ...notifications, capReachedWarning: c })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    إشعار التحويل البنكي الأسبوعي وملخص الفواتير
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    إرسال إشعار يوم الخميس عند اكتمال إيداع مستحقات المتجر في الحساب البنكي
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyPayoutNotice}
                  onCheckedChange={(c) =>
                    setNotifications({ ...notifications, weeklyPayoutNotice: c })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    تقارير حملات البث الجامعي الخاطف (Campus Drops)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    إحصائيات فورية عن عدد الطلاب الذين فتحوا الإشعار واستجابوا للحملة
                  </p>
                </div>
                <Switch
                  checked={notifications.campusDropUpdates}
                  onCheckedChange={(c) =>
                    setNotifications({ ...notifications, campusDropUpdates: c })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    إرسال ملخص الفواتير إلى البريد الإلكتروني
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    إرسال ملف PDF رسمي دورياً إلى بريد المتجر المعتمد
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReceipts}
                  onCheckedChange={(c) =>
                    setNotifications({ ...notifications, emailReceipts: c })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DISPLAY & SECURITY */}
      {activeTab === "system" && (
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Sun className="h-5 w-5 text-amber-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">تفضيلات المظهر والعرض</h2>
                <p className="text-xs text-muted-foreground">
                  تخصيص نمط العرض المناسب للوحة التحكم وشاشات نقاط البيع
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "light", label: "الوضع النهاري (فاتح)", icon: Sun },
                { id: "dark", label: "الوضع الليلي (داكن)", icon: Moon },
                { id: "system", label: "تلقائي بحسب الجهاز", icon: Laptop },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = mounted && theme === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTheme(mode.id)}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-bold ring-1 ring-primary"
                        : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-sm font-bold text-foreground">أمان الحساب وكلمة المرور</h2>
                <p className="text-xs text-muted-foreground">
                  تحديث كلمة مرور الدخول الخاصة بمدير المتجر
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              {passwordNotice && (
                <div
                  className={cn(
                    "p-3 rounded-xl border text-xs font-semibold flex items-center gap-2",
                    passwordNotice.includes("بنجاح")
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{passwordNotice}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
              >
                تحديث كلمة المرور
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
