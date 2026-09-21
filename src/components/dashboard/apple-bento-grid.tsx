"use client";

import { AppleBannerWidget } from "./widgets/apple-banner-widget";
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
      
      {/* 1. Top Translucent Announcement / App Download Banner */}
      <AppleBannerWidget />

      {/* 2. Top Bento Row: Readiness Card (6 cols) + User Profile Card (6 cols or 7/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: AI Career Readiness (Equivalent to Photos in iCloud) */}
        <div className="lg:col-span-7">
          <AppleReadinessWidget />
        </div>

        {/* Right Card: User Cloud Identity (Equivalent to Deyaauldeen Profile in iCloud) */}
        <div className="lg:col-span-5">
          <AppleProfileWidget student={student} />
        </div>

      </div>

      {/* 3. Bottom Bento Row: Notes & Tasks (4 cols) + Drive & Files (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Assignments / Notes (Equivalent to Apple Notes in iCloud) */}
        <div className="lg:col-span-4">
          <AppleNotesWidget />
        </div>

        {/* Right Card: Course Materials / Drive (Equivalent to Drive in iCloud) */}
        <div className="lg:col-span-8">
          <AppleDriveWidget />
        </div>

      </div>

    </div>
  );
}
