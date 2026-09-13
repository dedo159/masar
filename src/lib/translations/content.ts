/**
 * Masar Platform — Unified Content Localization Helper
 * Provides seamless translation of database-stored and dynamic entities:
 * - Student names, majors, and universities
 * - Internship titles, companies, locations, and durations
 */

export const STUDENT_NAME_MAP: Record<string, string> = {
  "ضياء الدين محمد محمود عبدالرحمن": "Deyaa Al-Deen Mahmoud",
  "ضياء الدين محمد محمود": "Deyaa Al-Deen Mahmoud",
  "ضياء الدين": "Deyaa Al-Deen",
  "طارق زياد المجالي": "Tareq Ziad Al-Majali",
  "طالب مسار": "Masar Student",
  "محمد أحمد": "Mohammad Ahmad",
  "سارة القضاة": "Sarah Al-Qudah",
  "أحمد خليل": "Ahmad Khalil",
  "عمر المصري": "Omar Al-Masri",
  "رانيا حداد": "Rania Haddad",
  "ليث العبداللات": "Laith Al-Abdallat",
  "دانا شومان": "Dana Shoman",
  "زيد الكردي": "Zaid Al-Kurdi",
  "نور التميمي": "Noor Al-Tamimi",
  "حمزة الشريف": "Hamza Al-Sharif",
  "ريما النجار": "Rima Al-Najjar",
  "يوسف قاسم": "Youssef Qasim",
  "ميار العبادي": "Mayar Al-Abbadi",
  "فارس شاهين": "Faris Shaheen",
  "لجين الزعبي": "Lojain Al-Zoubi",
  "كريم عثمان": "Karim Othman",
  "تالا الخطيب": "Tala Al-Khatib",
  "عبدالله الصالح": "Abdullah Al-Saleh",
  "سندس بركات": "Sondos Barakat",
};

export const MAJOR_MAP: Record<string, string> = {
  "تكنولوجيا المعلومات": "Information Technology",
  "علم الحاسوب": "Computer Science",
  "هندسة البرمجيات": "Software Engineering",
  "الأمن السيبراني": "Cybersecurity",
  "أمن المعلومات": "Information Security",
  "الذكاء الاصطناعي": "Artificial Intelligence",
  "علم البيانات": "Data Science",
  "نظم المعلومات الحاسوبية": "Computer Information Systems",
  "هندسة الحاسوب": "Computer Engineering",
  "هندسة الشبكات": "Network Engineering",
  "تصميم الوسائط المتعددة": "Multimedia Design",
  "طالب بكالوريوس": "Undergraduate Student",
};

export const UNIVERSITY_MAP: Record<string, string> = {
  "جامعة عمان الأهلية": "Al Ahliyya Amman University",
  "الجامعة الأردنية": "University of Jordan",
  "جامعة العلوم والتكنولوجيا الأردنية": "Jordan University of Science and Technology",
  "جامعة اليرموك": "Yarmouk University",
  "الجامعة الهاشمية": "Hashemite University",
  "جامعة الأميرة سمية للتكنولوجيا": "Princess Sumaya University for Technology",
  "جامعة البلقاء التطبيقية": "Al-Balqa Applied University",
  "جامعة الشرق الأوسط": "Middle East University",
  "جامعة الزيتونة الأردنية": "Al-Zaytoonah University of Jordan",
  "جامعة البترا": "University of Petra",
  "جامعة إربد الأهلية": "Irbid National University",
  "جامعة جرش": "Jerash University",
  "جامعة مؤتة": "Mutah University",
  "جامعة فيلادلفيا": "Philadelphia University",
  "الجامعة الألمانية الأردنية": "German Jordanian University",
  "جامعة الحسين بن طلال": "Al-Hussein Bin Talal University",
  "جامعة الطفيلة التقنية": "Tafila Technical University",
  "جامعة آل البيت": "Al al-Bayt University",
  "جامعة الزرقاء": "Zarqa University",
  "جامعة العقبة للتكنولوجيا": "Aqaba University of Technology",
  "جامعة عمان العربية": "Amman Arab University",
  "جامعة الحسين التقنية": "Al Hussein Technical University",
};

export const INTERNSHIP_TITLE_MAP: Record<string, string> = {
  "متدرب — هندسة البرمجيات": "Software Engineering Intern",
  "متدرب — أمن المعلومات": "Information Security Intern",
  "متدرب — تكنولوجيا المعلومات": "IT Support and Systems Intern",
  "مساعد بحثي — تعلم الآلة": "Machine Learning Research Assistant",
  "متدرب — تطوير الواجهات الأمامية (React / Next.js)": "Frontend Developer Intern (React / Next.js)",
  "متدرب — تطوير الواجهات الخلفية (Node.js)": "Backend Developer Intern (Node.js)",
  "متدرب — تحليل البيانات (Python / SQL)": "Data Analyst Intern (Python / SQL)",
  "متدرب — تصميم واجهات وتجربة المستخدم (UI/UX)": "UI/UX Design Intern",
  "متدرب — إدارة المشاريع التقنية": "Technical Project Management Intern",
  "متدرب — ضمان الجودة وفحص البرمجيات (QA)": "QA and Software Testing Intern",
  "متدرب — هندسة الحوسبة السحابية (AWS / Azure)": "Cloud Engineering Intern (AWS / Azure)",
  "متدرب — إدارة الشبكات والدعم الفني": "Network Administration and Support Intern",
  "متدرب — الذكاء الاصطناعي ومعالجة اللغات (NLP)": "AI and NLP Engineering Intern",
  "متدرب تطوير واجهات": "Frontend Developer Intern",
  "متدرب أمن سيبراني": "Cybersecurity Intern",
  "متدرب علم بيانات": "Data Science Intern",
  "متدرب تسويق رقمي": "Digital Marketing Intern",
};

