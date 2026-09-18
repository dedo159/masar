"use client";

import Link from "next/link";
import { ChevronLeft, GitBranch, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function ItCareerPathCard() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Contribution grid data simulation
  const heatmapCols = [
    [1, 0, 2, 1],
    [0, 1, 3, 0],
    [2, 3, 4, 1],
    [1, 2, 0, 2],
    [0, 1, 1, 0],
    [3, 4, 2, 3],
    [2, 0, 1, 2],
    [1, 3, 4, 1],
    [0, 2, 3, 0],
    [2, 1, 0, 2],
    [4, 3, 2, 4],
    [1, 2, 3, 1],
    [0, 1, 0, 0],
    [2, 4, 3, 2],
    [3, 2, 4, 3],
    [1, 0, 1, 2],
  ];

  const getColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-[#2F7BFF]/35";
      case 2:
        return "bg-[#2F7BFF]";
      case 3:
        return "bg-[#A855F7]";
      case 4:
        return "bg-[#E83D84] shadow-[0_0_6px_#E83D84]";
      default:
        return "bg-white/[0.06]";
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-2xl backdrop-blur-2xl overflow-hidden group">
      {/* Glow Effects */}
      <div className="absolute -top-12 left-1/4 w-32 h-32 bg-[#2F7BFF]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-[#A855F7]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <Link
        href="/readiness"
        className="flex items-center justify-between mb-3 group/header cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-white group-hover/header:text-[#2F7BFF] transition-colors">
            {isAr ? "مسار التطوير المهني (IT Career Path)" : "IT Career Path"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30">
            <Sparkles className="h-2.5 w-2.5" />
            <span>AI Guided</span>
          </span>
        </div>
        <ChevronLeft className="h-4 w-4 text-white/60 group-hover/header:text-white group-hover/header:translate-x-[-2px] transition-all" />
      </Link>

      {/* Node Graph Visualizer */}
      <div className="relative h-36 w-full rounded-xl bg-[#0B0C1E]/60 border border-white/[0.06] p-3 flex items-center justify-center overflow-hidden mb-4">
        {/* Ambient Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:16px_16px]" />

        <svg className="w-full h-full" viewBox="0 0 320 120" fill="none">
          {/* Connector Lines with Neon Glow */}
          <line x1="50" y1="60" x2="100" y2="40" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="50" y1="60" x2="100" y2="80" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="100" y1="40" x2="160" y2="60" stroke="#2F7BFF" strokeWidth="2.5" />
          <line x1="100" y1="80" x2="160" y2="60" stroke="#2F7BFF" strokeWidth="2.5" />
          <line x1="160" y1="60" x2="220" y2="40" stroke="#A855F7" strokeWidth="2.5" />
          <line x1="160" y1="60" x2="220" y2="85" stroke="#A855F7" strokeWidth="2.5" />
          <line x1="220" y1="40" x2="270" y2="25" stroke="#E83D84" strokeWidth="2" strokeOpacity="0.8" />
          <line x1="220" y1="40" x2="275" y2="60" stroke="#E83D84" strokeWidth="2" strokeOpacity="0.8" />
          <line x1="220" y1="85" x2="270" y2="100" stroke="#E83D84" strokeWidth="2" strokeOpacity="0.8" />

          {/* Glowing Nodes */}
          {/* Node 1 */}
          <circle cx="50" cy="60" r="7" fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
          {/* Node 2 & 3 */}
          <circle cx="100" cy="40" r="8" fill="#2F7BFF" className="drop-shadow-[0_0_8px_#2F7BFF]" />
          <circle cx="100" cy="80" r="8" fill="#2F7BFF" className="drop-shadow-[0_0_8px_#2F7BFF]" />

          {/* Active Center Hero Node with Pulse */}
          <circle cx="160" cy="60" r="14" fill="#2F7BFF" fillOpacity="0.2" className="animate-ping" />
          <circle cx="160" cy="60" r="10" fill="#ffffff" stroke="#2F7BFF" strokeWidth="3" className="drop-shadow-[0_0_12px_#38BDF8]" />

          {/* Node 5 & 6 */}
          <circle cx="220" cy="40" r="8" fill="#A855F7" className="drop-shadow-[0_0_8px_#A855F7]" />
          <circle cx="220" cy="85" r="8" fill="#A855F7" className="drop-shadow-[0_0_8px_#A855F7]" />

          {/* Outer Destination Nodes */}
          <circle cx="270" cy="25" r="7" fill="#E83D84" className="drop-shadow-[0_0_8px_#E83D84]" />
          <circle cx="275" cy="60" r="6" fill="#E83D84" className="drop-shadow-[0_0_8px_#E83D84]" />
          <circle cx="270" cy="100" r="7" fill="#E83D84" className="drop-shadow-[0_0_8px_#E83D84]" />
        </svg>

        <span className="absolute bottom-2 right-3 text-[10px] font-mono text-white/40">
          Fullstack & Cloud Path
        </span>
      </div>

      {/* GitHub Activity Heatmap Section */}
      <div className="pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
            <svg className="h-3.5 w-3.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub activity</span>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            348 commits this semester
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {heatmapCols.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-1">
              {col.map((lvl, rIdx) => (
                <div
                  key={rIdx}
                  className={`h-2.5 w-2.5 rounded-[2px] ${getColor(lvl)} transition-colors`}
                  title={`Activity Level: ${lvl}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-white/40">
          <span>{isAr ? "نشاط المنصة البرمجي" : "Heat map"}</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="h-2 w-2 rounded-[2px] bg-white/[0.06]" />
            <div className="h-2 w-2 rounded-[2px] bg-[#2F7BFF]/40" />
            <div className="h-2 w-2 rounded-[2px] bg-[#2F7BFF]" />
            <div className="h-2 w-2 rounded-[2px] bg-[#A855F7]" />
            <div className="h-2 w-2 rounded-[2px] bg-[#E83D84]" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
