"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink, Sparkles, Briefcase, Calendar, Building2 } from "lucide-react";
import { ApplyButton } from "./apply-button";
import { useLanguage } from "@/components/providers/language-provider";
import {
  translateInternshipTitle,
  translateInternshipCompany,
  translateInternshipLocation,
  translateInternshipDuration,
} from "@/lib/translations/content";
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

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-dashed border-border bg-muted/50 text-center transition-colors">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4 shadow-sm text-foreground">
              <Briefcase className="h-6 w-6 text-foreground" strokeWidth={1.5} />
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
                  className="rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-5 shadow-sm dark:shadow-xl backdrop-blur-2xl flex flex-col justify-between gap-4 group hover:border-[#2F7BFF]/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F7BFF]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top info */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00D2FF]/20 to-[#2F7BFF]/20 border border-[#2F7BFF]/30 flex items-center justify-center text-[#2F7BFF] dark:text-[#38BDF8] flex-shrink-0 font-bold text-sm shadow-[0_0_15px_rgba(47,123,255,0.25)]">
                          <Building2 className="h-5 w-5" strokeWidth={1.75} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground truncate">
                              {translateInternshipCompany(internship.company, language)}
                            </span>
                            {internship.isNew && (
                              <span className="inline-flex items-center text-[10px] px-2 py-0.5 gap-1 font-semibold rounded-full bg-[#E83D84]/15 text-[#E83D84] border border-[#E83D84]/30 shadow-xs">
                                <Sparkles className="h-2.5 w-2.5" />
                                {t.internships.newBadge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-foreground group-hover:text-[#2F7BFF] dark:group-hover:text-[#38BDF8] mt-1 truncate transition-colors">
                            {translateInternshipTitle(internship.title, language)}
                          </h3>
                        </div>
                      </div>

                      <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted/60 dark:bg-white/[0.06] border border-border dark:border-white/10 text-foreground dark:text-white/80">
                        {typeText}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#2F7BFF] dark:text-[#38BDF8]" />
                        <span>{translateInternshipLocation(internship.location, language)}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{translateInternshipDuration(internship.duration, language)}</span>
                      </span>
                      {internship.deadline && (
                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{t.internships.deadline}: {internship.deadline}</span>
                        </span>
                      )}
                    </div>

                    {/* Skills/Tags */}
                    {internship.tags && internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/60 dark:border-white/[0.08]">
                        {internship.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.08] text-muted-foreground"
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