export const COMPANY_MAP: Record<string, string> = {
  "زين الأردن": "Zain Jordan",
  "أورنج الأردن": "Orange Jordan",
  "أمنية": "Umniah",
  "أريبيا تك": "ArabiaTech",
  "مختبر أبحاث الذكاء الاصطناعي — جامعة عمان الأهلية": "AI Research Lab — Al Ahliyya Amman University",
  "شركة التطوير التقني": "Tech Development Co.",
  "حلول البرمجيات المتقدمة": "Advanced Software Solutions",
  "بنك الإسكان": "Housing Bank",
  "البنك العربي": "Arab Bank",
  "بنك الاتحاد": "Bank al Etihad",
  "كريم": "Careem",
  "موضوع": "Mawdoo3",
  "طلبات": "Talabat",
  "أمازون الأردن": "Amazon Jordan",
  "مايكروسوفت الأردن": "Microsoft Jordan",
  "سيسكو الأردن": "Cisco Jordan",
  "أكاديمية الرواد": "Pioneers Academy",
  "جامعة عمان الأهلية": "Al Ahliyya Amman University",
};

export const LOCATION_MAP: Record<string, string> = {
  "عمان، الأردن": "Amman, Jordan",
  "عمان - مجمع الملك حسين للأعمال": "Amman - King Hussein Business Park",
  "عمان - الشميساني": "Amman - Shmeisani",
  "عمان - الدوار السابع": "Amman - 7th Circle",
  "عمان - خلدا": "Amman - Khalda",
  "إربد، الأردن": "Irbid, Jordan",
  "الزرقاء، الأردن": "Zarqa, Jordan",
  "عمان": "Amman",
  "حضوري": "On-site",
  "عن بُعد": "Remote",
  "هجين": "Hybrid",
};

export const DURATION_MAP: Record<string, string> = {
  "3 أشهر": "3 Months",
  "4 أشهر": "4 Months",
  "6 أشهر": "6 Months",
  "شهرين": "2 Months",
  "شهر واحد": "1 Month",
  "سنة واحدة": "1 Year",
  "فصل دراسي واحد": "One Semester",
};

export function translateStudentName(name?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!name) return "";
  if (lang === "ar") return name;

  const trimmed = name.trim();
  if (STUDENT_NAME_MAP[trimmed]) {
    return STUDENT_NAME_MAP[trimmed];
  }

  if (!/[؀-ۿ]/.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("طالب")) {
    return "Masar Student";
  }

  return trimmed;
}

export function getStudentInitials(name?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!name) return lang === "ar" ? "ط" : "S";

  if (lang === "en") {
    const enName = translateStudentName(name, "en");
    if (/^[A-Za-z]/.test(enName)) {
      const parts = enName.split(/s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return enName.slice(0, 2).toUpperCase();
    }
    return "S";
  }

  const trimmed = name.trim();
  return trimmed[0] || "ط";
}

export function translateMajor(major?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!major) return "";
  if (lang === "ar") return major;

  const trimmed = major.trim();
  if (MAJOR_MAP[trimmed]) {
    return MAJOR_MAP[trimmed];
  }

  for (const [ar, en] of Object.entries(MAJOR_MAP)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  if (!/[؀-ۿ]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export function translateUniversityName(
  univ?: { name?: string | null; nameEn?: string | null } | string | null,
  lang: "ar" | "en" = "ar"
): string {
  if (!univ) return "";

  if (typeof univ === "object") {
    if (lang === "en" && univ.nameEn && univ.nameEn.trim().length > 0 && !/[؀-ۿ]/.test(univ.nameEn)) {
      return univ.nameEn;
    }
    const nameToTranslate = univ.name || "";
    if (lang === "ar") return nameToTranslate;
    return UNIVERSITY_MAP[nameToTranslate.trim()] || nameToTranslate;
  }

  if (lang === "ar") return univ;
  return UNIVERSITY_MAP[univ.trim()] || univ;
}

export function translateInternshipTitle(title?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!title) return "";
  if (lang === "ar") return title;

  const trimmed = title.trim();
  if (INTERNSHIP_TITLE_MAP[trimmed]) {
    return INTERNSHIP_TITLE_MAP[trimmed];
  }

  for (const [ar, en] of Object.entries(INTERNSHIP_TITLE_MAP)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  if (!/[؀-ۿ]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export function translateInternshipCompany(company?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!company) return "";
  if (lang === "ar") return company;

  const trimmed = company.trim();
  if (COMPANY_MAP[trimmed]) {
    return COMPANY_MAP[trimmed];
  }

  for (const [ar, en] of Object.entries(COMPANY_MAP)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  return trimmed;
}

export function translateInternshipLocation(location?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!location) return "";
  if (lang === "ar") return location;

  const trimmed = location.trim();
  if (LOCATION_MAP[trimmed]) {
    return LOCATION_MAP[trimmed];
  }

  for (const [ar, en] of Object.entries(LOCATION_MAP)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  return trimmed;
}

export function translateInternshipDuration(duration?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!duration) return "";
  if (lang === "ar") return duration;

  const trimmed = duration.trim();
  if (DURATION_MAP[trimmed]) {
    return DURATION_MAP[trimmed];
  }

  for (const [ar, en] of Object.entries(DURATION_MAP)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  return trimmed;
}
