import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as ics from 'ics';

const daysMap: Record<string, string> = {
  sun: 'SU', mon: 'MO', tue: 'TU', wed: 'WE', thu: 'TH', fri: 'FR', sat: 'SA'
};

const dayOffset: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
};

// Gets the next occurrence of a specific day of the week
function getNextDayOfWeek(dayName: string) {
  const date = new Date();
  const targetDay = dayOffset[dayName.toLowerCase()];
  if (targetDay === undefined) return date;

  const currentDay = date.getDay();
  let distance = targetDay - currentDay;
  if (distance < 0) distance += 7; // If day has passed this week, get next week's
  
  date.setDate(date.getDate() + distance);
  return date;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              assignments: true
            }
          }
        }
      }
    }
  });

  if (!student) {
    return new NextResponse('Student not found', { status: 404 });
  }

  const events: ics.EventAttributes[] = [];

  // Add course schedules
  for (const enrollment of student.enrollments) {
    const course = enrollment.course;
    let schedules: any[] = [];
    try {
      schedules = JSON.parse(course.schedule);
    } catch (e) {}

    for (const sched of schedules) {
      if (!sched.day || !sched.startTime || !sched.endTime) continue;

      const startDate = getNextDayOfWeek(sched.day);
      const [startHour, startMin] = sched.startTime.split(':').map(Number);
      const [endHour, endMin] = sched.endTime.split(':').map(Number);
      
      const durationHours = endHour - startHour;
      const durationMins = endMin - startMin;

      // Calculate total duration in minutes
      const totalDurationMins = (durationHours * 60) + durationMins;

      const rruleDay = daysMap[sched.day.toLowerCase()] || 'SU';

      events.push({
        start: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startHour, startMin],
        duration: { minutes: totalDurationMins },
        title: `[${course.code}] ${course.nameAr}`,
        description: `المادة: ${course.nameAr}\nالمدرس: ${course.instructor}\nالنوع: ${sched.type}`,
        location: course.room,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${rruleDay};UNTIL=20260101T000000Z`,
        status: 'CONFIRMED',
        busyStatus: 'BUSY'
      });
    }

    // Add assignments
    for (const assignment of course.assignments) {
      if (!assignment.dueDate || !assignment.dueTime) continue;
      
      const [year, month, day] = assignment.dueDate.split('-').map(Number);
      const [hour, min] = assignment.dueTime.split(':').map(Number);

      events.push({
        start: [year, month, day, hour, min],
        duration: { minutes: 30 },
        title: `تسليم واجب: ${assignment.title} (${course.code})`,
        description: `${assignment.description || ''}\n\nالمادة: ${course.nameAr}`,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        alarms: [{ action: 'display', description: 'تذكير بموعد التسليم', trigger: { hours: 24, before: true } }]
      });
    }
  }

  if (events.length === 0) {
    // Add a dummy event if no schedule
    events.push({
      start: [2026, 1, 1, 9, 0],
      duration: { hours: 1 },
      title: 'بوابة مسار: لم يتم تسجيل مواد',
      description: 'قم بتسجيل موادك لرؤيتها هنا.'
    });
  }

  const { error, value } = ics.createEvents(events);

  if (error || !value) {
    console.error('ICS generation error:', error);
    return new NextResponse('Error generating calendar', { status: 500 });
  }

  return new NextResponse(value, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="masar_schedule_${student.studentId}.ics"`,
    },
  });
}
