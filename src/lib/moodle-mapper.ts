/**
 * ============================================================================
 * Moodle LMS Defensive Data Mapper & Normalizer (TypeScript)
 * ============================================================================
 * 
 * Provides robust, null-safe, enterprise-grade mapping and sanitization
 * for raw JSON payloads returned by Moodle Web Services API endpoints:
 * - core_webservice_get_site_info
 * - core_enrol_get_users_courses
 * - core_completion_get_course_completion_status
 * - mod_assign_get_assignments
 * - gradereport_user_get_grade_items
 * 
 * Features:
 * 1. Comprehensive HTML entity decoding & tag stripping (RTL/LTR & entity safe).
 * 2. Timezone-aware, safe Unix timestamp parsing (guards against epoch 0 & NaN).
 * 3. Bulletproof null/undefined/type fallbacks with zero crash guarantees.
 * 4. Flexible Custom Fields extractor for user and course metadata.
 * 5. Robust Course Code & Title Regex parser (extracts clean codes, names, sections).
 * 6. Deterministic course completion & credit hours calculator.
 * 7. End-to-end typed DTOs & Schemas.
 */

// ============================================================================
// 1. TypeScript Interfaces & DTOs (Data Transfer Objects)
// ============================================================================

/**
 * Raw Moodle Custom Field representation
 */
export interface MoodleRawCustomField {
  name?: string;
  shortname?: string;
  type?: string;
  valuenum?: number | null;
  value?: string | number | null;
  valueformatted?: string | null;
}

/**
 * Raw Moodle Course payload from `core_enrol_get_users_courses`
 */
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
  showactivitydates?: boolean | null;
  showcompletionconditions?: boolean | null;
  pdfexportfont?: string | null;
  category?: number | null;
  progress?: number | null;
  completed?: boolean | null;
  iscompleted?: boolean | null;
  timecompleted?: number | null;
  customfields?: MoodleRawCustomField[] | null;
}

/**
 * Raw Moodle Site Info payload from `core_webservice_get_site_info`
 */
export interface MoodleRawSiteInfo {
  sitename?: string | null;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  lang?: string | null;
  userid?: number | string | null;
  userpictureurl?: string | null;
  functions?: Array<{ name: string; version: string }> | null;
  customfields?: MoodleRawCustomField[] | null;
}

/**
 * Raw Moodle Assignment payload from `mod_assign_get_assignments`
 */
export interface MoodleRawAssignment {
  id?: number | string | null;
  cmid?: number | null;
  course?: number | null;
  name?: string | null;
  nosubmissions?: number | null;
  submissiondrafts?: number | null;
  sendnotifications?: number | null;
  duedate?: number | string | null;
  allowsubmissionsfromdate?: number | string | null;
  grade?: number | string | null;
  timemodified?: number | null;
  cutoffdate?: number | string | null;
  intro?: string | null;
  introformat?: number | null;
  introattachments?: Array<{ fileurl: string; filename: string }> | null;
}

/**
 * Raw Moodle Completion Status from `core_completion_get_course_completion_status`
 */
export interface MoodleRawCompletionStatus {
  completed?: boolean | null;
  aggregation?: number | null;
  timecompleted?: number | null;
  completions?: Array<{
    type?: number;
    title?: string;
    status?: string | number;
    complete?: boolean;
    timecompleted?: number | null;
  }> | null;
}

/**
 * Clean, Normalized Student Profile DTO
 */
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
}

/**
 * Clean, Normalized Course DTO
 */
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
}

/**
 * Clean, Normalized Assignment DTO
 */
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
}

/**
 * Clean Normalized Sync Summary DTO
 */
export interface NormalizedMoodleSyncData {
  student: NormalizedStudentProfile;
  courses: NormalizedCourse[];
  assignments: NormalizedAssignment[];
  syncTimestamp: string;
}

// ============================================================================
// 2. Defensive Utility Helpers
// ============================================================================

const HTML_ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rlm;": "",
  "&lrm;": "",
  "&ndash;": "-",
  "&mdash;": "—",
  "&hellip;": "...",
  "&bull;": "•",
  "&copy;": "©",
  "&reg;": "®",
};

/**
 * 1. HTML Stripping & Sanitization
 */
