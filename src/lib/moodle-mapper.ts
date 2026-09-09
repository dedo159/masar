/**
 * ============================================================================
 * Permissive & Fault-Tolerant Moodle LMS Data Normalizer (TypeScript)
 * ============================================================================
 * 
 * ZERO DATA DROP POLICY:
 * - Never filters out or drops any item (Course, Assignment, Grade, User).
 * - Isolated try/catch per item mapping with console.warn logging.
 * - Auto-detects nested response shapes (e.g. data.courses, data.enrolledcourses, data.assignments).
 * - Safe optional chaining (?.) and nullish coalescing (??) throughout.
 * - Forgiving date & number parsing with zero NaN or Invalid Date crashes.
 * - Retains raw payload references (_raw) on every normalized object.
 */

export interface MoodleRawCustomField {
  name?: string;
  shortname?: string;
  type?: string;
  valuenum?: number | null;
  value?: string | number | null;
  valueformatted?: string | null;
  [key: string]: any;
}

export interface MoodleRawCourse {
  id?: number | string | null;
  shortname?: string | null;
  fullname?: string | null;
  displayname?: string | null;
  summary?: string | null;
  summaryformat?: number | null;
  startdate?: number | string | null;
  enddate?: number | string | null;
  visible?: number | boolean | null;
  progress?: number | string | null;
  completed?: boolean | null;
  iscompleted?: boolean | null;
  timecompleted?: number | string | null;
  customfields?: MoodleRawCustomField[] | null;
  [key: string]: any;
}

export interface MoodleRawAssignment {
  id?: number | string | null;
  cmid?: number | null;
  course?: number | string | null;
  name?: string | null;
  duedate?: number | string | null;
  grade?: number | string | null;
  intro?: string | null;
  [key: string]: any;
}

export interface MoodleRawSiteInfo {
  sitename?: string | null;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  userid?: number | string | null;
  userpictureurl?: string | null;
  customfields?: MoodleRawCustomField[] | null;
  [key: string]: any;
}

export interface NormalizedStudentProfile {
  moodleUserId: number;
  academicId: string;
  fullName: string;
  email: string;
  major: string;
  academicYear: number;
  avatarUrl: string | null;
  gpa: number;
  totalCreditsRequired: number;
  completedCredits: number;
  remainingCredits: number;
  progressPercentage: number;
  _raw?: any;
}

export interface NormalizedCourse {
  moodleCourseId: number;
  courseCode: string;
  courseName: string;
  sectionNumber: string | null;
  semester: string;
  credits: number;
  instructorName: string;
  summary: string;
  progressPercent: number;
  status: "enrolled" | "completed" | "dropped" | "failed";
  isCompleted: boolean;
  startDateIso: string | null;
  endDateIso: string | null;
  completedDateIso: string | null;
  _raw?: any;
}

export interface NormalizedAssignment {
  moodleAssignmentId: number;
  moodleCourseId: number;
  title: string;
  description: string;
  dueDateIso: string | null;
  dueDateFormatted: string;
  dueTimeFormatted: string;
  isOverdue: boolean;
  maxGrade: number;
  type: "assignment" | "project" | "quiz" | "exam";
  _raw?: any;
}

export interface NormalizedMoodleSyncData {
  student: NormalizedStudentProfile;
  courses: NormalizedCourse[];
  assignments: NormalizedAssignment[];
  syncTimestamp: string;
}

// ============================================================================
// Robust Helper Utilities
// ============================================================================

/**
 * 5. Preserving Raw Keys: Auto-detects arrays inside nested wrappers
 * Checks if input is an array, or wrapped inside data.courses, data.assignments, etc.
 */
export function extractRawArray(payload: unknown, candidateKeys: string[] = []): any[] {
  if (!payload) return [];

  // 1. Direct Array
  if (Array.isArray(payload)) {
    return payload;
  }

  // 2. Object with nested array
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, any>;
    const keysToCheck = [
      ...candidateKeys,
      "courses",
      "enrolledcourses",
      "assignments",
      "data",
      "items",
      "result",
      "response",
    ];

    for (const key of keysToCheck) {
      if (Array.isArray(obj?.[key])) {
        return obj[key];
      }
    }

    // 3. If payload itself is a single object with an ID, wrap in single-item array
    if (obj?.id !== undefined || obj?.fullname !== undefined || obj?.name !== undefined) {
      return [obj];
    }
  }

  return [];
}

