import { getInternships } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink, Sparkles, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export const revalidate = 60;

const typeLabel: Record<string, string> = {
  remote: "عن بُعد",
  onsite: "حضوري",
  hybrid: "هجين",
};

const typeVariant: Record<string, "default" | "success" | "secondary"> = {
  remote: "success",
  onsite: "secondary",
  hybrid: "default",
};

export default async function InternshipsPage() {
  let internships = [];
  try {
    internships = await getInternships();
  } catch (error) {
    console.error("InternshipsPage fetch error:", error);
    return (
      <>
        <PageHeader title="لوحة التدريب" subtitle="خطأ في الاتصال" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر تحميل فرص التدريب من قاعدة البيانات." />
        </div>
      </>
    );
  }

  const newCount = internships.filter((i) => i.isNew).length;

  return (
    <>
      <PageHeader
        title="لوحة التدريب"
        subtitle={`${internships.length} فرصة متاحة · ${newCount} جديدة`}
      />
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto lg:max-w-none">
        {internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50 text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">لا توجد فرص تدريب معلنة حالياً</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              يتم تحديث قائمة الفرص التدريبية بالتنسيق مع الشركات الشريكة بشكل مستمر.
            </p>
          </div>
        ) : (
          internships.map((internship) => {
            const hasValidLink = internship.applyUrl && internship.applyUrl !== "#";

            return (
              <div
                key={internship.id}
                className="rounded-xl border border-border bg-card p-4 hover:border-border/80 transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{internship.company}</p>
                      {internship.isNew && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                          <Sparkles className="h-2.5 w-2.5" />
                          جديد
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium mt-1 truncate">{internship.title}</p>

                    <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {internship.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {internship.duration}
                      </span>
                      <Badge variant={typeVariant[internship.type]}>
                        {typeLabel[internship.type]}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {internship.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  {internship.deadline ? (
                    <span className="text-xs text-muted-foreground">
                      آخر موعد: {new Date(internship.deadline).toLocaleDateString("ar-JO", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">التقديم مفتوح</span>
                  )}

                  {hasValidLink ? (
                    <Button size="sm" asChild>
                      <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                        تقدّم الآن
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="text-xs opacity-50 cursor-not-allowed">
                      التقديم غير متاح
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
