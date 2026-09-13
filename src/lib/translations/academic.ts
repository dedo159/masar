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
  "إعلام وعلاقات عامة": "Media & Public Relations",
  "الاعلام والعلاقات العامة": "Media & Public Relations",
  "المهارات الحياتية": "Life Skills",
  "ثقافة قانونية وحقوق إنسان": "Legal Culture & Human Rights",
  "ثقافة قانونية وحقوق الإنسان": "Legal Culture & Human Rights",
  "مهارات الاتصال باللغة العربية": "Arabic Communication Skills",
  "مهارات الاتصال باللغة الانجليزية": "English Communication Skills",
  "ريادة الأعمال والابتكار": "Entrepreneurship & Innovation",
  "المسؤولية المجتمعية": "Social Responsibility",
  "التربية الوطنية": "National Education",
  "الأخلاق والقيم الإنسانية": "Ethics & Human Values",
};

export const INSTRUCTOR_TRANSLATIONS: Record<string, string> = {
  "أستاذ المادة": "Course Instructor",
  "مدرس المساق": "Course Instructor",
  "د. سامي الحموري": "Dr. Sami Al-Hammouri",
  "أ.د. سوسن بدرخان": "Prof. Sawsan Badrakhan",
  "د. محمد الشريف": "Dr. Mohammad Al-Sharif",
  "د. سلمى النابلسي": "Dr. Salma Al-Nabulsi",
  "أ.د. خالد الرواشدة": "Prof. Khaled Al-Rawashdeh",
  "د. رنا عبيدات": "Dr. Rana Obeidat",
  "د. عمر حسين": "Dr. Omar Hussein",
  "م. ليلى مرعي": "Eng. Layla Marie",
  "د. أحمد خليل": "Dr. Ahmad Khalil",
  "د. محمود حسان": "Dr. Mahmoud Hassan",
  "أ. ريم العلي": "Ms. Reem Al-Ali",
};

