"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QrCode, Sparkles, ShieldCheck, RefreshCw, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function ActiveTicketCard() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [countdown, setCountdown] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-2xl backdrop-blur-2xl overflow-hidden group flex flex-col items-center text-center">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-[#00D2FF]/20 via-[#2F7BFF]/20 to-[#E83D84]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">
            {isAr ? "بطاقة الخصم الجامعية" : "Digital Student Pass"}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] bg-[#2F7BFF]/10 border border-[#2F7BFF]/30 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>LIVE</span>
          </span>
        </div>

        <Link
          href="/deals"
          className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>{isAr ? "كل العروض" : "All Deals"}</span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Neon Gradient Circular Ring with Center QR */}
      <div className="relative my-2 p-1.5 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] shadow-[0_0_35px_rgba(47,123,255,0.45)]">
        {/* Inner Dark Background */}
        <div className="h-44 w-44 rounded-full bg-[#0D0E22] flex flex-col items-center justify-center p-3 border border-white/20 relative">
          {/* Subtle Rotating Ambient Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#38BDF8]/30 animate-[spin_40s_linear_infinite]" />

          {/* QR Code Container */}
          <div className="relative h-28 w-28 bg-white p-2 rounded-xl shadow-lg flex items-center justify-center">
            <img
              src="/qr-masar20.png"
              alt="Masar Active Ticket QR"
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback to crisp generated QR if image not found
                e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MASAR-SECURE-202310890";
              }}
            />
          </div>

          {/* Rolling countdown badge */}
          <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-white/70">
            <RefreshCw className="h-2.5 w-2.5 text-[#38BDF8] animate-spin" style={{ animationDuration: '3s' }} />
            <span>{countdown}s</span>
          </div>
        </div>
      </div>

      {/* Label under QR: ACTIVE TICKET (ROLLING) */}
      <div className="mt-3 space-y-1">
        <h4 className="text-xs font-mono font-bold tracking-widest text-white/90 uppercase">
          ACTIVE TICKET (ROLLING)
        </h4>
        <p className="text-[11px] text-white/50">
          {isAr ? "رمز مشفر ومتغير تلقائياً لمنع التكرار" : "Dynamic anti-fraud student QR code"}
        </p>
      </div>
    </div>
  );
}
