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
  Plus,
  Trash2,
  Edit3,
  Dices,
  UserCheck,
  X,
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

export interface CashierAccount {
  id: string;
  name: string;
  pin: string;
  branchId: string;
  branchName: string;
  active: boolean;
  createdAt: string;
  totalScans: number;
}

const DEFAULT_CASHIERS: CashierAccount[] = [
  {
    id: "cashier-1",
    name: "كاشير 1 (الرئيسي — مجمّع العلوم والطب)",
    pin: "1234",
    branchId: "uj",
    branchName: "فرع الجامعة الأردنية — مجمّع العلوم والطب",
    active: true,
    createdAt: "2026-09-01",
    totalScans: 142,
  },
  {
    id: "cashier-2",
    name: "كاشير صالة الطلبة (عمان الأهلية)",
    pin: "5821",
    branchId: "amman-ahliyya",
    branchName: "فرع جامعة عمان الأهلية — مجمع الخدمات",
    active: true,
    createdAt: "2026-09-05",
    totalScans: 89,
  },
  {
    id: "cashier-3",
    name: "كاشير نقطة بيع إربد (JUST)",
    pin: "9043",
    branchId: "just",
    branchName: "فرع جامعة العلوم والتكنولوجيا (JUST) — المجمّع التجاري",
    active: true,
    createdAt: "2026-09-10",
    totalScans: 64,
  },
];

