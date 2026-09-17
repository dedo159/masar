"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Users, Inbox, CheckCircle2, Clock, XCircle, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ApplicantsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [data, setData] = useState<{ internship: any; applications: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`/api/company/internships/${id}/applicants`);
        if (res.status === 401) {
          router.push("/company/login");
          return;
        }
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplicants();
  }, [id, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs font-semibold gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>مقبول</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs font-semibold gap-1">
            <XCircle className="h-3 w-3" />
            <span>مرفوض</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-xs font-semibold gap-1">
            <Clock className="h-3 w-3" />
            <span>قيد المراجعة</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/company/internships">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              المتقدمون لفرصة التدريب
            </h1>
            {data?.applications && (
              <Badge variant="secondary" className="text-xs">
                {data.applications.length} متقدم
              </Badge>
            )}
          </div>
          {data?.internship && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              <span>{data.internship.title}</span>
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm animate-pulse">
          جاري تحميل بيانات المتقدمين...
        </div>
      ) : !data || data.applications.length === 0 ? (
        <Card className="text-center py-16 px-4 border-dashed">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">لا يوجد متقدمون بعد</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            لم يقم أحد بالتقديم على هذه الفرصة حتى الآن. يمكنك مشاركة رابط الفرصة لزيادة المتقدمين.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-xs border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 rounded-r-lg">اسم الطالب</th>
                  <th className="px-5 py-3.5">الرقم الجامعي</th>
                  <th className="px-5 py-3.5">الجامعة</th>
                  <th className="px-5 py-3.5">التخصص</th>
                  <th className="px-5 py-3.5">تاريخ التقديم</th>
                  <th className="px-5 py-3.5 rounded-l-lg">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      {app.student.name}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono">
                      {app.student.studentId}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {app.student.university?.name || "الجامعة الأردنية"}
                    </td>
                    <td className="px-5 py-3.5 text-foreground font-medium">
                      {app.student.major}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString("ar-JO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
