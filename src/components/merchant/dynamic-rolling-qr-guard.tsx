"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Copy,
  Check,
  Sparkles,
  Lock,
  Smartphone,
  ScanLine,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCameraScanner } from "@/components/merchant/qr-camera-scanner";

// Simple procedural QR Matrix SVG renderer (25x25 matrix)
function DynamicQrSvg({ payload, seed }: { payload: string; seed: number }) {
  const size = 25;
  const grid: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Finder patterns (Top-Left, Top-Right, Bottom-Left: 7x7 outer border, 3x3 inner square)
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

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
  }

  // Alignment pattern at (16, 16)
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        grid[16 + r][16 + c] = true;
      }
    }
  }

  // Procedural data fill influenced by seed and payload
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

export function DynamicRollingQrGuard() {
  // --- Client Side Rolling Token Simulation State ---
  const [countdown, setCountdown] = useState(30);
  const [currentToken, setCurrentToken] = useState("MSR-8829-X");
  const [previousTokens, setPreviousTokens] = useState<string[]>(["MSR-3104-B", "MSR-7721-K"]);
  const [tokenSeed, setTokenSeed] = useState(8829);
  const [copiedToken, setCopiedToken] = useState(false);
  const student = {
    firstName: "أيهم",
    maskedId: "****8492",
    fullId: "2023108492",
    university: "جامعة اليرموك",
    faculty: "كلية تكنولوجيا المعلومات وعلوم الحاسوب",
    discountDeal: "خصم 25% على كافة وجبات البرغر",
  };

  // Sound effect generator for token refresh / cashier beep
  const playBeep = (freq = 900, type: OscillatorType = "sine", duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  // Timer loop for rolling token (30s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          const newToken = `MSR-${randomNum}-${randomChar}`;

          setCurrentToken((current) => {
            setPreviousTokens((history) => [current, ...history.slice(0, 4)]);
            return newToken;
          });
          setTokenSeed(randomNum);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- Merchant POS Validator State ---
  const [inputCode, setInputCode] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResponse, setValidationResponse] = useState<{
    status: "idle" | "success" | "expired" | "rate_limited" | "invalid";
    message?: string;
    details?: {
      trxId?: string;
      studentName?: string;
      studentId?: string;
      university?: string;
      deal?: string;
      discountAmount?: number;
      finalPrice?: number;
      rateLimitResetHours?: number;
      lastUsedMinutesAgo?: number;
      apiHeaders?: {
        "X-RateLimit-Limit": string;
        "X-RateLimit-Remaining": string;
        "X-RateLimit-Reset": string;
        "X-Token-TTL": string;
        "X-Idempotency-Key": string;
      };
    };
  }>({ status: "idle" });

  // Verification Logic
  const handleValidateCode = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);

    setTimeout(() => {
      setIsValidating(false);

      // Scenario 1: Expired Token
      if (previousTokens.includes(code) || code.includes("EXPIRED")) {
        playBeep(320, "sawtooth", 0.3);
        setValidationResponse({
          status: "expired",
          message: "عذراً، هذا الرمز منتهي الصلاحية التلقائية (انقضت نافذة الـ 30 ثانية). يرجى طلب مسح الرمز الجديد المتجدد على شاشة هاتف الطالب.",
          details: {
            apiHeaders: {
              "X-RateLimit-Limit": "1/6h",
              "X-RateLimit-Remaining": "1",
              "X-RateLimit-Reset": "0",
              "X-Token-TTL": "0s",
              "X-Idempotency-Key": `rej_${Date.now()}`,
            },
          },
        });
        return;
      }

      // Scenario 2: Rate Limiting Violation (< 6 hours)
      if (code.includes("RATELIMIT") || code === "MSR-4500-L") {
        playBeep(280, "sawtooth", 0.35);
        setValidationResponse({
          status: "rate_limited",
          message: "⛔ تم حظر العملية: تجاوز معدل الاستخدام المسموح (Rate Limit: 1 use per 6 hours). لقد استفاد هذا الحساب من الخصم قبل 42 دقيقة، ولا يمكن تكرار الخصم لنفس الطالب إلا بعد مرور 6 ساعات.",
          details: {
            studentName: "خالد عبد الرحيم",
            studentId: "****7722",
            university: "الجامعة الأردنية",
            lastUsedMinutesAgo: 42,
            rateLimitResetHours: 5.3,
            apiHeaders: {
              "X-RateLimit-Limit": "1/6h",
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": "19080s",
              "X-Token-TTL": "30s",
              "X-Idempotency-Key": `err_ratelimit_${Date.now()}`,
            },
          },
        });
        return;
      }

      // Scenario 3: Valid Active Token
      if (code === currentToken || code.startsWith("MSR-")) {
        playBeep(987, "sine", 0.15);
        const randomTrx = `#TRX-${Math.floor(1000 + Math.random() * 9000)}`;

        setValidationResponse({
          status: "success",
          message: "تم التحقق الأمني من الرمز الديناميكي وتطابق التوقيع الرقمي بنجاح!",
          details: {
            trxId: randomTrx,
            studentName: `${student.firstName} ${student.maskedId}`,
            studentId: student.maskedId,
            university: student.university,
            deal: student.discountDeal,
            discountAmount: 1.5,
            finalPrice: 4.5,
            apiHeaders: {
              "X-RateLimit-Limit": "1/6h",
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": "21600s",
              "X-Token-TTL": `${countdown}s`,
              "X-Idempotency-Key": `idem_${randomTrx}`,
            },
          },
        });
        return;
      }

      // Scenario 4: Invalid Format
      playBeep(250, "triangle", 0.25);
      setValidationResponse({
        status: "invalid",
        message: "رمز غير صالح أو تم التلاعب به. لم يتم العثور على رمز مطابق في مفاتيح التشفير اللحظية لشبكة مسار.",
        details: {
          apiHeaders: {
            "X-RateLimit-Limit": "1/6h",
            "X-RateLimit-Remaining": "1",
            "X-RateLimit-Reset": "0",
            "X-Token-TTL": "0s",
            "X-Idempotency-Key": `err_invalid_${Date.now()}`,
          },
        },
      });
    }, 400);
  };

  const handleCopyCurrentToken = () => {
    navigator.clipboard.writeText(currentToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  نظام مكافحة الاحتيال والباركود الديناميكي (Dynamic Rolling QR Guard)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                  Anti-Fraud Pro
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                توليد ومطابقة الرموز المشفرة المتغيرة كل 30 ثانية مع حماية لقطات الشاشة وتقييد معدل الاستخدام الزمني (Rate Limiting).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-background border border-border text-foreground/80 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin" />
              <span>دورة التحديث: 30 ثانية</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left = Student Client Mockup, Right = Merchant POS Validator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Client-Side Student Simulation */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Frame Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-border mb-5">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                محاكاة شاشة هاتف الطالب
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Token
            </span>
          </div>

          {/* Student Verification Badge */}
          <div className="w-full rounded-xl bg-background border border-border p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                {student.firstName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{student.firstName}</span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded">
                    {student.maskedId}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{student.university}</p>
              </div>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>طالب نشط</span>
              </span>
            </div>
          </div>

          {/* QR Code Container with Anti-Screenshot Watermark */}
          <div className="relative w-56 h-56 rounded-2xl p-3 bg-white shadow-2xl flex items-center justify-center group overflow-hidden border-2 border-cyan-400/40">
            <DynamicQrSvg payload={`MASAR:STU:${student.fullId}:${currentToken}`} seed={tokenSeed} />

            {/* Anti-screenshot Watermark Diagonal Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-25 select-none rotate-[-12deg]">
              <span className="text-[9px] font-mono text-slate-800 font-bold tracking-widest uppercase">
                {student.firstName} • {student.maskedId}
              </span>
              <span className="text-[8px] font-mono text-slate-800 font-semibold text-center">
                DYNAMIC ONE-TIME TOKEN • MASAR GUARD
              </span>
              <span className="text-[9px] font-mono text-slate-800 font-bold tracking-widest uppercase text-right">
                {currentToken}
              </span>
            </div>
          </div>

          {/* Linear Progress Bar (30s) */}
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <RotateCw className={`h-3 w-3 text-cyan-400 ${countdown <= 5 ? "animate-spin" : ""}`} />
                <span>تجدد الرمز تلقائياً:</span>
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {countdown} ثانية متبقية
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(countdown / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Rolling Token Display & One-Click Copy */}
          <div className="w-full mt-4 p-3 rounded-xl bg-background border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block">رمز التحقق المتغير (Rolling Token):</span>
              <span className="text-lg font-mono font-bold text-white tracking-widest text-start block">
                {currentToken}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyCurrentToken}
              className="border-border hover:bg-white/5 text-xs text-foreground gap-1.5"
            >
              {copiedToken ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
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

          {/* Anti-Screenshot Guard Badge */}
          <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">وسم مكافحة لقطات الشاشة (Anti-Screenshot Guard):</span>
              <p className="text-[10px] text-amber-200/80 leading-relaxed mt-0.5">
                تتغير شفرة الرمز دورياً لإبطال صلاحية الصور الملتقطة ومحاولات تداولها بين الطلبة.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Merchant POS Validator Interface */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  واجهة فحص وتحقق الكاشير (Merchant POS Validator)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ready for Input
              </span>
            </div>

            {/* Input & Scanner Form */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
                <span>أدخل رمز الطالب المتغير (أو امسح الكود بالكاميرا):</span>
                <span className="text-[10px] font-mono text-muted-foreground">تنسيق: MSR-XXXX-X</span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleValidateCode();
                    }}
                    placeholder="مثال: MSR-8829-X"
                    className="bg-background border-border text-white font-mono tracking-widest text-lg h-12 text-center rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 placeholder:text-slate-600 uppercase"
                  />
                  {inputCode && (
                    <button
                      type="button"
                      onClick={() => setInputCode("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white text-xs"
                    >
                      مسح
                    </button>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => setIsCameraOpen(!isCameraOpen)}
                  className={`h-12 px-4 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                    isCameraOpen
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                      : "bg-background border-border text-foreground hover:bg-white/5 hover:border-cyan-500/40"
                  }`}
                >
                  <Camera className="h-4 w-4 text-cyan-400" />
                  <span className="hidden sm:inline">{isCameraOpen ? "إغلاق الكاميرا" : "مسح بالكاميرا"}</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => handleValidateCode()}
                  disabled={isValidating || !inputCode.trim()}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 cursor-pointer disabled:opacity-50"
                >
                  {isValidating ? (
                    <RotateCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>فحص فوري</span>
                      <ScanLine className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Embedded Live Camera Scanner Modal */}
            <QrCameraScanner
              isOpen={isCameraOpen}
              onClose={() => setIsCameraOpen(false)}
              onScanSuccess={(scannedText) => {
                const match = scannedText.match(/MSR-[0-9]{4}-[A-Z]/i);
                const token = match ? match[0] : scannedText;
                setInputCode(token);
                setIsCameraOpen(false);
                handleValidateCode(token);
              }}
            />

            {/* Quick Test Scenarios */}
            <div className="p-3 rounded-xl bg-background border border-border space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>حالات الاختبار السريع (محاكاة الكاشير):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputCode(currentToken);
                    handleValidateCode(currentToken);
                  }}
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 text-center transition-all cursor-pointer"
                >
                  ✓ الرمز النشط الحالي
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const expired = previousTokens[0] || "MSR-3104-B";
                    setInputCode(expired);
                    handleValidateCode(expired);
                  }}
                  className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-[11px] font-mono text-amber-300 text-center transition-all cursor-pointer"
                >
                  ⌛ رمز منتهي (Expired)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputCode("MSR-4500-L");
                    handleValidateCode("MSR-4500-L");
                  }}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[11px] font-mono text-rose-300 text-center transition-all cursor-pointer"
                >
                  ⛔ تكرار الخصم (&lt;6h)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputCode("FAKE-9999-Z");
                    handleValidateCode("FAKE-9999-Z");
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-border text-[11px] font-mono text-foreground/80 text-center transition-all cursor-pointer"
                >
                  ✕ رمز غير صالح (Invalid)
                </button>
              </div>
            </div>

            {/* Validation Outcomes */}
            {validationResponse.status === "success" && validationResponse.details && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم التحقق والاعتماد بنجاح</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                    {validationResponse.details.trxId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">اسم وهوية الطالب:</span>
                    <span className="font-semibold text-white">
                      {validationResponse.details.studentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">العرض الترويجي:</span>
                    <span className="font-semibold text-emerald-300">
                      {validationResponse.details.deal}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">قيمة الخصم / السعر النهائي:</span>
                    <span className="font-mono font-bold text-white">
                      خصم {validationResponse.details.discountAmount?.toFixed(2)} د.أ ← {validationResponse.details.finalPrice?.toFixed(2)} د.أ
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-emerald-500/20">
                  <span className="text-[11px] text-muted-foreground">
                    يمكن تسجيل رقم العملية في شاشة الكاشير للربط المحاسبي.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (validationResponse.details?.trxId) {
                        navigator.clipboard.writeText(validationResponse.details.trxId);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>نسخ رقم العملية للنظام</span>
                  </Button>
                </div>
              </div>
            )}

            {validationResponse.status === "expired" && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Clock className="h-4 w-4" />
                  <span>خطأ: انتهاء صلاحية الرمز التلقائية (Expired Token)</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {validationResponse.message}
                </p>
              </div>
            )}

            {validationResponse.status === "rate_limited" && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="h-4 w-4" />
                  <span>حظر العملية: تقييد معدل الاستخدام (Rate Limit Exceeded: 1/6h)</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {validationResponse.message}
                </p>
                <div className="p-2.5 rounded-lg bg-background border border-rose-500/20 text-[11px] font-mono text-foreground/80 flex items-center justify-between">
                  <span>الوقت المتبقي لفك الحظر:</span>
                  <span className="text-rose-400 font-bold">5 ساعات و 18 دقيقة</span>
                </div>
              </div>
            )}

            {validationResponse.status === "invalid" && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4" />
                  <span>رمز غير صالح أو مشكوك فيه (Invalid Token)</span>
                </div>
                <p className="text-xs text-red-200/90 leading-relaxed">
                  {validationResponse.message}
                </p>
              </div>
            )}

            {/* API Contract Headers Panel */}
            {validationResponse.details?.apiHeaders && (
              <div className="rounded-xl border border-border/60 bg-background p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pb-1 border-b border-border/60">
                  <span className="flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-cyan-400" />
                    <span>HTTP Response Headers (API Contract):</span>
                  </span>
                  <span>HTTP/1.1 {validationResponse.status === "success" ? "200 OK" : validationResponse.status === "rate_limited" ? "429 Too Many Requests" : "400 Bad Request"}</span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                  <div>X-RateLimit-Limit: <span className="text-cyan-400">{validationResponse.details.apiHeaders["X-RateLimit-Limit"]}</span></div>
                  <div>X-RateLimit-Remaining: <span className="text-cyan-400">{validationResponse.details.apiHeaders["X-RateLimit-Remaining"]}</span></div>
                  <div>X-RateLimit-Reset: <span className="text-cyan-400">{validationResponse.details.apiHeaders["X-RateLimit-Reset"]}</span></div>
                  <div>X-Token-TTL: <span className="text-cyan-400">{validationResponse.details.apiHeaders["X-Token-TTL"]}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