export default function MerchantSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "branches" | "cashier" | "financial" | "notifications" | "system"
  >("cashier"); // default to cashier to immediately see new cashier feature or profile

  // Save feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCashierUrl, setCopiedCashierUrl] = useState(false);
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});

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

  // Cashiers Management State
  const [cashiers, setCashiers] = useState<CashierAccount[]>(DEFAULT_CASHIERS);
  const [cashierUrl, setCashierUrl] = useState("/merchant/cashier");

  // Cashier Modal / Create / Edit Form State
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [editingCashierId, setEditingCashierId] = useState<string | null>(null);
  const [cashierFormData, setCashierFormData] = useState({
    name: "",
    branchId: "uj",
    pin: "",
    active: true,
  });
  const [modalError, setModalError] = useState("");

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
      const fullUrl = `${window.location.origin}/merchant/cashier`;
      setCashierUrl(fullUrl);

      // Load saved cashiers
      const savedCashiersStr = localStorage.getItem("masar_cashiers");
      if (savedCashiersStr) {
        try {
          const parsed = JSON.parse(savedCashiersStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCashiers(parsed);
          }
        } catch {}
      } else {
        localStorage.setItem("masar_cashiers", JSON.stringify(DEFAULT_CASHIERS));
      }

      const savedName = localStorage.getItem("masar_store_name");
      if (savedName) {
        setStoreProfile((prev) => ({ ...prev, businessName: savedName }));
      }
    }
  }, []);

  // Save cashiers to localStorage whenever changed
  const saveCashiersList = (updatedList: CashierAccount[]) => {
    setCashiers(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("masar_cashiers", JSON.stringify(updatedList));
      // update default cashier pin
      const defaultCashier = updatedList.find((c) => c.active) || updatedList[0];
      if (defaultCashier) {
        localStorage.setItem("masar_cashier_pin", defaultCashier.pin);
      }
    }
  };

  // Helper to generate a random 4-digit PIN
  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    return pin;
  };

  const handleOpenAddCashier = () => {
    setEditingCashierId(null);
    setCashierFormData({
      name: "",
      branchId: branches[0]?.id || "uj",
      pin: generateRandomPin(),
      active: true,
    });
    setModalError("");
    setIsCashierModalOpen(true);
  };

  const handleOpenEditCashier = (cashier: CashierAccount) => {
    setEditingCashierId(cashier.id);
    setCashierFormData({
      name: cashier.name,
      branchId: cashier.branchId,
      pin: cashier.pin,
      active: cashier.active,
    });
    setModalError("");
    setIsCashierModalOpen(true);
  };

  const handleSaveCashierModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!cashierFormData.name.trim()) {
      setModalError("يرجى إدخال اسم الكاشير أو نقطة البيع");
      return;
    }

    const cleanPin = cashierFormData.pin.trim();
    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setModalError("رمز PIN يجب أن يتكون من 4 أرقام تماماً");
      return;
    }

    // Check PIN collision with other cashiers
    const isCollision = cashiers.some(
      (c) => c.pin === cleanPin && c.id !== editingCashierId
    );
    if (isCollision) {
      setModalError("رمز الـ PIN هذا مستخدم بالفعل لكاشير آخر، يرجى اختيار رمز مختلف");
      return;
    }

    const selectedBranch = branches.find((b) => b.id === cashierFormData.branchId);
    const branchName = selectedBranch
      ? `${selectedBranch.name} — ${selectedBranch.campus}`
      : "كافة الفروع المعتمدة";

    if (editingCashierId) {
      // Edit existing cashier
      const updated = cashiers.map((c) =>
        c.id === editingCashierId
          ? {
              ...c,
              name: cashierFormData.name.trim(),
              branchId: cashierFormData.branchId,
              branchName,
              pin: cleanPin,
              active: cashierFormData.active,
            }
          : c
      );
      saveCashiersList(updated);
    } else {
      // Create new cashier
      const newCashier: CashierAccount = {
        id: `cashier-${Date.now()}`,
        name: cashierFormData.name.trim(),
        branchId: cashierFormData.branchId,
        branchName,
        pin: cleanPin,
        active: cashierFormData.active,
        createdAt: new Date().toISOString().split("T")[0],
        totalScans: 0,
      };
      saveCashiersList([newCashier, ...cashiers]);
    }

    setIsCashierModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRegeneratePin = (cashierId: string) => {
    const newPin = generateRandomPin();
    const updated = cashiers.map((c) =>
      c.id === cashierId ? { ...c, pin: newPin } : c
    );
    saveCashiersList(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleCashierActive = (cashierId: string) => {
    const updated = cashiers.map((c) =>
      c.id === cashierId ? { ...c, active: !c.active } : c
    );
    saveCashiersList(updated);
  };

  const handleDeleteCashier = (cashierId: string) => {
    if (cashiers.length <= 1) {
      alert("يجب الإبقاء على كاشير واحد على الأقل للمتجر");
      return;
    }
    if (confirm("هل أنت متأكد من حذف هذا الكاشير وإلغاء رمز الـ PIN المخصص له؟")) {
      const updated = cashiers.filter((c) => c.id !== cashierId);
      saveCashiersList(updated);
    }
  };

  const handleCopyPin = (cashierId: string, pin: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(pin);
      setCopiedPinId(cashierId);
      setTimeout(() => setCopiedPinId(null), 2000);
    }
  };

  const togglePinVisibility = (cashierId: string) => {
    setVisiblePins((prev) => ({ ...prev, [cashierId]: !prev[cashierId] }));
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
      localStorage.setItem("masar_store_name", storeProfile.businessName);
      localStorage.setItem("masar_cashiers", JSON.stringify(cashiers));
      const activeOne = cashiers.find((c) => c.active);
      if (activeOne) {
        localStorage.setItem("masar_cashier_pin", activeOne.pin);
      }
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
          { id: "cashier", label: "أمان الكاشير وPIN", icon: KeyRound, count: cashiers.filter((c) => c.active).length },
          { id: "branches", label: "فروع الجامعات", icon: MapPin, count: branches.filter((b) => b.active).length },
          { id: "profile", label: "بيانات المتجر", icon: Store },
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

      {/* TAB 1: CASHIER SECURITY & PIN CUSTOMIZATION */}
      {activeTab === "cashier" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    إدارة موظفي ونقاط بيع الكاشير ورموز PIN السريعة
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    أنشئ كود PIN مخصص لكل كاشير وحدد الفرع الجامعي المربوط به بدقة
                  </p>
                </div>
              </div>

              <Button
                onClick={handleOpenAddCashier}
                className="flex items-center gap-2 font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة كاشير جديد وتوليد PIN</span>
              </Button>
            </div>

            {/* Cashiers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
                <span>نقاط البيع المسجلة ({cashiers.length})</span>
                <span>النشطة: {cashiers.filter((c) => c.active).length}</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {cashiers.map((cashier) => {
                  const isVisible = !!visiblePins[cashier.id];
                  const isCopied = copiedPinId === cashier.id;

                  return (
                    <div
                      key={cashier.id}
                      className={cn(
                        "p-4 sm:p-5 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                        cashier.active
                          ? "bg-card border-border hover:border-amber-500/40"
                          : "bg-muted/40 border-border/60 opacity-70"
                      )}
                    >
                      {/* Left: Info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={cn(
                            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border",
                            cashier.active
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          <UserCheck className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">
                              {cashier.name}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                cashier.active
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                  : "bg-muted text-muted-foreground border border-border"
                              )}
                            >
                              {cashier.active ? "نشط وجاهز" : "معطّل مؤقتاً"}
                            </span>
                          </div>

                          {/* Linked Branch Badge */}
                          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="truncate">{cashier.branchName}</span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono pt-0.5">
                            <span>العمليات: {cashier.totalScans} استبدال</span>
                            <span>·</span>
                            <span>أضيف بتاريخ: {cashier.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: PIN & Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60 w-full lg:w-auto justify-between lg:justify-end">
                        {/* PIN Display Box */}
                        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-background border border-border shadow-2xs">
                          <div className="px-3 py-1 rounded-lg bg-muted/60 font-mono text-base font-black tracking-widest text-foreground min-w-[70px] text-center select-all">
                            {isVisible ? cashier.pin : "••••"}
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePinVisibility(cashier.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                            title={isVisible ? "إخفاء رمز PIN" : "إظهار رمز PIN"}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyPin(cashier.id, cashier.pin)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                            title="نسخ رمز PIN"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {/* Regenerate PIN Button */}
                        <button
                          type="button"
                          onClick={() => handleRegeneratePin(cashier.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary hover:bg-muted px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="توليد PIN عشوائي جديد"
                        >
                          <Dices className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">توليد PIN جديد</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditCashier(cashier)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                          title="تعديل الكاشير والفرع"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCashier(cashier.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer transition-colors"
                          title="حذف الكاشير"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {/* Active Switch */}
                        <div className="flex items-center gap-1.5 pr-2 border-r border-border">
                          <Switch
                            checked={cashier.active}
                            onCheckedChange={() => handleToggleCashierActive(cashier.id)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct POS Link Box */}
            <div className="p-5 rounded-xl bg-muted/40 border border-border space-y-3">
              <span className="text-xs font-bold text-foreground block">
                رابط الدخول الموحد لشاشة الكاشير (Universal Cashier Link)
              </span>
              <p className="text-xs text-muted-foreground">
                يقوم موظف الكاشير بفتح هذا الرابط وإدخال رمز PIN المخصص له أعلاه، وسيتم ربط الشاشة بفرعه المخصص فورياً
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <div className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border font-mono text-xs text-foreground truncate text-left" dir="ltr">
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
                  <span>فتح محطة الكاشير</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CASHIER */}
      {isCashierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl space-y-5"
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">
                  {editingCashierId ? "تعديل بيانات الكاشير والفرع" : "إضافة كاشير جديد وتوليد رمز PIN"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCashierModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCashierModal} className="space-y-4">
              {/* Cashier Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  اسم الكاشير أو موظف نقطة البيع
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كاشير الصالة — أحمد، كاشير الكشك الطلابي"
                  value={cashierFormData.name}
                  onChange={(e) =>
                    setCashierFormData({ ...cashierFormData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {/* Linked Branch Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  تخصيص الفرع الجامعي المربوط به
                </label>
                <select
                  value={cashierFormData.branchId}
                  onChange={(e) =>
                    setCashierFormData({ ...cashierFormData, branchId: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city}) — {b.campus}
                    </option>
                  ))}
                  <option value="all">كافة الفروع المعتمدة (شامل)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  عند تسجيل الدخول بهذا الرمز، ستعمل شاشة الكاشير تلقائياً تحت هذا الفرع وتسجل العمليات باسمه
                </p>
              </div>

              {/* PIN Code with Random Generator */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>رمز PIN السريع (4 أرقام)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setCashierFormData({
                        ...cashierFormData,
                        pin: generateRandomPin(),
                      })
                    }
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Dices className="h-3.5 w-3.5" />
                    <span>توليد رمز عشوائي 🎲</span>
                  </button>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="مثال: 4829"
                    value={cashierFormData.pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCashierFormData({ ...cashierFormData, pin: val });
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border-2 border-primary/40 text-center font-mono text-lg font-black tracking-widest text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                <div>
                  <span className="text-xs font-bold text-foreground block">حالة التفعيل</span>
                  <span className="text-[11px] text-muted-foreground">
                    تفعيل الحساب ليتمكن الموظف من تسجيل الدخول فوراً
                  </span>
                </div>
                <Switch
                  checked={cashierFormData.active}
                  onCheckedChange={(checked) =>
                    setCashierFormData({ ...cashierFormData, active: checked })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCashierModalOpen(false)}
                  className="text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="text-xs font-bold px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  {editingCashierId ? "حفظ التعديلات" : "إنشاء الكاشير واعتماد PIN"}
                </Button>
              </div>
            </form>
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

      {/* TAB 3: STORE PROFILE */}
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
