export interface UniversityConstant {
  id: string;
  name: string;
  nameEn: string;
}

export const UNIVERSITIES: UniversityConstant[] = [
  { id: "aau", name: "جامعة عمان الأهلية", nameEn: "Al-Ahliyya Amman University" },
  { id: "ju", name: "الجامعة الأردنية", nameEn: "University of Jordan" },
  { id: "just", name: "جامعة العلوم والتكنولوجيا الأردنية", nameEn: "JUST" },
  { id: "mut", name: "جامعة آل البيت", nameEn: "Al al-Bayt University" },
  { id: "ahu", name: "جامعة الحسين التقنية", nameEn: "Hussein Technical University" },
  { id: "gju", name: "الجامعة الألمانية الأردنية", nameEn: "German Jordanian University" },
  { id: "yu", name: "جامعة اليرموك", nameEn: "Yarmouk University" },
  { id: "bau", name: "جامعة البلقاء التطبيقية", nameEn: "Al-Balqa Applied University" },
  { id: "pu", name: "جامعة البترا", nameEn: "University of Petra" },
];