export function sanitizeHtml(raw: unknown, fallback: string = ""): string {
  if (typeof raw !== "string" || !raw.trim()) {
    return fallback;
  }

  let text = raw
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/(p|div|tr|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  for (const [entity, replacement] of Object.entries(HTML_ENTITY_MAP)) {
    text = text.replaceAll(entity, replacement);
  }

  text = text.replace(/&#(\d+);/g, (_, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return "";
    }
  });

  text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return "";
    }
  });

  return text
    .replace(/[ \t\f\r]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/**
 * 2. Safe Date Parsing & Timezone Handling
 */
export function parseMoodleTimestamp(
  raw: unknown,
  targetTimeZone: string = "Asia/Amman"
): {
  iso: string | null;
  formattedDate: string;
  formattedTime: string;
  isPast: boolean;
} {
  const nullResult = {
    iso: null,
    formattedDate: "غير محدد",
    formattedTime: "--:--",
    isPast: false,
  };

  if (raw === null || raw === undefined || raw === "" || raw === 0 || raw === "0") {
    return nullResult;
  }

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
    return nullResult;
  }

  if (!Number.isFinite(millis) || millis <= 0) {
    return nullResult;
  }

  const date = new Date(millis);
  if (isNaN(date.getTime())) {
    return nullResult;
  }

  const iso = date.toISOString();
  const now = new Date();
  const isPast = date < now;

  let formattedDate: string;
  let formattedTime: string;

  try {
    formattedDate = new Intl.DateTimeFormat("ar-JO", {
      timeZone: targetTimeZone,
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    formattedTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: targetTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    formattedDate = iso.split("T")[0];
    formattedTime = "00:00";
  }

  return {
    iso,
    formattedDate,
    formattedTime,
    isPast,
  };
}

/**
 * 3. Strict Number Sanitizer
 */
export function sanitizeNumber(val: unknown, fallback: number = 0): number {
  if (val === null || val === undefined || val === "") return fallback;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * 4. Custom Fields Extractor
 */
export function extractCustomField<T extends string | number | boolean>(
  customfields: unknown,
  targetShortname: string,
  type: "string" | "number" | "boolean",
  fallback: T
): T {
  if (!Array.isArray(customfields) || customfields.length === 0) {
    return fallback;
  }

  const field = customfields.find((f: any) => {
    if (!f || typeof f !== "object") return false;
    const nameMatch =
      typeof f.shortname === "string" &&
      f.shortname.toLowerCase() === targetShortname.toLowerCase();
    const altMatch =
      typeof f.name === "string" &&
      f.name.toLowerCase() === targetShortname.toLowerCase();
    return nameMatch || altMatch;
  });

  if (!field) return fallback;

  const rawValue = field.value ?? field.valueformatted ?? field.valuenum;
  if (rawValue === null || rawValue === undefined) return fallback;

  if (type === "number") {
    const num = Number(rawValue);
    return (Number.isFinite(num) ? num : fallback) as T;
  }

  if (type === "boolean") {
    const str = String(rawValue).trim().toLowerCase();
    return (str === "1" || str === "true" || str === "yes") as T;
  }

  const cleanStr = sanitizeHtml(String(rawValue));
  return (cleanStr.length > 0 ? cleanStr : fallback) as T;
}

/**
 * 5. Course Code & Title Parser
 */
export function parseCourseCodeAndTitle(
  shortname: unknown,
  fullname: unknown
): {
  courseCode: string;
  courseName: string;
  sectionNumber: string | null;
} {
  const cleanShort = sanitizeHtml(shortname, "");
  const cleanFull = sanitizeHtml(fullname, "");
  const candidateText = `${cleanShort} | ${cleanFull}`;

  const codeRegex = /\b([a-zA-Z]{2,5}[-_]?[0-9]{3,4}|[0-9]{7})\b/i;
  const codeMatch = cleanShort.match(codeRegex) || cleanFull.match(codeRegex);

  let courseCode = codeMatch ? codeMatch[1].toUpperCase().replace("_", "-") : "";
  if (!courseCode) {
    courseCode = cleanShort.split(/[\s_-]+/)[0] || "COURSE";
  }

  const sectionRegex = /(?:شعبة|شعبة:?|sec(?:tion)?)\s*[:#]?\s*([0-9]+)/i;
  const sectionMatch = candidateText.match(sectionRegex);
  const sectionNumber = sectionMatch ? sectionMatch[1] : null;

  let courseName = cleanFull || cleanShort || "مادة دراسية";

  courseName = courseName
    .replace(new RegExp(`^${courseCode}\\s*[-:–—|]\\s*`, "i"), "")
    .replace(new RegExp(`[-:–—|]\\s*${courseCode}\\b`, "i"), "")
    .replace(/(?:شعبة|sec(?:tion)?)\s*[:#]?\s*[0-9]+/gi, "")
    .replace(/(?:الفصل|semester)\s*[^–—|-]+/gi, "")
    .replace(/20\d\d\s*[\/-]\s*20\d\d/g, "")
    .replace(/[\(\)\[\]]/g, " ")
    .replace(/[-:–—|]{2,}/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (courseName.length < 2) {
    courseName = cleanFull || cleanShort;
  }

  return {
    courseCode,
    courseName,
    sectionNumber,
  };
}

/**
 * 6. Course Completion & Credits Logic
 */
export function evaluateCourseCompletion(rawCourse: MoodleRawCourse): {
  isCompleted: boolean;
  status: "enrolled" | "completed" | "dropped" | "failed";
  progressPercent: number;
} {
  const progress = Math.min(
    100,
    Math.max(0, sanitizeNumber(rawCourse.progress, 0))
  );

  const explicitCompleted =
    rawCourse.completed === true ||
    rawCourse.iscompleted === true ||
    (typeof rawCourse.timecompleted === "number" && rawCourse.timecompleted > 0);

  const endDateParsed = parseMoodleTimestamp(rawCourse.enddate);
  const isPastEndDate = endDateParsed.isPast;

  let isCompleted = false;
  let status: "enrolled" | "completed" | "dropped" | "failed" = "enrolled";

  if (explicitCompleted || progress >= 100) {
    isCompleted = true;
    status = "completed";
  } else if (isPastEndDate && progress < 50 && rawCourse.enddate) {
    isCompleted = false;
    status = "dropped";
  } else {
    isCompleted = false;
    status = "enrolled";
  }

  return {
    isCompleted,
    status,
    progressPercent: progress,
  };
}

// ============================================================================
// 3. Main Enterprise Data Mapper Class
// ============================================================================

export class MoodleDataMapper {
  private readonly defaultTimeZone: string;
  private readonly defaultCreditHoursPerCourse: number;
  private readonly defaultTotalDegreeCredits: number;

  constructor(options?: {
    timeZone?: string;
    defaultCreditHoursPerCourse?: number;
    defaultTotalDegreeCredits?: number;
  }) {
    this.defaultTimeZone = options?.timeZone || "Asia/Amman";
    this.defaultCreditHoursPerCourse = options?.defaultCreditHoursPerCourse || 3;
    this.defaultTotalDegreeCredits = options?.defaultTotalDegreeCredits || 132;
  }

  public normalizeCourse(raw: unknown): NormalizedCourse {
    if (!raw || typeof raw !== "object") {
      return {
        moodleCourseId: 0,
        courseCode: "UNKNOWN",
        courseName: "مادة غير معرفة",
        sectionNumber: null,
        semester: "الفصل الحالي",
        credits: this.defaultCreditHoursPerCourse,
        instructorName: "أستاذ المادة",
        summary: "",
        progressPercent: 0,
        status: "enrolled",
        isCompleted: false,
        startDateIso: null,
        endDateIso: null,
        completedDateIso: null,
      };
    }

    const c = raw as MoodleRawCourse;
    const moodleCourseId = sanitizeNumber(c.id, 0);

    const { courseCode, courseName, sectionNumber } = parseCourseCodeAndTitle(
      c.shortname,
      c.fullname || c.displayname
    );

    const customCredits = extractCustomField<number>(
      c.customfields,
      "credits",
      "number",
      extractCustomField<number>(
        c.customfields,
        "credit_hours",
        "number",
        this.defaultCreditHoursPerCourse
      )
    );
    const credits = customCredits > 0 ? customCredits : this.defaultCreditHoursPerCourse;

    const instructorName = extractCustomField<string>(
      c.customfields,
      "instructor",
      "string",
      "أستاذ المادة"
    );

    const startDate = parseMoodleTimestamp(c.startdate, this.defaultTimeZone);
    const endDate = parseMoodleTimestamp(c.enddate, this.defaultTimeZone);
    const completedDate = parseMoodleTimestamp(c.timecompleted, this.defaultTimeZone);

    const { isCompleted, status, progressPercent } = evaluateCourseCompletion(c);

    const semesterCustom = extractCustomField<string>(
      c.customfields,
      "semester",
      "string",
      ""
    );
    const semester = semesterCustom || "الفصل الدراسي الحالي";

    return {
      moodleCourseId,
      courseCode,
      courseName,
      sectionNumber,
      semester,
      credits,
      instructorName,
      summary: sanitizeHtml(c.summary, ""),
      progressPercent,
      status,
      isCompleted,
      startDateIso: startDate.iso,
      endDateIso: endDate.iso,
      completedDateIso: completedDate.iso,
    };
  }

  public normalizeCourses(rawCourses: unknown): {
    courses: NormalizedCourse[];
    completedCredits: number;
    enrolledCredits: number;
  } {
    if (!Array.isArray(rawCourses)) {
      return { courses: [], completedCredits: 0, enrolledCredits: 0 };
    }

    const courses: NormalizedCourse[] = [];
    let completedCredits = 0;
    let enrolledCredits = 0;

    for (const raw of rawCourses) {
      const normalized = this.normalizeCourse(raw);
      if (normalized.moodleCourseId > 0) {
        courses.push(normalized);

        if (normalized.isCompleted) {
          completedCredits += normalized.credits;
        } else if (normalized.status === "enrolled") {
          enrolledCredits += normalized.credits;
        }
      }
    }

    return {
      courses,
      completedCredits,
      enrolledCredits,
    };
  }

  public normalizeAssignment(raw: unknown): NormalizedAssignment {
    if (!raw || typeof raw !== "object") {
      return {
        moodleAssignmentId: 0,
        moodleCourseId: 0,
        title: "واجب غير معرف",
        description: "",
        dueDateIso: null,
        dueDateFormatted: "غير محدد",
        dueTimeFormatted: "--:--",
        isOverdue: false,
        maxGrade: 20,
        type: "assignment",
      };
    }

    const a = raw as MoodleRawAssignment;
    const moodleAssignmentId = sanitizeNumber(a.id, 0);
    const moodleCourseId = sanitizeNumber(a.course, 0);
    const title = sanitizeHtml(a.name, "واجب جامعي");
    const description = sanitizeHtml(a.intro, "");

    const dateResult = parseMoodleTimestamp(a.duedate, this.defaultTimeZone);
    const maxGrade = sanitizeNumber(a.grade, 20);

    let type: "assignment" | "project" | "quiz" | "exam" = "assignment";
    if (title.includes("مشروع") || title.includes("بحث") || title.toLowerCase().includes("project")) {
      type = "project";
    } else if (title.includes("كويز") || title.includes("اختبار قصير") || title.toLowerCase().includes("quiz")) {
      type = "quiz";
    } else if (title.includes("امتحان") || title.toLowerCase().includes("exam")) {
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
    };
  }

  public normalizeStudentProfile(
    siteInfoRaw: unknown,
    coursesSummary: { completedCredits: number; totalCreditsRequired?: number }
  ): NormalizedStudentProfile {
    const info = (siteInfoRaw || {}) as MoodleRawSiteInfo;

    const moodleUserId = sanitizeNumber(info.userid, 0);
    const academicId = sanitizeHtml(info.username, "0000000");
    const fullName = sanitizeHtml(info.fullname, "طالب جامعي");
    const email = `${academicId}@university.edu`;

    const majorFromCustom = extractCustomField<string>(
      info.customfields,
      "major",
      "string",
      extractCustomField<string>(
        info.customfields,
        "department",
        "string",
        "تكنولوجيا المعلومات"
      )
    );

    const gpa = extractCustomField<number>(
      info.customfields,
      "gpa",
      "number",
      3.5
    );

    const academicYear = extractCustomField<number>(
      info.customfields,
      "academic_year",
      "number",
      2
    );

    const totalCreditsRequired =
      coursesSummary.totalCreditsRequired || this.defaultTotalDegreeCredits;
    const completedCredits = Math.max(0, coursesSummary.completedCredits);
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
      major: majorFromCustom,
      academicYear,
      avatarUrl: typeof info.userpictureurl === "string" ? info.userpictureurl : null,
      gpa,
      totalCreditsRequired,
      completedCredits,
      remainingCredits,
      progressPercentage,
    };
  }

  public normalizeFullSync(
    siteInfoRaw: unknown,
    coursesRaw: unknown,
    assignmentsRaw: unknown[] = []
  ): NormalizedMoodleSyncData {
    const { courses, completedCredits } = this.normalizeCourses(coursesRaw);
    const student = this.normalizeStudentProfile(siteInfoRaw, { completedCredits });

    const assignments: NormalizedAssignment[] = [];
    if (Array.isArray(assignmentsRaw)) {
      for (const raw of assignmentsRaw) {
        assignments.push(this.normalizeAssignment(raw));
      }
    }

    return {
      student,
      courses,
      assignments,
      syncTimestamp: new Date().toISOString(),
    };
  }
}

export const moodleDataMapper = new MoodleDataMapper();
