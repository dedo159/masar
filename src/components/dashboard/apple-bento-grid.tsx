"use client";

import { AppleProfileWidget } from "./widgets/apple-profile-widget";
import { AppleReadinessWidget } from "./widgets/apple-readiness-widget";
import { AppleNotesWidget } from "./widgets/apple-notes-widget";
import { AppleDriveWidget } from "./widgets/apple-drive-widget";
import type { Student } from "@/lib/types";

interface AppleBentoGridProps {
  student?: Student | null;
}

export function AppleBentoGrid({ student }: AppleBentoGridProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. Top Bento Row (In RTL: Profile on Right 5-cols, Readiness on Left 7-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Right Card (in RTL): Student Academic Profile */}
        <div className="lg:col-span-5 order-1">
          <AppleProfileWidget student={student} />
        </div>

        {/* Left Card (in RTL): AI Career Readiness */}
        <div className="lg:col-span-7 order-2">
          <AppleReadinessWidget />
        </div>

      </div>

      {/* 2. Bottom Bento Row (In RTL: Drive on Right 8-cols, Notes on Left 4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Right Card (in RTL): Course Materials & Lectures */}
        <div className="lg:col-span-8 order-1">
          <AppleDriveWidget />
        </div>

        {/* Left Card (in RTL): Assignments & Notes */}
        <div className="lg:col-span-4 order-2">
          <AppleNotesWidget />
        </div>

      </div>

    </div>
  );
}
