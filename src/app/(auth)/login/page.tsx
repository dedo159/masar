import Link from "next/link";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-4">
            <span className="text-primary-foreground text-xl font-medium">م</span>
          </div>
          <h1 className="text-2xl font-medium">مسار</h1>
          <p className="text-sm text-muted-foreground mt-1">
            نظام التشغيل الرقمي لحياتك الجامعية
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              اختر جامعتك
            </label>
            <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
              <option value="">ابحث عن جامعتك...</option>
              <option value="ju">الجامعة الأردنية</option>
              <option value="just">جامعة العلوم والتكنولوجيا الأردنية</option>
              <option value="yu">جامعة اليرموك</option>
              <option value="gju">الجامعة الألمانية الأردنية</option>
              <option value="bau">جامعة البلقاء التطبيقية</option>
              <option value="pu">جامعة البترا</option>
              <option value="ahu">جامعة الحسين التقنية</option>
              <option value="mut">جامعة آل البيت</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              اسم المستخدم (Moodle)
            </label>
            <input
              type="text"
              placeholder="أدخل اسم المستخدم"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              dir="ltr"
            />
          </div>

          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          >
            تسجيل الدخول
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            كلمة مرورك تُستخدم مرة واحدة فقط لتوليد رمز الدخول — لا تُخزَّن.
          </p>
        </div>
      </div>
    </div>
  );
}