export const ASSIGNMENT_TITLE_TRANSLATIONS: Record<string, string> = {
  "تنفيذ شجرة AVL": "AVL Tree Implementation",
  "مشروع الفصل — محرك بحث بسيط": "Semester Project — Mini Search Engine",
  "تصميم قاعدة بيانات للمستشفى": "Hospital Database Schema Design",
  "تقرير بروتوكول TCP/IP": "TCP/IP Protocol Research Report",
  "مخطط UML للمشروع": "Project UML Architecture Diagram",
  "الواجب الاول الفصل الصيفي26/25": "Assignment 1 — Summer Semester 2025/2026",
  "الواجب الثاني الفصل الصيقي2025/2026": "Assignment 2 — Summer Semester 2025/2026",
  "تسليم البحث المطلوب من 26-7-2026 الى 20-8-2026": "Term Research Paper Submission (26/7 - 20/8/2026)",
  "الامتحان النهائي يوم الأربعاء 2-9-2026  شعبة (3)  من س 11:15- 12:00": "Final Exam — Wednesday 2/9/2026 (Sec 3, 11:15 - 12:00)",
  "الامتحان النهائي لمادة مهارات الاتصال باللغة العربية فصل صيفي 2026 جلسة رابعة شعبة 2": "Final Exam — Arabic Communication Skills (Sec 2, Session 4)",
  "امتحان المنتصف تكميلي لمادة مهارات الاتصال باللغة العربية الفصل الصيفي 23-8-2026": "Make-up Midterm Exam — Arabic Communication Skills (23/8/2026)",
  "امتحان المنتصف لمادة مهارات الاتصال باللغة العربية - شعبة (2) - الفصل الصيفي 15/8/2026": "Midterm Exam — Arabic Communication Skills (Sec 2, 15/8/2026)",
  "الاختبار القصير الثاني قصيدة المتنبي": "Quiz 2 — Al-Mutanabbi Poem",
  "(نسخة) الاختبار القصير الثاني قصيدة المتنبي": "Quiz 2 — Al-Mutanabbi Poem (Copy)",
  "الامتحان النهائي لمادة الاعلام والعلاقات العامة 5/9/2026": "Final Exam — Media & Public Relations (5/9/2026)",
  "الامتحان النصفي( تكميلي) لمادة الاعلام والعلاقات العامة 23/8/2026": "Make-up Midterm Exam — Media & Public Relations (23/8/2026)",
  "الاختبار القصير الثالث  قصيدة أبد الصّبار لمحمود درويش": "Quiz 3 — Mahmoud Darwish Poem",
  "الاختبار القصير الأول ( آيات من سورة القصص)": "Quiz 1 — Verses from Surat Al-Qasas",
  "(نسخة) الاختبار القصير الأول ( آيات من سورة القصص)": "Quiz 1 — Verses from Surat Al-Qasas (Copy)",
  "(نسخة) (نسخة) الاختبار القصير الأول ( آيات من سورة القصص)": "Quiz 1 — Verses from Surat Al-Qasas (Copy 2)",
  "الإعلام والعلاقات العامة (اختبار قصير)": "Quiz — Media & Public Relations",
  "البحث المطلوب لمادة الإعلام والعلاقات العامة": "Required Research Paper — Media & Public Relations",
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
  // Check known Arabic mappings first
  if (nameAr && AR_COURSE_NAME_TO_EN[nameAr.trim()]) {
    return AR_COURSE_NAME_TO_EN[nameAr.trim()];
  }

  if (code && COURSE_TRANSLATIONS[code.toUpperCase()]) {
    return COURSE_TRANSLATIONS[code.toUpperCase()].en;
  }

  // Check if nameEn is valid English text (and not just a code like A0110166-253-1)
  if (nameEn && nameEn.trim().length > 0 && !nameEn.match(/[\u0600-\u06FF]/)) {
    const isCode = /^[A-Z0-9_-]+$/i.test(nameEn.trim());
    if (!isCode) {
      return nameEn;
    }
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
    .replace("الفصل الدراسي الحالي", "Current Academic Semester")
    .replace("الفصل الصيفي26/25", "Summer Semester 2025/2026")
    .replace("الفصل الصيقي2025/2026", "Summer Semester 2025/2026")
    .replace("الفصل الصيفي 2025/2026", "Summer Semester 2025/2026")
    .replace("فصل صيفي 2026", "Summer Semester 2026")
    .replace("فصل صيفي", "Summer Semester")
    .replace("الفصل الصيفي", "Summer Semester")
    .replace("الفصل الأول", "First Semester")
    .replace("الفصل الاول", "First Semester")
    .replace("الفصل الثاني", "Second Semester");
}

/**
 * Translates room and hall locations
 */
export function translateRoom(room?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!room) return "";
  if (lang === "ar") return room;

  const trimmed = room.trim();
  if (trimmed.includes("قاعة افتراضية") || trimmed.includes("قاعة إلكترونية")) {
    const numMatch = trimmed.match(/\d+/);
    if (numMatch) {
      return `Virtual Classroom ${numMatch[0]} (V-Class)`;
    }
    return "Virtual Classroom (V-Class)";
  }

  return trimmed
    .replace("مختبر الحاسوب", "Computer Lab")
    .replace("مختبر", "Lab")
    .replace("قاعة", "Hall")
    .replace("مدرج", "Auditorium")
    .replace("مبنى", "Building");
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

  const trimmed = title.trim();
  if (ASSIGNMENT_TITLE_TRANSLATIONS[trimmed]) {
    return ASSIGNMENT_TITLE_TRANSLATIONS[trimmed];
  }

  let translated = trimmed;
  // Common prefixes & patterns
  translated = translated
    .replace("الامتحان النهائي", "Final Exam")
    .replace("امتحان المنتصف", "Midterm Exam")
    .replace("الامتحان النصفي", "Midterm Exam")
    .replace("الاختبار القصير الأول", "Quiz 1")
    .replace("الاختبار القصير الثاني", "Quiz 2")
    .replace("الاختبار القصير الثالث", "Quiz 3")
    .replace("اختبار قصير", "Quiz")
    .replace("الواجب الاول", "Assignment 1")
    .replace("الواجب الثاني", "Assignment 2")
    .replace("الواجب الثالث", "Assignment 3")
    .replace("تكميلي", "Make-up")
    .replace("تسليم البحث المطلوب", "Term Paper Submission")
    .replace("البحث المطلوب", "Required Research Paper")
    .replace("(نسخة)", "(Copy)")
    .replace("شعبة", "Section")
    .replace("جلسة", "Session")
    .replace("الفصل الصيفي", "Summer Semester")
    .replace("فصل صيفي", "Summer Semester");

  return translated;
}

/**
 * Translates assignment descriptions
 */
export function translateAssignmentDescription(desc?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!desc) return "";
  if (lang === "ar") return desc;

  const trimmed = desc.trim();

  // If description matches an assignment title
  if (ASSIGNMENT_TITLE_TRANSLATIONS[trimmed]) {
    return ASSIGNMENT_TITLE_TRANSLATIONS[trimmed];
  }

  if (trimmed.includes("الفرق بين القانون") && trimmed.includes("الدستور")) {
    return "Each student is required to submit a 1-2 page worksheet explaining the difference between Law and the Constitution.";
  }

  if (trimmed.includes("خصائص حقوق الانسان") || trimmed.includes("خصائص حقوق الإنسان")) {
    return "List the key characteristics and principles of Human Rights.";
  }

  if (trimmed.includes("المهارات الحياتية") && trimmed.includes("اعداد بحث")) {
    return "Important announcement for Life Skills students (Summer Semester 2025/2026):\nPlease prepare a research paper on one of the course topics (minimum 10 pages). Submission deadline is between 26/7/2026 and 20/8/2026 via V-Class. Please ensure student name, ID, section, and instructor name appear on the cover page.\nProf. Sawsan Badrakhan";
  }

  if (trimmed.includes("الإعلام والعلاقات العامة") && trimmed.includes("إعداد بحث")) {
    return "Dear students, please prepare a term paper covering one of the fields of Media & Public Relations according to the guidelines:\n- Address modern technology and social media impacts.\n- Discuss the role of AI in advancing effective media and PR workflows.\n- 10 to 15 pages in length using credible academic references.\n- Format properly: Title, Introduction, Content, Conclusion, References.\nSubmit electronically via V-Class by 30/8/2026.\nBest wishes.";
  }

  // If it is just a copy of the title pattern
  return translateAssignmentTitle(trimmed, "en");
}
