import { SponsoredCampusDrops } from "@/components/merchant/sponsored-campus-drops";

export const metadata = {
  title: "حملات الإشعارات والتنبيهات الموجهة للحرم (Sponsored Drops) | مسار للشركاء",
  description: "بث الإشعارات اللحظية لشاشات قفل هواتف الطلبة داخل الحرم الجامعي بالاستهداف الجغرافي.",
};

export default function CampusDropsPage() {
  return <SponsoredCampusDrops />;
}
