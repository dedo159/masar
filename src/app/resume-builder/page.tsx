"use client";

import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeChat } from "@/components/resume/ResumeChat";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function ResumeBuilderPage() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isRtl } = useLanguage();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "My_Resume",
  });

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden font-sans" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Navbar */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-2 md:px-4 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-bold text-sm md:text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px] md:max-w-none">
            AI Resume Builder
          </h1>
        </div>
        <Button onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </header>

      {/* Main Split View */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Panel */}
        <div className="w-full md:w-1/3 md:min-w-[350px] md:max-w-[500px] h-[45vh] md:h-auto border-b md:border-b-0 md:border-r p-2 md:p-4 bg-muted/20 flex flex-col shrink-0">
          <ResumeChat />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8 flex items-start justify-center print:p-0 print:bg-white">
          <ResumePreview ref={componentRef} />
        </div>
      </main>
    </div>
  );
}
