import { SponsoredCampusDrops } from "@/components/merchant/sponsored-campus-drops";

export const metadata = {
  title: "حملات الإشعارات والتنبيهات الموجهة للحرم (Sponsored Drops) | مسار للشركاء",
  description: "بث الإشعارات اللحظية لشاشات قفل هواتف الطلبة في محيط الفروع المشمولة بالعرض.",
};

export default function CampusDropsPage() {
  return <SponsoredCampusDrops />;
}
