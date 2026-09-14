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
      <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">AI Resume Builder</h1>
        </div>
        <Button onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </header>

      {/* Main Split View */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left/Right based on RTL: In RTL, preview should probably be on the left visually, chat on the right. 
            We'll keep it standard: Chat panel and Preview panel. */}
        <div className="w-1/3 min-w-[350px] max-w-[500px] border-r p-4 bg-muted/20 flex flex-col">
          <ResumeChat />
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-8 flex items-start justify-center print:p-0 print:bg-white">
          <ResumePreview ref={componentRef} />
        </div>
      </main>
    </div>
  );
}
