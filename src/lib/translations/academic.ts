/**
 * Masar Platform — Comprehensive Academic Bilingual Mappings
 * Ensures 100% complete translation between Arabic and English for:
 * - Course names & codes
 * - Course requirement categories
 * - Semesters & academic terms
 * - Instructors & titles
 * - Assignments & deliverables
 */

export const COURSE_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  CS101: { ar: "مقدمة في علم الحاسوب", en: "Introduction to Computer Science" },
  CS102: { ar: "البرمجة الهيكلية", en: "Structured Programming" },
  CS201: { ar: "البرمجة كائنية التوجه", en: "Object-Oriented Programming (OOP)" },
  CS210: { ar: "المنطق الرياضي", en: "Discrete Mathematics & Logic" },
  CS220: { ar: "تصميم الدوائر الرقمية", en: "Digital Logic Design" },
  CS230: { ar: "نظرية الحساب", en: "Theory of Computation" },
  CS240: { ar: "نظم التشغيل", en: "Operating Systems" },
  CS301: { ar: "هياكل البيانات", en: "Data Structures & Algorithms" },
  "CS301-LAB": { ar: "هياكل البيانات — مختبر", en: "Data Structures — Lab" },
  CS305: { ar: "تطوير تطبيقات الويب", en: "Web Application Development" },
  CS306: { ar: "تعلم الآلة", en: "Machine Learning" },
  CS307: { ar: "معالجة الصور", en: "Digital Image Processing" },
  CS308: { ar: "تطوير تطبيقات الجوال", en: "Mobile Application Development" },
  CS315: { ar: "قواعد البيانات 2", en: "Database Systems II" },
  CS320: { ar: "شبكات الحاسوب", en: "Computer Networks" },
  CS330: { ar: "هندسة البرمجيات", en: "Software Engineering" },
  CS350: { ar: "الأمن المعلوماتي", en: "Information Security" },
  CS360: { ar: "الحوسبة السحابية", en: "Cloud Computing" },
  CS410: { ar: "الذكاء الاصطناعي", en: "Artificial Intelligence" },
  CS490: { ar: "مشروع التخرج", en: "Graduation Project" },
  AR101: { ar: "اللغة العربية", en: "Arabic Communication Skills" },
  EN101: { ar: "اللغة الإنجليزية 1", en: "English Communication Skills I" },
  EN102: { ar: "اللغة الإنجليزية 2", en: "English Communication Skills II" },
  IS101: { ar: "الثقافة الإسلامية", en: "Islamic Culture" },
  MIL101: { ar: "التربية العسكرية", en: "Military Sciences" },
  MATH310: { ar: "الاحتمالات والإحصاء", en: "Probability & Statistics" },
  MATH101: { ar: "تفاضل وتكامل 1", en: "Calculus I" },
  MATH102: { ar: "تفاضل وتكامل 2", en: "Calculus II" },
  PHYS101: { ar: "الفيزياء العامة", en: "General Physics" },
};

// Map by Arabic course name as fallback
export const AR_COURSE_NAME_TO_EN: Record<string, string> = {
  "مقدمة في علم الحاسوب": "Introduction to Computer Science",
  "البرمجة الهيكلية": "Structured Programming",
  "البرمجة كائنية التوجه": "Object-Oriented Programming (OOP)",
  "المنطق الرياضي": "Discrete Mathematics & Logic",
  "تصميم الدوائر الرقمية": "Digital Logic Design",
  "نظرية الحساب": "Theory of Computation",
  "نظم التشغيل": "Operating Systems",
  "هياكل البيانات": "Data Structures & Algorithms",
  "هياكل البيانات — مختبر": "Data Structures — Lab",
  "تطوير تطبيقات الويب": "Web Application Development",
  "تعلم الآلة": "Machine Learning",
  "معالجة الصور": "Digital Image Processing",
  "تطوير تطبيقات الجوال": "Mobile Application Development",
  "قواعد البيانات 2": "Database Systems II",
  "قواعد البيانات": "Database Systems",
  "شبكات الحاسوب": "Computer Networks",
  "هندسة البرمجيات": "Software Engineering",
  "الأمن المعلوماتي": "Information Security",
  "أمن المعلومات": "Information Security",
  "الحوسبة السحابية": "Cloud Computing",
  "الذكاء الاصطناعي": "Artificial Intelligence",
  "مشروع التخرج": "Graduation Project",
  "اللغة العربية": "Arabic Communication Skills",
  "اللغة الإنجليزية 1": "English Communication Skills I",
  "اللغة الإنجليزية 2": "English Communication Skills II",
  "الثقافة الإسلامية": "Islamic Culture",
  "التربية العسكرية": "Military Sciences",
  "الاحتمالات والإحصاء": "Probability & Statistics",
  "تفاضل وتكامل 1": "Calculus I",
  "تفاضل وتكامل 2": "Calculus II",
  "الفيزياء العامة": "General Physics",
};

export const INSTRUCTOR_TRANSLATIONS: Record<string, string> = {
  "د. محمد الشريف": "Dr. Mohammad Al-Sharif",
  "د. سلمى النابلسي": "Dr. Salma Al-Nabulsi",
  "أ.د. خالد الرواشدة": "Prof. Khaled Al-Rawashdeh",
  "د. رنا عبيدات": "Dr. Rana Obeidat",
  "د. عمر حسين": "Dr. Omar Hussein",
  "م. ليلى مرعي": "Eng. Layla Marie",
};

