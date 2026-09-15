import { ReadinessClient } from "./readiness-client";

export const metadata = {
  title: "التدقيق المهني | مسار",
  description: "اكتشف جاهزيتك لسوق العمل عبر التدقيق الذكي",
};

export default function ReadinessPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      <ReadinessClient />
    </div>
  );
}