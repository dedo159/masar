import { DynamicRollingQrGuard } from "@/components/merchant/dynamic-rolling-qr-guard";

export const metadata = {
  title: "نظام مكافحة الاحتيال والباركود المتغير | مسار للشركاء",
  description: "التحقق الأمني من الرموز الديناميكية المتغيرة كل 30 ثانية وحماية لقطات الشاشة وتقييد معدل الاستخدام.",
};

export default function AntiFraudPage() {
  return <DynamicRollingQrGuard />;
}