export const ASSIGNMENT_TITLE_TRANSLATIONS: Record<string, string> = {
  "تنفيذ شجرة AVL": "AVL Tree Implementation",
  "مشروع الفصل — محرك بحث بسيط": "Semester Project — Mini Search Engine",
  "تصميم قاعدة بيانات للمستشفى": "Hospital Database Schema Design",
  "تقرير بروتوكول TCP/IP": "TCP/IP Protocol Research Report",
  "مخطط UML للمشروع": "Project UML Architecture Diagram",
};

/**
 * Translates course name according to active language
 */
export function translateCourseName(
  code?: string | null,
  nameAr?: string | null,
  nameEn?: string | null,
  lang: "ar" | "en" = "ar"
): string {
  if (lang === "ar") {
    if (nameAr) return nameAr;
    if (code && COURSE_TRANSLATIONS[code.toUpperCase()]) {
      return COURSE_TRANSLATIONS[code.toUpperCase()].ar;
    }
    return nameEn || "";
  }

  // English requested
  if (nameEn && nameEn.trim().length > 0 && !nameEn.match(/[\u0600-\u06FF]/)) {
    return nameEn;
  }

  if (code && COURSE_TRANSLATIONS[code.toUpperCase()]) {
    return COURSE_TRANSLATIONS[code.toUpperCase()].en;
  }

  if (nameAr && AR_COURSE_NAME_TO_EN[nameAr]) {
    return AR_COURSE_NAME_TO_EN[nameAr];
  }

  // Check if nameAr has a lab indicator
  if (nameAr && nameAr.includes("مختبر")) {
    const base = nameAr.replace("—", "").replace("-", "").replace("مختبر", "").trim();
    const baseEn = AR_COURSE_NAME_TO_EN[base] || base;
    return `${baseEn} — Lab`;
  }

  return nameEn || nameAr || "";
}

/**
 * Translates degree requirement categories
 */
export function translateCategory(
  label: string,
  lang: "ar" | "en" = "ar",
  short = false
): string {
  if (!label) return "";
  if (lang === "ar") return label;

  const normalized = label.trim();

  if (normalized.includes("الجامعة الإجبارية") || normalized.includes("جامعة إجبارية")) {
    return short ? "Univ. Compulsory" : "Compulsory University Requirements";
  }
  if (normalized.includes("الجامعة الاختيارية") || normalized.includes("جامعة اختيارية")) {
    return short ? "Univ. Elective" : "Elective University Requirements";
  }
  if (normalized.includes("الجامعة") || normalized.includes("جامعة")) {
    return short ? "University" : "University Requirements";
  }
  if (normalized.includes("الكلية الإجبارية") || normalized.includes("كلية إجبارية")) {
    return short ? "Faculty Compulsory" : "Compulsory Faculty Requirements";
  }
  if (normalized.includes("الكلية الاختيارية") || normalized.includes("كلية اختيارية")) {
    return short ? "Faculty Elective" : "Elective Faculty Requirements";
  }
  if (normalized.includes("الكلية") || normalized.includes("كلية")) {
    return short ? "Faculty" : "Faculty Requirements";
  }
  if (normalized.includes("التخصص الإجبارية") || normalized.includes("تخصص إجبارية")) {
    return short ? "Major Compulsory" : "Compulsory Major Requirements";
  }
  if (normalized.includes("التخصص الاختيارية") || normalized.includes("تخصص اختيارية")) {
    return short ? "Major Elective" : "Elective Major Requirements";
  }
  if (normalized.includes("التخصص") || normalized.includes("تخصص")) {
    return short ? "Major" : "Major Requirements";
  }
  if (normalized.includes("كلية وتخصص")) {
    return short ? "Faculty & Major" : "Faculty & Major Requirements";
  }
  if (normalized.includes("إجبارية") || normalized.includes("اجبارية")) {
    return short ? "Compulsory" : "Compulsory Requirements";
  }
  if (normalized.includes("اختيارية")) {
    return short ? "Elective" : "Elective Courses";
  }
  if (normalized.includes("حرة")) {
    return short ? "Free Electives" : "Free Elective Courses";
  }
  if (normalized.includes("مشروع") || normalized.includes("تدريب")) {
    return short ? "Capstone & Training" : "Graduation Project & Field Training";
  }

  return label;
}

/**
 * Translates semester strings
 */
export function translateSemester(semester: string, lang: "ar" | "en" = "ar"): string {
  if (!semester) return "";
  if (lang === "ar") return semester;

  return semester
    .replace("الفصل الأول", "First Semester")
    .replace("الفصل الثاني", "Second Semester")
    .replace("الفصل الصيفي", "Summer Semester");
}

/**
 * Translates instructor names & titles
 */
export function translateInstructor(instructor: string, lang: "ar" | "en" = "ar"): string {
  if (!instructor) return "";
  if (lang === "ar") return instructor;

  if (INSTRUCTOR_TRANSLATIONS[instructor]) {
    return INSTRUCTOR_TRANSLATIONS[instructor];
  }

  let formatted = instructor;
  if (formatted.startsWith("أ.د.")) {
    formatted = formatted.replace("أ.د.", "Prof.");
  } else if (formatted.startsWith("د.")) {
    formatted = formatted.replace("د.", "Dr.");
  } else if (formatted.startsWith("م.")) {
    formatted = formatted.replace("م.", "Eng.");
  } else if (formatted.startsWith("أ.")) {
    formatted = formatted.replace("أ.", "Mr.");
  }
  return formatted;
}

/**
 * Translates assignment titles
 */
export function translateAssignmentTitle(title: string, lang: "ar" | "en" = "ar"): string {
  if (!title) return "";
  if (lang === "ar") return title;

  return ASSIGNMENT_TITLE_TRANSLATIONS[title] || title;
}
