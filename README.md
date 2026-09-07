# مسار — نظام الطالب الرقمي

منصة PWA طلابية جامعية مبنية بجودة Linear/Notion. تعمل كنظام تشغيل رقمي لحياة الطالب الجامعية: الجدول، المواد، الواجبات، تقدّم التخرج، ولوحة التدريب.

---

## 🚀 تشغيل المشروع

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 🗂 بنية المشروع

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx        # تسجيل الدخول
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Shell (nav + sidebar)
│   │   ├── page.tsx              # الرئيسية
│   │   ├── courses/
│   │   │   ├── page.tsx          # قائمة المواد
│   │   │   └── [id]/page.tsx     # تفاصيل المادة
│   │   ├── degree/page.tsx       # تقدّم التخرج
│   │   ├── internships/page.tsx  # لوحة التدريب
│   │   ├── profile/page.tsx      # الملف الشخصي
│   │   └── settings/page.tsx     # الإعدادات
│   ├── layout.tsx                # Root layout (RTL + fonts + themes)
│   ├── manifest.ts               # PWA manifest
│   └── globals.css               # Design tokens
├── components/
│   ├── ui/                       # Design system components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   └── avatar.tsx
│   ├── layout/                   # Navigation shell
│   │   ├── navigation.tsx        # Sidebar + BottomNav
│   │   └── page-header.tsx       # Page header
│   ├── dashboard/                # Home page sections
│   │   ├── quick-stats.tsx
│   │   ├── today-schedule.tsx
│   │   ├── urgent-deadlines.tsx
│   │   └── degree-progress-card.tsx
│   └── providers/
│       └── theme-provider.tsx
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── mock-data.ts              # بيانات وهمية واقعية
│   └── utils.ts                  # Helper functions
└── public/
    ├── sw.js                     # Service Worker
    └── icons/                    # PWA icons
```

---

## 🎨 نظام التصميم

| العنصر | القيمة |
|--------|--------|
| اللون الأساسي | Indigo `#6366F1` |
| الخط | IBM Plex Sans Arabic |
| الأيقونات | Lucide React (outline) |
| الوضع الليلي | مدمج من اليوم الأول |
| الاتجاه | RTL (Arabic first) |

---

## 🔧 التقنيات

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: IBM Plex Sans Arabic (Google Fonts)
- **Themes**: next-themes
- **PWA**: manifest.ts + Service Worker

---

## 📱 الاستجابة

| الجهاز | التخطيط |
|--------|---------|
| هاتف (<1024px) | Bottom navigation |
| لابتوب (≥1024px) | Sidebar يمين (RTL) |

---

## 🔗 الصفحات

| المسار | الصفحة |
|--------|--------|
| `/` | الرئيسية — جدول اليوم والإحصائيات |
| `/courses` | قائمة المواد |
| `/courses/[id]` | تفاصيل المادة (واجبات، ملفات، درجات) |
| `/degree` | تقدّم التخرج |
| `/internships` | لوحة التدريب |
| `/profile` | الملف الشخصي |
| `/settings` | الإعدادات |
| `/login` | تسجيل الدخول |

---

## 🔄 استبدال البيانات الوهمية

كل البيانات في `src/lib/mock-data.ts`. عند جاهزية Moodle API، استبدل هذا الملف فقط — TypeScript interfaces في `src/lib/types.ts` تبقى كما هي.
