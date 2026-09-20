import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEnrolledCourses } from "@/lib/db-queries";
import { fetchTeamsCalendarEvents } from "@/lib/teams-client";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export const dynamic = "force-dynamic";

export interface MergedScheduleItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn?: string;
  instructor: string;
  room: string;
  day: "sun" | "mon" | "tue" | "wed" | "thu";
  startTime: string; // HH:mm in Asia/Amman
  endTime: string;   // HH:mm in Asia/Amman
  type: "lecture" | "lab" | "tutorial";
  color: string;
  // Teams Integration additions
  hasTeamsMeeting: boolean;
  teamsJoinUrl?: string;
  teamsSubject?: string;
  isCancelled: boolean;
  isRescheduled: boolean;
  originalTime?: string;
  teamsLocation?: string;
}

export async function GET() {
  try {
    const session = await getSession();
    const studentId = session?.userId;

    const courses = await getEnrolledCourses(studentId);

    let isTeamsConnected = false;
    let teamsEvents: any[] = [];

    if (studentId) {
      const conn = await prisma.teamsConnection.findUnique({
        where: { studentId },
      });
      if (conn && conn.syncStatus === "connected") {
        isTeamsConnected = true;
        const now = new Date();
        const startWeek = startOfWeek(now, { weekStartsOn: 0 }).toISOString();
        const endWeek = endOfWeek(now, { weekStartsOn: 0 }).toISOString();
        teamsEvents = await fetchTeamsCalendarEvents(studentId, startWeek, endWeek);
      }
    }

    const mergedItems: MergedScheduleItem[] = [];

    for (const c of courses) {
      for (const s of c.schedule) {
        // Look for matching Teams meeting on the same day or matching course
        const matchedTeams = teamsEvents.find((t) => {
          if (t.day !== s.day) return false;
          // Match by courseCode or name keyword
          const subjectLower = (t.subject || "").toLowerCase();
          const codeLower = (c.code || "").toLowerCase();
          const nameLower = (c.nameAr || "").toLowerCase();
          return (
            (t.courseCode && t.courseCode.toLowerCase() === codeLower) ||
            subjectLower.includes(codeLower) ||
            (nameLower.length > 4 && subjectLower.includes(nameLower.slice(0, 8)))
          );
        });

        const isCancelled = matchedTeams ? matchedTeams.isCancelled : false;
        const isRescheduled = matchedTeams ? Boolean(matchedTeams.isRescheduled || (matchedTeams.startTime !== s.startTime)) : false;
        const finalStartTime = matchedTeams && isRescheduled ? matchedTeams.startTime : s.startTime;
        const finalEndTime = matchedTeams && isRescheduled ? matchedTeams.endTime : s.endTime;

        mergedItems.push({
          id: `${c.id}-${s.day}-${s.startTime}`,
          courseId: c.id,
          courseCode: c.code,
          courseNameAr: c.nameAr,
          courseNameEn: c.nameEn,
          instructor: c.instructor,
          room: s.type === "lab" ? "مختبر الحاسوب 103" : c.room,
          day: s.day,
          startTime: finalStartTime,
          endTime: finalEndTime,
          type: s.type,
          color: c.color,
          hasTeamsMeeting: Boolean(matchedTeams?.joinUrl || matchedTeams?.isOnlineMeeting),
          teamsJoinUrl: matchedTeams?.joinUrl,
          teamsSubject: matchedTeams?.subject,
          isCancelled,
          isRescheduled,
          originalTime: isRescheduled ? `${s.startTime} - ${s.endTime}` : undefined,
          teamsLocation: matchedTeams?.location,
        });
      }
    }

    // Sort by day and then start time
    const dayOrder = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4 };
    mergedItems.sort((a, b) => {
      const dDiff = (dayOrder[a.day] ?? 99) - (dayOrder[b.day] ?? 99);
      if (dDiff !== 0) return dDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    return NextResponse.json({
      items: mergedItems,
      teamsConnected: isTeamsConnected,
    });
  } catch (error) {
    console.error("[Merged Schedule API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
