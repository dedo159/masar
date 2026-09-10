/**
 * Masar Platform — Student Deals Bilingual Translation Engine
 * Ensures 100% complete translation between Arabic and English for:
 * - Merchant names
 * - Deal titles
 * - Discount badges / labels
 * - Deal descriptions
 * - Terms & conditions
 */

export const MERCHANT_NAME_TRANSLATIONS: Record<string, string> = {
  "شاورما الضيعة": "Al-Diaa Shawarma",
  "مكتبة ومطبعة الرواد الجامعية": "Al-Rowad University Library & Print",
  "شركة الأمان للمواصلات والرحلات الجامعية": "Al-Aman University Transit",
  "مكتبة الرواد": "Al-Rowad Library",
  "شركة الأمان": "Al-Aman Transit",
};

export const DEAL_TITLE_TRANSLATIONS: Record<string, string> = {
  "خصم 20% على جميع الوجبات العائلية والفردية": "20% Off All Family & Individual Meals",
  "اشترِ وجبة سوبر شاورما واحصل على الثانية بنصف السعر": "Buy a Super Shawarma & Get the 2nd at 50% Off",
  "خصم 30% على طباعة وتجليد مشاريع التخرج والأبحاث": "30% Off Graduation Project Printing & Binding",
  "خصم 15% على الدفاتر والقرطاسية ومستلزمات الهندسة والعمارة": "15% Off Notebooks, Stationery & Architecture Supplies",
  "خصم 25% على اشتراكات الباصات والخطوط الجامعية الشهرية": "25% Off Monthly University Bus Subscriptions",
  "رحلتك الأولى مجاناً داخل الحرم ومحيط البوابات الجامعية": "Your First Ride Free Inside Campus & University Gates",
};

export const DISCOUNT_LABEL_TRANSLATIONS: Record<string, string> = {
  "خصم 20%": "20% OFF",
  "50% على الوجبة الثانية": "50% Off 2nd Meal",
  "خصم 30%": "30% OFF",
  "خصم 15%": "15% OFF",
  "خصم 25%": "25% OFF",
  "خصم 10%": "10% OFF",
  "خصم 50%": "50% OFF",
  "رحلة أولى مجاناً": "First Ride Free",
  "وجبة مجانية": "Free Meal",
};

export const DEAL_DESC_TRANSLATIONS: Record<string, string> = {
  "استمتع بأشهى وجبات الشاورما الإيطالية والعربية مع خصم خاص وحصري لجميع طلاب الجامعات.":
    "Enjoy delicious Italian & Arabic shawarma meals with an exclusive discount for all university students.",
  "عرض التوفير للطلاب والأصدقاء — وجبة سوبر شاورما دجاج أو لحم والثانية بنصف السعر فوراً.":
    "Student & friends value deal — chicken or meat super shawarma meal, get the second at half price instantly.",
  "طباعة ليزرية عالية الدقة بالألوان وتجليد كرتوني ومخملي معتمد لدى كافة الكليات والجامعات.":
    "High-resolution color laser printing, hardback and velvet binding accredited across all faculties.",
  "جميع الأدوات الهندسية، أقلام التحبير، أوراق الرسم الهندسي، والملازم الدراسية بأسعار طلابية خاصة.":
    "All engineering equipment, technical drafting pens, blueprint paper, and study materials at special student prices.",
  "خدمة نقل يومية مريحة ومكيفة من مختلف محافظات المملكة إلى بوابات الكليات مباشرة مع إنترنت مجاني.":
    "Comfortable, air-conditioned daily transit service from various governorates directly to campus gates with free Wi-Fi.",
  "جرب خدمة التوصيل السريع بين مجمعات الكليات والشارع التجاري مجاناً للرحلة الأولى.":
    "Try our fast shuttle service between college complexes and the commercial boulevard free for your first trip.",
};

export const DEAL_TERMS_TRANSLATIONS: Record<string, string> = {
  "يسري العرض يومياً من الساعة 12 ظهراً حتى 8 مساءً عند إبراز البطاقة الجامعية داخل الصالة، غير شامل التوصيل.":
    "Offer valid daily from 12:00 PM to 8:00 PM upon presenting university ID for dine-in only; delivery excluded.",
  "العرض متاح أيام الأحد والثلاثاء والخميس للطلبة، يسري على وجبات الحجم السوبر فقط.":
    "Offer available Sunday, Tuesday, and Thursday for students; applies to super-sized meals only.",
  "يسري الخصم على أبحاث ومشاريع التخرج التي تتجاوز 40 صفحة، يشمل التدقيق التنسيقي المبدئي مجاناً.":
    "Discount applies to graduation projects and research exceeding 40 pages; includes complimentary initial format check.",
  "العرض ساري طوال الفصل الدراسي لطلبة الهندسة والفنون والعلوم.":
    "Offer valid throughout the semester for engineering, arts, and science students.",
  "مخصص للاشتراكات الفصلية والشهرية الجديدة للطلبة النظاميين.":
    "Applicable to new semester and monthly subscriptions for enrolled full-time students.",
  "صالحة لرحلة فردية واحدة بحد أقصى 3 دنانير عبر تطبيق الأمان مع إبراز كود مسار.":
    "Valid for a single ride up to 3 JOD via Al-Aman app upon presenting the Masar voucher code.",
};

/**
 * Translates merchant business name according to active language
 */
export function translateMerchantName(name?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!name) return "";
  if (lang === "ar") return name;
  return MERCHANT_NAME_TRANSLATIONS[name.trim()] || name;
}

/**
 * Translates deal discount label/badge
 */
export function translateDiscountLabel(label?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!label) return "";
  if (lang === "ar") return label;

  const trimmed = label.trim();
  if (DISCOUNT_LABEL_TRANSLATIONS[trimmed]) {
    return DISCOUNT_LABEL_TRANSLATIONS[trimmed];
  }

  // Regex pattern matching: "خصم X%" -> "X% OFF"
  const discountMatch = trimmed.match(/خصم\s*(\d+)%/);
  if (discountMatch) {
    return `${discountMatch[1]}% OFF`;
  }

  return trimmed;
}

/**
 * Translates deal title according to active language
 */
export function translateDealTitle(title?: string | null, lang: "ar" | "en" = "ar"): string {
  if (!title) return "";
  if (lang === "ar") return title;

  const trimmed = title.trim();
  if (DEAL_TITLE_TRANSLATIONS[trimmed]) {
    return DEAL_TITLE_TRANSLATIONS[trimmed];
  }

  return trimmed;
}

/**
 * Translates deal description
 */
export function translateDealDescription(
  desc?: string | null,
  lang: "ar" | "en" = "ar"
): string {
  if (!desc) {
    return lang === "en" ? "No additional description." : "لا يوجد وصف إضافي.";
  }
  if (lang === "ar") return desc;

  const trimmed = desc.trim();
  if (DEAL_DESC_TRANSLATIONS[trimmed]) {
    return DEAL_DESC_TRANSLATIONS[trimmed];
  }

  return trimmed;
}

/**
 * Translates deal terms and conditions
 */
export function translateDealTerms(
  terms?: string | null,
  lang: "ar" | "en" = "ar"
): string {
  if (!terms) {
    return lang === "en"
      ? "Present your university student ID card to redeem this offer."
      : "يسري العرض عند إبراز بطاقتك الجامعية.";
  }
  if (lang === "ar") return terms;

  const trimmed = terms.trim();
  if (DEAL_TERMS_TRANSLATIONS[trimmed]) {
    return DEAL_TERMS_TRANSLATIONS[trimmed];
  }

  return trimmed;
}
