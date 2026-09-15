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
    ? `${internships.length} approved opportunities ط¢آ· ${newCount} new listings`
    : `${internships.length} ط¸ظ¾ط·آ±ط·آµط·آ© ط¸â€¦ط·آ¹ط·ع¾ط¸â€¦ط·آ¯ط·آ© ط¢آ· ${newCount} ط¸ظ¾ط·آ±ط·آµ ط·آ¬ط·آ¯ط¸ظ¹ط·آ¯ط·آ©`;

  return (
    <>
      <PageHeader
        title={t.internships.title}
        subtitle={subtitleText}
      />

      <div className="px-4 py-5 space-y-5 max-w-5xl mx-auto">
        {internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-white/10 bg-card/50 text-center transition-colors">
            <div className="h-14 w-14 rounded-full fintech-gradient-teal flex items-center justify-center mb-4 shadow-md text-white">
              <Briefcase className="h-6 w-6 text-white fill-white/20" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-white">{t.internships.emptyTitle}</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm">
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
                  className="rounded-[20px] border border-white/5 bg-card p-5 flex flex-col justify-between gap-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(5,150,105,0.15)] relative overflow-hidden group"
                >
                  {/* Top info */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-[16px] fintech-gradient-teal flex items-center justify-center text-white flex-shrink-0 font-bold text-sm shadow-sm">
                          <Building2 className="h-5 w-5 fill-white/20" strokeWidth={2} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white/50 truncate">
                              {translateInternshipCompany(internship.company, language)}
                            </span>
                            {internship.isNew && (
                              <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 gap-1 font-bold rounded-md bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                                <Sparkles className="h-2.5 w-2.5" />
                                {t.internships.newBadge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white mt-0.5 truncate">
                            {translateInternshipTitle(internship.title, language)}
                          </h3>
                        </div>
                      </div>

                      <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/70">
                        {typeText}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{translateInternshipLocation(internship.location, language)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{translateInternshipDuration(internship.duration, language)}</span>
                      </span>
                      {internship.deadline && (
                        <span className="flex items-center gap-1 text-[#F97316] font-bold">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{t.internships.deadline}: {internship.deadline}</span>
                        </span>
                      )}
                    </div>

                    {/* Skills/Tags */}
                    {internship.tags && internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                        {internship.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/5 text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action row (Touch targets >= 44px) */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                    {hasValidLink ? (
                      <a
                        href={internship.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors p-2"
                      >
                        <span>{t.internships.externalApply}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/50">
                        {language === "en" ? "Direct Application via Masar" : "ط·آ§ط¸â€‍ط·ع¾ط¸â€ڑط·آ¯ط¸ظ¹ط¸â€¦ ط¸â€¦ط·آ¨ط·آ§ط·آ´ط·آ± ط·آ¹ط·آ¨ط·آ± ط¸â€¦ط·آ³ط·آ§ط·آ±"}
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
