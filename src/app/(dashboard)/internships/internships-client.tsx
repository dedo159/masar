"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink, Sparkles, Briefcase, Calendar, Building2 } from "lucide-react";
import { ApplyButton } from "./apply-button";
import { useLanguage } from "@/components/providers/language-provider";
import type { Internship } from "@/lib/types";

const typeVariant: Record<string, "default" | "success" | "secondary" | "warning"> = {
  remote: "success",
  onsite: "secondary",
  hybrid: "default",
};

interface InternshipsClientProps {
  internships: Internship[];
  appliedInternshipIds: string[];
}

export function InternshipsClient({ internships, appliedInternshipIds }: InternshipsClientProps) {
  const { t, language } = useLanguage();
  const appliedSet = new Set(appliedInternshipIds);
  const newCount = internships.filter((i) => i.isNew).length;

  const subtitleText = language === "en"
    ? `${internships.length} approved opportunities · ${newCount} new listings`
    : `${internships.length} فرصة معتمدة · ${newCount} فرص جديدة`;

  return (
    <>
      <PageHeader
        title={t.internships.title}
        subtitle={subtitleText}
      />

      <div className="px-4 py-5 space-y-5 max-w-5xl mx-auto">
        {internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3 text-foreground">
              <Briefcase className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{t.internships.emptyTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {t.internships.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((internship) => {
              const hasValidLink =
                internship.applyUrl &&
                internship.applyUrl !== "#" &&
                (internship.applyUrl.startsWith("http://") || internship.applyUrl.startsWith("https://"));
              const isApplied = appliedSet.has(internship.id);
              const typeText = t.internships.types[internship.type] || internship.type;

              return (
                <div
                  key={internship.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20"
                >
                  {/* Top info */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0 font-bold text-sm">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground truncate">
                              {internship.company}
                            </span>
                            {internship.isNew && (
                              <Badge variant="default" className="text-[10px] px-1.5 py-0 gap-0.5 font-bold">
                                <Sparkles className="h-2.5 w-2.5" />
                                {t.internships.newBadge}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-foreground mt-0.5 truncate">
                            {internship.title}
                          </h3>
                        </div>
                      </div>

                      <Badge variant={typeVariant[internship.type] || "secondary"} className="flex-shrink-0 text-xs">
                        {typeText}
                      </Badge>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{internship.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{internship.duration}</span>
                      </span>
                      {internship.deadline && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{t.internships.deadline}: {internship.deadline}</span>
                        </span>
                      )}
                    </div>

                    {/* Skills/Tags */}
                    {internship.tags && internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                        {internship.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action row (Touch targets >= 44px) */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                    {hasValidLink ? (
                      <a
                        href={internship.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-2"
                      >
                        <span>{t.internships.externalApply}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Direct Application via Masar" : "التقديم مباشر عبر مسار"}
                      </span>
                    )}

                    <ApplyButton
                      internshipId={internship.id}
                      initialApplied={isApplied}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
