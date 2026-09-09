import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const JORDAN_TIMEZONE = "Asia/Amman";

export interface ZonedDateResult {
  iso: string | null;
  dateStr: string; // YYYY-MM-DD in Asia/Amman
  timeStr: string; // HH:mm (24h) in Asia/Amman
  formattedDateAr: string; // e.g. "20 أغسطس 2026"
  formattedTimeAr: string; // e.g. "11:00 م"
  isPast: boolean;
  rawMillis: number | null;
}

/**
 * Safe and explicit parser for Moodle Unix timestamps or date strings into Asia/Amman timezone.
 * Guarantees zero NaN crashes, handles Daylight Saving Time (DST) automatically via IANA timezone database.
 */
export function parseMoodleTimestampToZoned(
  raw: unknown,
  timeZone: string = JORDAN_TIMEZONE
): ZonedDateResult {
  const empty: ZonedDateResult = {
    iso: null,
    dateStr: "بدون موعد تسليم محدد",
    timeStr: "--:--",
    formattedDateAr: "بدون موعد تسليم محدد",
    formattedTimeAr: "--:--",
    isPast: false,
    rawMillis: null,
  };

  if (raw === null || raw === undefined || raw === 0 || raw === "0" || raw === "") {
    return empty;
  }

  try {
    let millis: number;

    if (typeof raw === "number") {
      millis = raw > 100_000_000_000 ? raw : raw * 1000;
    } else if (typeof raw === "string") {
      const num = Number(raw);
      if (!isNaN(num) && num > 0) {
        millis = num > 100_000_000_000 ? num : num * 1000;
      } else {
        millis = Date.parse(raw);
      }
    } else if (raw instanceof Date) {
      millis = raw.getTime();
    } else {
      return empty;
    }

    if (!Number.isFinite(millis) || millis <= 0) {
      return empty;
    }

    const date = new Date(millis);
    if (isNaN(date.getTime())) {
      return empty;
    }

    // Explicit conversions using IANA Asia/Amman timezone
    const dateStr = formatInTimeZone(date, timeZone, "yyyy-MM-dd");
    const timeStr = formatInTimeZone(date, timeZone, "HH:mm");
    const isPast = date.getTime() < Date.now();

    // Arabic 12-hour formatted time (e.g. "11:00 م")
    const [hStr, mStr] = timeStr.split(":");
    const hNum = parseInt(hStr, 10);
    const period = hNum >= 12 ? "م" : "ص";
    const h12 = hNum > 12 ? hNum - 12 : hNum === 0 ? 12 : hNum;
    const formattedTimeAr = `${h12}:${mStr} ${period}`;

    // Arabic formatted date in Asia/Amman (e.g. "20 أغسطس 2026")
    let formattedDateAr = dateStr;
    try {
      formattedDateAr = new Intl.DateTimeFormat("ar-JO", {
        timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      formattedDateAr = dateStr;
    }

    return {
      iso: date.toISOString(),
      dateStr,
      timeStr,
      formattedDateAr,
      formattedTimeAr,
      isPast,
      rawMillis: millis,
    };
  } catch (err) {
    console.warn(`[timezone] Error parsing date in ${timeZone}:`, err);
    return empty;
  }
}

/**
 * Get current day of week ("sun", "mon", etc.) strictly calculated in Asia/Amman.
 */
export function getTodayDayInAmman(timeZone: string = JORDAN_TIMEZONE): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
    });
    return formatter.format(new Date()).toLowerCase();
  } catch {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[new Date().getDay()];
  }
}

/**
 * Get current hour and minute strictly calculated in Asia/Amman.
 */
export function getCurrentTimeInAmman(timeZone: string = JORDAN_TIMEZONE): {
  hours: number;
  minutes: number;
  totalMinutes: number;
  timeString: string;
} {
  try {
    const timeString = formatInTimeZone(new Date(), timeZone, "HH:mm");
    const [hours, minutes] = timeString.split(":").map(Number);
    return {
      hours,
      minutes,
      totalMinutes: hours * 60 + minutes,
      timeString,
    };
  } catch {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return {
      hours,
      minutes,
      totalMinutes: hours * 60 + minutes,
      timeString: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    };
  }
}
