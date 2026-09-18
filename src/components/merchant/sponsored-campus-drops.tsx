"use client";

import { useState } from "react";
import {
  Radio,
  Send,
  MapPin,
  Store,
  Clock,
  Zap,
  Users,
  DollarSign,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
  Layers,
  ChevronDown,
  Navigation,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreBranch {
  id: string;
  name: string;
  location: string;
  studentCount: number;
}

const storeBranches: StoreBranch[] = [
  {
    id: "branch-ju",
    name: "فرع الجامعة الأردنية — مجمّع العلوم والطب",
    location: "عمان — الجبيهة",
    studentCount: 3850,
  },
  {
    id: "branch-aau",
    name: "فرع جامعة عمان الأهلية — البوابة الرئيسية",
    location: "عمان / السلط",
    studentCount: 2100,
  },
  {
    id: "branch-just",
    name: "فرع جامعة العلوم والتكنولوجيا (JUST) — المجمّع التجاري",
    location: "إربد — الرمثا",
    studentCount: 2750,
  },
  {
    id: "branch-yu",
    name: "فرع جامعة اليرموك — شارع الجامعة",
    location: "إربد — قصبة إربد",
    studentCount: 2400,
  },
  {
    id: "branch-bau",
    name: "فرع جامعة البلقاء التطبيقية — البوابة الرئيسية",
    location: "السلط — المركز",
    studentCount: 1650,
  },
];

const validityOptions = [
  { id: "lunch-2h", label: "ساعتان (استراحة الظهيرة 12:00 م - 2:00 م)", sub: "الأكثر تفاعلاً للوجبات السريعة" },
  { id: "afternoon-3h", label: "3 ساعات حتى نهاية الدوام المسائي", sub: "مناسب للمقاهي والوجبات الخفيفة" },
  { id: "first-50", label: "حتى نفاد أول 50 وجبة / قسيمة", sub: "خلق دافع استعجال فوري (Urgency)" },
  { id: "full-day", label: "كامل اليوم حتى منتصف الليل", sub: "عروض السكنات والمذاكرة المسائية" },
];

export function SponsoredCampusDrops() {
  const [dealTitle, setDealTitle] = useState("وجبة شاورما سوبر + مشروب بـ 1.75 د.أ فقط لطلاب الـ IT!");
  const [dealDescription, setDealDescription] = useState("خصم حصري ومباشر خلال استراحة الغداء. اطلب الآن من فرع الجامعة بإبراز تطبيق مسار.");
  // Multi-branch selection state
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([
    "branch-ju",
    "branch-aau",
  ]);
  const [selectedValidityId, setSelectedValidityId] = useState("lunch-2h");

  // Pricing and Balance
  const [merchantBalance, setMerchantBalance] = useState(75.0);
  const dropFee = 15.0;

  // Broadcast Action State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<{
    dropId: string;
    sentCount: number;
    branchesCount: number;
    branchesSummary: string;
    timestamp: string;
  } | null>(null);

  const selectedBranches = storeBranches.filter((b) => selectedBranchIds.includes(b.id));
  const totalTargetedStudents = selectedBranches.reduce((sum, b) => sum + b.studentCount, 0);
  const activeValidity = validityOptions.find((v) => v.id === selectedValidityId) || validityOptions[0];

  const toggleBranch = (id: string) => {
    setSelectedBranchIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one branch selected
        return prev.filter((bId) => bId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllBranches = () => {
    if (selectedBranchIds.length === storeBranches.length) {
      setSelectedBranchIds([storeBranches[0].id]);
    } else {
      setSelectedBranchIds(storeBranches.map((b) => b.id));
    }
  };

  const handleLaunchDrop = () => {
    if (!dealTitle.trim()) return;
    if (selectedBranchIds.length === 0) {
      alert("يرجى اختيار فرع واحد على الأقل مشمول بالعرض.");
      return;
    }
    if (merchantBalance < dropFee) {
      alert("رصيد حملات البث غير كافٍ. يرجى شحن الرصيد للمتابعة.");
      return;
    }

    setIsBroadcasting(true);

    setTimeout(() => {
      setIsBroadcasting(false);
      setMerchantBalance((prev) => prev - dropFee);

      const newDropId = `DROP-${Math.floor(1000 + Math.random() * 9000)}`;
      setBroadcastSuccess({
        dropId: newDropId,
        sentCount: totalTargetedStudents,
        branchesCount: selectedBranches.length,
        branchesSummary:
          selectedBranches.length === storeBranches.length
            ? "كافة الفروع المتاحة (5 فروع)"
            : selectedBranches.map((b) => b.name.split("—")[0].trim()).join("، "),
        timestamp: "الآن",
      });

      // Cashier Confirmation Beep
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {
        // Audio fallback
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shadow-inner">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  حملات الإشعارات والتنبيهات الموجهة للحرم (Sponsored Campus Drops)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400">
                  Multi-Branch Push
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                بث إشعارات فورية (Push Notifications) لشاشات قفل هواتف الطلبة في محيط الفروع المشمولة بالعرض.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Merchant Drops Credit */}
            <div className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-muted-foreground block">رصيد البث المتاح:</span>
                <span className="font-mono font-bold text-white">{merchantBalance.toFixed(2)} د.أ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Right (Launcher Form 7 Cols), Left (Smartphone Lockscreen Preview 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* 1. Flash Drop Launcher Form (7 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                أداة إنشاء وإطلاق العرض الفوري (Flash Drop Launcher)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Live Composer
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
                <span>عنوان العرض السريع (Flash Deal Title):</span>
                <span className="text-[10px] text-muted-foreground font-mono">حتى 60 حرفاً</span>
              </label>
              <Input
                type="text"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                placeholder="مثال: خصم 50% على البرغر خلال استراحة الغداء!"
                className="bg-background border-border text-white text-xs h-11 rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            {/* Description / Subtitle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                تفاصيل الإشعار الموجه للطالب (Call-to-Action Text):
              </label>
              <textarea
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                rows={2}
                placeholder="تفاصيل العرض والشروط السريعة..."
                className="w-full rounded-xl bg-background border border-border p-3 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none resize-none"
              />
            </div>

            {/* Included Branches Multi-Selector */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-amber-500" />
                  <span>الفروع المشمولة بالعرض (يمكنك اختيار أكثر من فرع):</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400 font-bold">
                    {totalTargetedStudents.toLocaleString()} طالب مستهدف
                  </span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <button
                    type="button"
                    onClick={handleSelectAllBranches}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium underline cursor-pointer"
                  >
                    {selectedBranchIds.length === storeBranches.length
                      ? "إلغاء تحديد الكل"
                      : "تحديد كافة الفروع"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {storeBranches.map((branch) => {
                  const isSelected = selectedBranchIds.includes(branch.id);
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => toggleBranch(branch.id)}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20"
                          : "bg-background border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {/* Styled Multi-select Checkbox Box */}
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                          isSelected
                            ? "bg-amber-500 border-amber-500 text-black"
                            : "border-muted-foreground/40 bg-card"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className={`text-xs font-bold block truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                          {branch.name}
                        </span>
                        <p className="text-[10px] text-muted-foreground">{branch.location}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-500 dark:text-emerald-400">
                          <Users className="h-3 w-3" />
                          <span>{branch.studentCount.toLocaleString()} طالب في محيط الفرع</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Validity Window Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>نافذة الصلاحية الزمنية للعرض:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {validityOptions.map((opt) => {
                  const isSelected = opt.id === selectedValidityId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedValidityId(opt.id)}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/40 text-white"
                          : "bg-background border-border/60 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isSelected ? "text-amber-300" : "text-foreground/80"}`}>
                          {opt.label}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Pricing & Instant Launch Button */}
            <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">تكلفة البث الفوري:</span>
                  <span className="text-base font-mono font-bold text-amber-400">{dropFee.toFixed(2)} د.أ</span>
                  <span className="text-[10px] text-muted-foreground">/ للبث الواحد</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  يصل الإشعار إلى <strong className="text-white font-mono">{totalTargetedStudents.toLocaleString()}</strong> طالب مستهدف عبر <strong className="text-white font-mono">{selectedBranches.length}</strong> فروع مشمولة.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleLaunchDrop}
                disabled={isBroadcasting || !dealTitle.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs h-11 px-6 rounded-xl shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50 gap-2"
              >
                {isBroadcasting ? (
                  <span className="flex items-center gap-2">
                    <Radio className="h-4 w-4 animate-spin text-slate-950" />
                    <span>جارٍ البث للطلبة...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-slate-950" />
                    <span>إطلاق البث الفوري للحرم 🚀</span>
                  </span>
                )}
              </Button>
            </div>

            {/* Success Broadcast Receipt */}
            {broadcastSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم إرسال البث الفوري بنجاح إلى شاشات الطلاب!</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {broadcastSuccess.dropId}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-foreground/80">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">الطلاب المستلمون:</span>
                    <span className="font-bold font-mono text-white">{broadcastSuccess.sentCount.toLocaleString()} طالب</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">الفروع المشمولة:</span>
                    <span className="font-bold text-white">{broadcastSuccess.branchesSummary}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">سرعة التسليم:</span>
                    <span className="font-mono text-emerald-400">99.4% خلال 1.2s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Real-Time Smartphone Lockscreen Push Preview (5 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-border mb-5">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                محاكي إشعار شاشة القفل (Mobile Push Preview)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Real-Time View
            </span>
          </div>

          {/* Smartphone Hardware Shell */}
          <div className="w-full max-w-[300px] h-[520px] rounded-[40px] p-3 bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            {/* Camera Pill (Dynamic Island) */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
            </div>

            {/* Lockscreen Clock */}
            <div className="text-center mt-6 space-y-1">
              <span className="text-[11px] font-medium text-foreground/80 block">
                الخميس، 18 أيلول
              </span>
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight block">
                12:44
              </span>
            </div>

            {/* Simulated Push Notification Banner */}
            <div className="my-auto w-full rounded-2xl bg-black/70 backdrop-blur-xl border border-border p-3.5 shadow-2xl text-right space-y-2 transform hover:scale-[1.02] transition-transform">
              {/* Push Header */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-[9px] text-white font-bold">
                    ▲
                  </div>
                  <span className="font-bold text-white">مسار · شريك الحرم</span>
                </div>
                <span className="font-mono text-muted-foreground">الآن</span>
              </div>

              {/* Push Body */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="h-3 w-3 shrink-0 text-amber-400" />
                  <span className="line-clamp-1">{dealTitle || "عرض حصري في الحرم!"}</span>
                </div>
                <p className="text-[11px] text-foreground/80 line-clamp-2 leading-relaxed">
                  {dealDescription || "خصم حصري موجه للطلبة في هذا النطاق."}
                </p>
              </div>

              {/* Branch Tag & Validity Badge */}
              <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground flex items-center gap-1 truncate max-w-[170px]">
                  <Store className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {selectedBranches.length === 1
                      ? selectedBranches[0].name
                      : selectedBranches.length === storeBranches.length
                      ? "متاح في كافة الفروع"
                      : `متاح في ${selectedBranches.length} فروع مشمولة`}
                  </span>
                </span>
                <span className="font-mono text-emerald-400 font-semibold shrink-0">
                  ساري الآن
                </span>
              </div>
            </div>

            {/* Lockscreen Bottom Buttons */}
            <div className="w-full flex items-center justify-between px-4 pb-2">
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-border flex items-center justify-center text-xs text-white">
                🔦
              </div>
              <div className="w-16 h-1 bg-white/40 rounded-full mx-auto" />
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-border flex items-center justify-center text-xs text-white">
                📷
              </div>
            </div>
          </div>

          <span className="text-[11px] text-muted-foreground mt-3 text-center">
            تحديث حي ومباشر للمعاينة بالتزامن مع كتابة محتوى الإشعار واختيار الفروع.
          </span>
        </div>
      </div>
    </div>
  );
}
