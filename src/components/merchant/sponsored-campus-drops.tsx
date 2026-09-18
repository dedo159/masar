"use client";

import { useState } from "react";
import {
  Radio,
  Calendar,
  CalendarClock,
  Send,
  MapPin,
  Store,
  Clock,
  Zap,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Bell,
  Layers,
  ChevronDown,
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



export function SponsoredCampusDrops() {
  const [dealTitle, setDealTitle] = useState("وجبة شاورما سوبر + مشروب بـ 1.75 د.أ فقط لطلاب الـ IT!");
  const [dealDescription, setDealDescription] = useState("خصم حصري ومباشر خلال استراحة الغداء. اطلب الآن من فرع الجامعة بإبراز تطبيق مسار.");
  // Multi-branch selection state
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([
    "branch-ju",
    "branch-aau",
  ]);

  // Start and End Date & Time State with intuitive defaults
  const getInitialDates = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Default end time: +3 hours
    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const endDayStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
    const endTimeStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

    return { todayStr, currentTimeStr, endDayStr, endTimeStr };
  };

  const initial = getInitialDates();
  const [startDate, setStartDate] = useState(initial.todayStr);
  const [startTime, setStartTime] = useState(initial.currentTimeStr);
  const [endDate, setEndDate] = useState(initial.endDayStr);
  const [endTime, setEndTime] = useState(initial.endTimeStr);

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
    scheduleSummary: string;
    timestamp: string;
  } | null>(null);

  const selectedBranches = storeBranches.filter((b) => selectedBranchIds.includes(b.id));
  const totalTargetedStudents = selectedBranches.reduce((sum, b) => sum + b.studentCount, 0);

  // Duration & Validation Calculation
  const calculateDuration = () => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMs = end.getTime() - start.getTime();

      if (isNaN(diffMs) || diffMs <= 0) {
        return { isValid: false, text: "توقيت النهاية يجب أن يكون بعد توقيت البداية" };
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const days = Math.floor(hours / 24);

      if (days >= 1) {
        const remHours = hours % 24;
        return {
          isValid: true,
          text: remHours > 0 ? `${days} يوم و ${remHours} ساعة` : `${days} يوم/أيام`,
        };
      }

      if (hours > 0) {
        return {
          isValid: true,
          text: minutes > 0 ? `${hours} ساعة و ${minutes} دقيقة` : `${hours} ساعات`,
        };
      }

      return { isValid: true, text: `${minutes} دقيقة` };
    } catch {
      return { isValid: false, text: "توقيت غير محدد بدقة" };
    }
  };

  const durationInfo = calculateDuration();

  // Quick Preset Handlers for Start Date & Time
  const setStartNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setStartDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    setStartTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  };

  const setStartLunch = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setStartDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    setStartTime("12:00");
  };

  const setStartTomorrowMorning = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    setStartDate(`${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`);
    setStartTime("09:00");
  };

  // Quick Preset Handlers for End Date & Time
  const addHoursToEnd = (hours: number) => {
    const base = new Date(`${startDate}T${startTime}`);
    const validBase = isNaN(base.getTime()) ? new Date() : base;
    const target = new Date(validBase.getTime() + hours * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    setEndDate(`${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`);
    setEndTime(`${pad(target.getHours())}:${pad(target.getMinutes())}`);
  };

  const setEndMidnight = () => {
    setEndDate(startDate);
    setEndTime("23:59");
  };

  const addDaysToEnd = (days: number) => {
    const base = new Date(`${startDate}T${startTime}`);
    const validBase = isNaN(base.getTime()) ? new Date() : base;
    const target = new Date(validBase.getTime() + days * 24 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    setEndDate(`${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`);
    setEndTime(`${pad(target.getHours())}:${pad(target.getMinutes())}`);
  };

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
    if (!durationInfo.isValid) {
      alert("يرجى ضبط توقيت بداية ونهاية العرض بشكل صحيح (النهاية بعد البداية).");
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
        scheduleSummary: `من ${startDate} (${startTime}) حتى ${endDate} (${endTime}) — مدة ${durationInfo.text}`,
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

      {/* Flash Drop Launcher Form */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
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

            {/* ========================================================================= */}
            {/* خانة بداية ونهاية العرض مع التاريخ والوقت والأزرار السريعة */}
            {/* ========================================================================= */}
            <div className="space-y-3.5 p-4 rounded-2xl border border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-foreground">
                    توقيت سريان العرض (تاريخ ووقت البداية والنهاية):
                  </span>
                </div>

                {/* Duration Badge Indicator */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      durationInfo.isValid
                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {durationInfo.isValid ? `⏱️ المدة: ${durationInfo.text}` : "⚠️ تحقق من التوقيت"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. بداية العرض (Start Date & Time) */}
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>بداية العرض:</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground font-mono">Start Time</span>
                  </div>

                  {/* Date & Time Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">التاريخ 📅</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">الوقت ⏰</span>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Quick Presets for Start */}
                  <div className="pt-1 border-t border-border/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground ml-1">اختصار:</span>
                    <button
                      type="button"
                      onClick={setStartNow}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      ⚡ الآن فوراً
                    </button>
                    <button
                      type="button"
                      onClick={setStartLunch}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      🍽️ الغداء (12:00 م)
                    </button>
                    <button
                      type="button"
                      onClick={setStartTomorrowMorning}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      ☀️ غداً (09:00 ص)
                    </button>
                  </div>
                </div>

                {/* 2. نهاية العرض (End Date & Time) */}
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>نهاية العرض:</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground font-mono">End Time</span>
                  </div>

                  {/* Date & Time Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">التاريخ 📅</span>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">الوقت ⏰</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Quick Presets for End (Duration adders) */}
                  <div className="pt-1 border-t border-border/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground ml-1">إضافة مدة:</span>
                    <button
                      type="button"
                      onClick={() => addHoursToEnd(2)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      + ساعتان
                    </button>
                    <button
                      type="button"
                      onClick={() => addHoursToEnd(4)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      + 4 ساعات
                    </button>
                    <button
                      type="button"
                      onClick={setEndMidnight}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      🌙 منتصف الليل
                    </button>
                    <button
                      type="button"
                      onClick={() => addDaysToEnd(3)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      + 3 أيام
                    </button>
                    <button
                      type="button"
                      onClick={() => addDaysToEnd(7)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-amber-500/10 hover:text-amber-500 border border-border/70 transition-colors cursor-pointer"
                    >
                      + أسبوع
                    </button>
                  </div>
                </div>
              </div>

              {!durationInfo.isValid && (
                <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                  {durationInfo.text}
                </p>
              )}
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
                disabled={isBroadcasting || !dealTitle.trim() || !durationInfo.isValid || selectedBranchIds.length === 0}
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
                    <span className="text-muted-foreground block text-[10px]">فترة الصلاحية:</span>
                    <span className="font-mono text-emerald-400">{broadcastSuccess.scheduleSummary}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

