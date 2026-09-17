import { SettlementInvoicingHub } from "@/components/merchant/settlement-invoicing-hub";

export const metadata = {
  title: "مركز التسويات المالية والفواتير | مسار للشركاء",
  description: "كشوفات الحساب والفواتير الضريبية نصف الشهرية وعمولات المنصة وتصدير PDF.",
};

export default function SettlementsPage() {
  return <SettlementInvoicingHub />;
}
