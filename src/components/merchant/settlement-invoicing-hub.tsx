"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Building2,
  Calendar,
  Percent,
  Check,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  ordersCount: number;
  grossVolume: number;
  commissionRate: number; // e.g. 0.05 (5%)
  commissionAmount: number;
  taxAmount: number; // 16% on commission
  netPayout: number;
  status: "due" | "paid";
  paidDate?: string;
  paymentRef?: string;
}

export function SettlementInvoicingHub() {
  const [filterStatus, setFilterStatus] = useState<"all" | "due" | "paid">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Financial Datasets
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2026-09B",
      period: "الدورة النصف شهرية الثانية (16 - 30 أيلول 2026)",
      startDate: "2026-09-16",
      endDate: "2026-09-30",
      ordersCount: 342,
      grossVolume: 1240.0,
      commissionRate: 0.05,
      commissionAmount: 62.0,
      taxAmount: 9.92,
      netPayout: 1168.08,
      status: "due",
    },
    {
      id: "INV-2026-09A",
      period: "الدورة النصف شهرية الأولى (1 - 15 أيلول 2026)",
      startDate: "2026-09-01",
      endDate: "2026-09-15",
      ordersCount: 480,
      grossVolume: 1890.5,
      commissionRate: 0.05,
      commissionAmount: 94.52,
      taxAmount: 15.12,
      netPayout: 1780.86,
      status: "paid",
      paidDate: "2026-09-18",
      paymentRef: "PAY-IBAN-889124",
    },
    {
      id: "INV-2026-08B",
      period: "الدورة النصف شهرية الثانية (16 - 31 آب 2026)",
      startDate: "2026-08-16",
      endDate: "2026-08-31",
      ordersCount: 510,
      grossVolume: 1980.0,
      commissionRate: 0.05,
      commissionAmount: 99.0,
      taxAmount: 15.84,
      netPayout: 1865.16,
      status: "paid",
      paidDate: "2026-09-02",
      paymentRef: "PAY-IBAN-883491",
    },
    {
      id: "INV-2026-08A",
      period: "الدورة النصف شهرية الأولى (1 - 15 آب 2026)",
      startDate: "2026-08-01",
      endDate: "2026-08-15",
      ordersCount: 390,
      grossVolume: 1450.0,
      commissionRate: 0.05,
      commissionAmount: 72.5,
      taxAmount: 11.6,
      netPayout: 1365.9,
      status: "paid",
      paidDate: "2026-08-18",
      paymentRef: "PAY-IBAN-874211",
    },
  ]);

  // Totals
  const totalGross = invoices.reduce((acc, curr) => acc + curr.grossVolume, 0);
  const totalCommission = invoices.reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const totalNet = totalGross - totalCommission;
  const totalOrders = invoices.reduce((acc, curr) => acc + curr.ordersCount, 0);

  const filteredInvoices =
    filterStatus === "all" ? invoices : invoices.filter((inv) => inv.status === filterStatus);

  const handleOpenInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handlePrintPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shadow-inner">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  مركز التسويات المالية والفواتير (Settlement & Invoicing Hub)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  Bi-weekly Automated
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                تتبع مبيعات الطلبة، اقتطاع عمولة المنصة (5%)، وتصدير الفواتير الضريبية المعتمدة بصيغة PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-background border border-border text-foreground/80 flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
              <span>التحويل البنكي المعتمد: IBAN ****7719</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Financial KPIs Ribbon (3 Main + 1 Supporting) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Volume */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              إجمالي مبيعات المنصة (Gross Volume)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-white">
                {totalGross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted-foreground font-medium">د.أ</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span>+28.4%</span>
              <span className="text-muted-foreground">مقارنة بالشهر السابق</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Platform Commission */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              عمولة المنصة المستحقة (5%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-amber-400">
                {totalCommission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted-foreground font-medium">د.أ</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              <span>نسبة ثابتة مقتطعة نصف شهرياً</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Net Merchant Yield */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              صافي العائد الإضافي للمتجر (Net Yield)
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-cyan-400">
                {totalNet.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted-foreground font-medium">د.أ</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-cyan-400">
              <span>بعد احتساب الخصم والعمولة</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Orders & Avg Basket */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              إجمالي الطلبات المنفذة
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-white">
                {totalOrders}
              </span>
              <span className="text-xs text-muted-foreground font-medium">طلب طلابي</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              <span>متوسط الفاتورة: {(totalGross / (totalOrders || 1)).toFixed(2)} د.أ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Tax & Commission Invoices Table */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Table Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>جدول كشوفات الحساب والفواتير الضريبية (Tax Invoices)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              تصدر الفواتير بشكل نصف شهري في اليومين 1 و 16 من كل شهر ميلادي.
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "all"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              الكل ({invoices.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("due")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "due"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              مستحقة ({invoices.filter((i) => i.status === "due").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("paid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "paid"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              مدفوعة ({invoices.filter((i) => i.status === "paid").length})
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="py-3 px-3">رقم الفاتورة</th>
                <th className="py-3 px-3">الدورة / الفترة الزمنية</th>
                <th className="py-3 px-3">عدد الطلبات</th>
                <th className="py-3 px-3">إجمالي المبيعات</th>
                <th className="py-3 px-3">عمولة مسار (5%)</th>
                <th className="py-3 px-3">صافي التحويل</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {inv.id}
                  </td>
                  <td className="py-3 px-3 text-foreground/80">
                    <span className="block font-medium">{inv.period}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {inv.startDate} إلى {inv.endDate}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-foreground/80">
                    {inv.ordersCount} طلب
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {inv.grossVolume.toFixed(2)} د.أ
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">
                    {inv.commissionAmount.toFixed(2)} د.أ
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {inv.netPayout.toFixed(2)} د.أ
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>مدفوعة</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                        <Clock className="h-3 w-3" />
                        <span>مستحقة للدفع</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenInvoice(inv)}
                      className="border-border hover:bg-emerald-500/10 hover:border-emerald-500/30 text-foreground text-xs gap-1.5 h-8 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                      <span>تصدير PDF</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Official Tax Invoice PDF Modal & Printable Preview */}
      {/* ========================================================================= */}
      {isInvoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Bar */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  معاينة الفاتورة الضريبية الرسمية ({selectedInvoice.id})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePrintPdf}
                  disabled={isDownloading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>طباعة أو حفظ PDF</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Official Invoice Body */}
            <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 bg-card text-foreground">
              {/* Top Invoice Header */}
              <div className="flex items-start justify-between pb-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">منصة مسار الأكاديمية والتجارية</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      فاتورة ضريبية رسمية
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    شركة مسار لتكنولوجيا التعليم والحلول الرقمية ذ.م.م
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    الرقم الضريبي: <span className="text-white font-bold">30048192-JO</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    شارع مكة، عمّان — المملكة الأردنية الهاشمية
                  </p>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs text-muted-foreground block">رقم الفاتورة:</span>
                  <span className="text-base font-bold text-emerald-400 block">{selectedInvoice.id}</span>
                  <span className="text-[10px] text-muted-foreground block mt-1">تاريخ الإصدار:</span>
                  <span className="text-xs text-white block">{selectedInvoice.startDate}</span>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-background border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">الجهة التجارية (العميل):</span>
                  <span className="font-bold text-white text-sm">مطعم شاورما الضيعة</span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">فرع الجامعة الأردنية</span>
                  <span className="text-[11px] font-mono text-muted-foreground">الرقم الضريبي للمتجر: 19827361</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-[10px] text-muted-foreground block">فترة التسوية:</span>
                  <span className="text-xs text-white block">{selectedInvoice.period}</span>
                  <span className="text-[10px] text-muted-foreground block mt-1">حالة السداد:</span>
                  <span className={`text-xs font-bold block ${selectedInvoice.status === "paid" ? "text-emerald-400" : "text-amber-400"}`}>
                    {selectedInvoice.status === "paid" ? "تم التحويل بنجاح" : "مستحقة التحويل البنكي"}
                  </span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2">الوصف والبيان</th>
                      <th className="py-2 text-center">الكمية</th>
                      <th className="py-2">المعدل</th>
                      <th className="py-2 text-left">المبلغ الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-3">
                        <span className="font-semibold text-white block">مبيعات كوبونات وعروض الطلبة المعتمدة</span>
                        <span className="text-[10px] text-muted-foreground">إجمالي الحركات المحققة عبر ماسح مسار في الفرع</span>
                      </td>
                      <td className="py-3 text-center font-mono">{selectedInvoice.ordersCount} طلب</td>
                      <td className="py-3 font-mono">-</td>
                      <td className="py-3 text-left font-mono font-bold text-white">
                        {selectedInvoice.grossVolume.toFixed(2)} د.أ
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <span className="font-semibold text-amber-300 block">عمولة منصة مسار (5%)</span>
                        <span className="text-[10px] text-muted-foreground">رسوم التسويق الترويجي والربط الإلكتروني للطلاب</span>
                      </td>
                      <td className="py-3 text-center font-mono">1</td>
                      <td className="py-3 font-mono">5.0%</td>
                      <td className="py-3 text-left font-mono font-bold text-amber-400">
                        -{selectedInvoice.commissionAmount.toFixed(2)} د.أ
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <span className="text-foreground/80 block">ضريبة المبيعات على العمولة (16% Sales Tax)</span>
                      </td>
                      <td className="py-3 text-center font-mono">-</td>
                      <td className="py-3 font-mono">16%</td>
                      <td className="py-3 text-left font-mono font-bold text-foreground/80">
                        {selectedInvoice.taxAmount.toFixed(2)} د.أ
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border font-bold">
                      <td colSpan={3} className="pt-4 text-white text-sm">صافي مستحقات التاجر المحولة (Net Payout):</td>
                      <td className="pt-4 text-left font-mono text-emerald-400 text-base">
                        {selectedInvoice.netPayout.toFixed(2)} د.أ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Digital Stamp & Verification Seal */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white p-1">
                    {/* Mini QR representation */}
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] font-mono text-white font-bold">
                      QR SEAL
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">الختم الضريبي الرقمي المعتمد</span>
                    <span className="text-[10px] text-muted-foreground font-mono">ZATCA/ISTD Standard XML Verified</span>
                  </div>
                </div>

                <div className="text-left font-mono text-[10px]">
                  <span>توقيع التدقيق المالي: MASAR-FIN-AUTO-CERT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