/**
 * 1. Permissive HTML Stripping & Entity Decoding
 */
export function safeSanitizeHtml(raw: unknown, fallback: string = ""): string {
  if (raw === null || raw === undefined) return fallback;
  const str = String(raw);
  if (!str.trim()) return fallback;

  try {
    let clean = str
      .replace(/<br\s*[\/]?>/gi, " ")
      .replace(/<\/(p|div|tr|li)>/gi, " ")
      .replace(/<[^>]*>/g, " ");

    const entities: Record<string, string> = {
      "&nbsp;": " ",
      "&amp;": "&",
      "&quot;": '"',
      "&#039;": "'",
      "&apos;": "'",
      "&lt;": "<",
      "&gt;": ">",
      "&rlm;": "",
      "&lrm;": "",
    };

    for (const [k, v] of Object.entries(entities)) {
      clean = clean.replaceAll(k, v);
    }

    clean = clean.replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCharCode(parseInt(dec, 10));
      } catch {
        return "";
      }
    });

    clean = clean.replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return "";
      }
    });

    return clean.replace(/\s+/g, " ").trim() || fallback;
  } catch {
    return str || fallback;
  }
}

/**
 * 4. Forgiving Number Sanitizer (Zero NaN Guarantee)
 */
export function safeNumber(val: unknown, fallback: number = 0): number {
  if (val === null || val === undefined || val === "") return fallback;
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

/**
 * 4. Forgiving Date Parsing (Zero Invalid Date Guarantee)
 */
export function safeDate(
  raw: unknown,
  timeZone: string = "Asia/Amman"
): {
  iso: string | null;
  formattedDate: string;
  formattedTime: string;
  isPast: boolean;
} {
  const empty = {
    iso: null,
    formattedDate: "غير محدد",
    formattedTime: "--:--",
    isPast: false,
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

    const iso = date.toISOString();
    const isPast = date.getTime() < Date.now();

    let formattedDate = iso.split("T")[0];
    let formattedTime = "00:00";

    try {
      formattedDate = new Intl.DateTimeFormat("ar-JO", {
        timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

      formattedTime = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      // Fallback already assigned
    }

    return {
      iso,
      formattedDate,
      formattedTime,
      isPast,
    };
  } catch {
    return empty;
  }
}

/**
 * Safe Custom Field Extractor
 */
export function safeExtractCustomField<T extends string | number | boolean>(
  customfields: unknown,
  shortname: string,
  type: "string" | "number" | "boolean",
  fallback: T
): T {
  if (!Array.isArray(customfields) || customfields.length === 0) {
    return fallback;
  }

  try {
    const target = shortname.toLowerCase();
    const field = customfields.find((f: any) => {
      const sn = String(f?.shortname ?? "").toLowerCase();
      const n = String(f?.name ?? "").toLowerCase();
      return sn === target || n === target;
    });

    if (!field) return fallback;

    const rawVal = field?.value ?? field?.valueformatted ?? field?.valuenum;
    if (rawVal === null || rawVal === undefined) return fallback;

    if (type === "number") {
      return safeNumber(rawVal, fallback as number) as T;
    }

    if (type === "boolean") {
      const s = String(rawVal).toLowerCase();
      return (s === "1" || s === "true" || s === "yes") as T;
    }

    const str = safeSanitizeHtml(rawVal, "");
    return (str.length > 0 ? str : fallback) as T;
  } catch {
    return fallback;
  }
}

/**
 * Permissive Course Code & Name Parser
 */
export function safeParseCourseTitle(
  shortname: unknown,
  fullname: unknown,
  fallbackIndex: number = 1
): {
  courseCode: string;
  courseName: string;
  sectionNumber: string | null;
} {
  const short = safeSanitizeHtml(shortname, "");
  const full = safeSanitizeHtml(fullname, "");
  const combined = `${short} ${full}`.trim();

  let courseCode = "";
  let sectionNumber: string | null = null;

  try {
    // Academic Code Regex: CS101, MIS-201, 0101101
    const codeMatch = combined.match(/\b([a-zA-Z]{2,5}[-_]?[0-9]{3,4}|[0-9]{6,8})\b/i);
    if (codeMatch?.[1]) {
      courseCode = codeMatch[1].toUpperCase().replace("_", "-");
    }

    // Section Regex
    const secMatch = combined.match(/(?:شعبة|sec(?:tion)?)\s*[:#]?\s*([0-9]+)/i);
    if (secMatch?.[1]) {
      sectionNumber = secMatch[1];
    }
  } catch {
    // ignore regex issues
  }

  if (!courseCode) {
    courseCode = short.split(/[\s_-]+/)[0] || `CRS-${fallbackIndex}`;
  }

  let courseName = full || short || `مادة دراسية ${fallbackIndex}`;
  try {
    courseName = courseName
      .replace(new RegExp(`^${courseCode}\\s*[-:–—|]\\s*`, "i"), "")
      .replace(new RegExp(`[-:–—|]\\s*${courseCode}\\b`, "i"), "")
      .replace(/(?:شعبة|sec(?:tion)?)\s*[:#]?\s*[0-9]+/gi, "")
      .replace(/(?:الفصل|semester)\s*[^–—|-]+/gi, "")
      .replace(/20\d\d\s*[\/-]\s*20\d\d/g, "")
      .replace(/[\(\)\[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    // ignore clean error
  }

  if (courseName.length < 2) {
    courseName = full || short || `مادة دراسية ${fallbackIndex}`;
  }

  return {
    courseCode,
    courseName,
    sectionNumber,
  };
}

// ============================================================================
// Main Resilient Mapper Class
// ============================================================================

export class MoodleDataMapper {
  private readonly defaultTimeZone: string;
  private readonly defaultCredits: number;

  constructor(options?: { timeZone?: string; defaultCredits?: number }) {
    this.defaultTimeZone = options?.timeZone ?? "Asia/Amman";
    this.defaultCredits = options?.defaultCredits ?? 3;
  }

  /**
   * 1. Permissive normalizeCourse (Never crashes, never drops)
   */
  public normalizeCourse(raw: any, index: number = 0): NormalizedCourse {
    // Absolute fallback object
    const fallbackId = safeNumber(raw?.id, index + 1);
    const fallbackCode = `MDL-${fallbackId}`;
    const fallbackName = safeSanitizeHtml(raw?.fullname ?? raw?.displayname ?? raw?.shortname, `مادة غير محددة (${fallbackId})`);

    try {
      const moodleCourseId = fallbackId;
      const { courseCode, courseName, sectionNumber } = safeParseCourseTitle(
        raw?.shortname,
        raw?.fullname ?? raw?.displayname,
        index + 1
      );

      const customCredits = safeExtractCustomField<number>(
        raw?.customfields,
        "credits",
        "number",
        safeExtractCustomField<number>(
          raw?.customfields,
          "credit_hours",
          "number",
          this.defaultCredits
        )
      );
      const credits = customCredits > 0 ? customCredits : this.defaultCredits;

      const instructorName = safeExtractCustomField<string>(
        raw?.customfields,
        "instructor",
        "string",
        "أستاذ المادة"
      );

      const progress = Math.min(100, Math.max(0, safeNumber(raw?.progress, 0)));
      const isCompleted =
        raw?.completed === true ||
        raw?.iscompleted === true ||
        (typeof raw?.timecompleted === "number" && raw?.timecompleted > 0) ||
        progress >= 100;

      const startDate = safeDate(raw?.startdate, this.defaultTimeZone);
      const endDate = safeDate(raw?.enddate, this.defaultTimeZone);
      const completedDate = safeDate(raw?.timecompleted, this.defaultTimeZone);

      let status: "enrolled" | "completed" | "dropped" | "failed" = "enrolled";
      if (isCompleted) {
        status = "completed";
      } else if (endDate.isPast && progress < 50 && raw?.enddate) {
        status = "dropped";
      }

      const semester = safeExtractCustomField<string>(
        raw?.customfields,
        "semester",
        "string",
        "الفصل الدراسي الحالي"
      );

      return {
        moodleCourseId,
        courseCode: courseCode || fallbackCode,
        courseName: courseName || fallbackName,
        sectionNumber,
        semester,
        credits,
        instructorName,
        summary: safeSanitizeHtml(raw?.summary, ""),
        progressPercent: progress,
        status,
        isCompleted,
        startDateIso: startDate.iso,
        endDateIso: endDate.iso,
        completedDateIso: completedDate.iso,
        _raw: raw,
      };
    } catch (err) {
      console.warn(`[MoodleDataMapper] Isolated error normalizing course at index ${index}:`, err);
      return {
        moodleCourseId: fallbackId,
        courseCode: fallbackCode,
        courseName: fallbackName,
        sectionNumber: null,
        semester: "الفصل الدراسي الحالي",
        credits: this.defaultCredits,
        instructorName: "أستاذ المادة",
        summary: "",
        progressPercent: 0,
        status: "enrolled",
        isCompleted: false,
        startDateIso: null,
        endDateIso: null,
        completedDateIso: null,
        _raw: raw,
      };
    }
  }

  /**
   * 1. ZERO DATA DROP: normalizeCourses
   * Unnests payloads and uses isolated try/catch per item.
   */
  public normalizeCourses(rawPayload: unknown): {
    courses: NormalizedCourse[];
    completedCredits: number;
    enrolledCredits: number;
  } {
    const rawList = extractRawArray(rawPayload, ["courses", "enrolledcourses"]);

    if (rawList.length === 0) {
      return { courses: [], completedCredits: 0, enrolledCredits: 0 };
    }

    let completedCredits = 0;
    let enrolledCredits = 0;

    // Map with isolated try/catch per element: ZERO DATA DROP
    const courses: NormalizedCourse[] = rawList.map((item: any, idx: number) => {
      try {
        const normalized = this.normalizeCourse(item, idx);
        if (normalized.isCompleted) {
          completedCredits += normalized.credits;
        } else {
          enrolledCredits += normalized.credits;
        }
        return normalized;
      } catch (err) {
        console.warn(`[MoodleDataMapper] Failed to normalize course [${idx}]:`, err);
        const fallback = this.normalizeCourse(item, idx);
        enrolledCredits += fallback.credits;
        return fallback;
      }
    });

    return {
      courses,
      completedCredits,
      enrolledCredits,
    };
  }

  /**
   * 1. Permissive normalizeAssignment (Never crashes, never drops)
   */
  public normalizeAssignment(raw: any, index: number = 0): NormalizedAssignment {
    const fallbackId = safeNumber(raw?.id, index + 1);
    const fallbackTitle = safeSanitizeHtml(raw?.name, `واجب دراسي (${fallbackId})`);

    try {
      const moodleAssignmentId = fallbackId;
      const moodleCourseId = safeNumber(raw?.course, 0);
      const title = fallbackTitle;
      const description = safeSanitizeHtml(raw?.intro, "");

      const dateResult = safeDate(raw?.duedate, this.defaultTimeZone);
      const maxGrade = safeNumber(raw?.grade, 20);

      let type: "assignment" | "project" | "quiz" | "exam" = "assignment";
      const t = title.toLowerCase();
      if (t.includes("مشروع") || t.includes("بحث") || t.includes("project")) {
        type = "project";
      } else if (t.includes("كويز") || t.includes("اختبار") || t.includes("quiz")) {
        type = "quiz";
      } else if (t.includes("امتحان") || t.includes("exam")) {
        type = "exam";
      }

      return {
        moodleAssignmentId,
        moodleCourseId,
        title,
        description,
        dueDateIso: dateResult.iso,
        dueDateFormatted: dateResult.formattedDate,
        dueTimeFormatted: dateResult.formattedTime,
        isOverdue: dateResult.isPast,
        maxGrade,
        type,
        _raw: raw,
      };
    } catch (err) {
      console.warn(`[MoodleDataMapper] Error normalizing assignment [${index}]:`, err);
      return {
        moodleAssignmentId: fallbackId,
        moodleCourseId: safeNumber(raw?.course, 0),
        title: fallbackTitle,
        description: "",
        dueDateIso: null,
        dueDateFormatted: "غير محدد",
        dueTimeFormatted: "--:--",
        isOverdue: false,
        maxGrade: 20,
        type: "assignment",
        _raw: raw,
      };
    }
  }

  /**
   * 1. ZERO DATA DROP: normalizeAssignments
   */
  public normalizeAssignments(rawPayload: unknown): NormalizedAssignment[] {
    let rawList: any[] = [];

    // Check if assignment data is nested in courses
    if (typeof rawPayload === "object" && rawPayload !== null) {
      const obj = rawPayload as Record<string, any>;
      if (Array.isArray(obj?.courses)) {
        for (const c of obj.courses) {
          if (Array.isArray(c?.assignments)) {
            for (const a of c.assignments) {
              rawList.push({ ...a, course: a?.course ?? c?.id });
            }
          }
        }
      }
    }

    if (rawList.length === 0) {
      rawList = extractRawArray(rawPayload, ["assignments"]);
    }

    return rawList.map((item: any, idx: number) => {
      try {
        return this.normalizeAssignment(item, idx);
      } catch (err) {
        console.warn(`[MoodleDataMapper] Failed to normalize assignment [${idx}]:`, err);
        return this.normalizeAssignment(item, idx);
      }
    });
  }

  /**
   * Permissive normalizeStudentProfile
   */
  public normalizeStudentProfile(
    rawSiteInfo: any,
    options?: { completedCredits?: number; totalCredits?: number }
  ): NormalizedStudentProfile {
    try {
      const moodleUserId = safeNumber(rawSiteInfo?.userid, 0);
      const academicId = safeSanitizeHtml(rawSiteInfo?.username, "202510377");
      const fullName = safeSanitizeHtml(rawSiteInfo?.fullname, "طالب مسار");
      const email = `${academicId}@university.edu`;

      const major = safeExtractCustomField<string>(
        rawSiteInfo?.customfields,
        "major",
        "string",
        safeExtractCustomField<string>(
          rawSiteInfo?.customfields,
          "department",
          "string",
          "تكنولوجيا المعلومات"
        )
      );

      const gpa = safeExtractCustomField<number>(
        rawSiteInfo?.customfields,
        "gpa",
        "number",
        3.5
      );

      const academicYear = safeExtractCustomField<number>(
        rawSiteInfo?.customfields,
        "academic_year",
        "number",
        2
      );

      const totalCreditsRequired = options?.totalCredits ?? 132;
      const completedCredits = Math.max(0, options?.completedCredits ?? 0);
      const remainingCredits = Math.max(0, totalCreditsRequired - completedCredits);
      const progressPercentage = Math.min(
        100,
        Math.round((completedCredits / (totalCreditsRequired || 1)) * 100)
      );

      return {
        moodleUserId,
        academicId,
        fullName,
        email,
        major,
        academicYear,
        avatarUrl: typeof rawSiteInfo?.userpictureurl === "string" ? rawSiteInfo.userpictureurl : null,
        gpa,
        totalCreditsRequired,
        completedCredits,
        remainingCredits,
        progressPercentage,
        _raw: rawSiteInfo,
      };
    } catch (err) {
      console.warn("[MoodleDataMapper] Error normalizing student profile:", err);
      return {
        moodleUserId: 0,
        academicId: "202510377",
        fullName: "طالب مسار",
        email: "student@university.edu",
        major: "تكنولوجيا المعلومات",
        academicYear: 2,
        avatarUrl: null,
        gpa: 3.5,
        totalCreditsRequired: 132,
        completedCredits: 0,
        remainingCredits: 132,
        progressPercentage: 0,
        _raw: rawSiteInfo,
      };
    }
  }

  /**
   * Complete End-to-End Fault-Tolerant Sync Normalizer
   */
  public normalizeFullSync(
    siteInfoRaw: unknown,
    coursesRaw: unknown,
    assignmentsRaw: unknown = []
  ): NormalizedMoodleSyncData {
    const { courses, completedCredits } = this.normalizeCourses(coursesRaw);
    const student = this.normalizeStudentProfile(siteInfoRaw, { completedCredits });
    const assignments = this.normalizeAssignments(assignmentsRaw);

    return {
      student,
      courses,
      assignments,
      syncTimestamp: new Date().toISOString(),
    };
  }
}

export const moodleDataMapper = new MoodleDataMapper();
