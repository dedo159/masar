"use client";

import { useResumeStore } from "@/lib/resume/store";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Briefcase, Code, Globe } from "lucide-react";

export const ResumePreview = forwardRef<HTMLDivElement, {}>((_, ref) => {
  const { data, activeField } = useResumeStore();
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  useEffect(() => {
    if (activeField) {
      setHighlightedField(activeField);
      const timer = setTimeout(() => setHighlightedField(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeField, data]);

  const highlightClass = "ring-4 ring-yellow-400 ring-offset-4 ring-offset-white rounded-sm transition-all duration-300";

  const themeColors: Record<string, string> = {
    blue: '#2563eb',
    green: '#16a34a',
    slate: '#475569',
    red: '#dc2626',
    black: '#111827',
  };
  
  const fonts: Record<string, string> = {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, serif',
    mono: 'ui-monospace, SFMono-Regular, monospace',
  };

  const currentTheme = themeColors[data.design?.themeColor] || themeColors.blue;
  const currentFont = fonts[data.design?.fontFamily] || fonts.sans;

  return (
    <div 
      className="bg-white text-gray-800 min-h-[1056px] w-[816px] shadow-2xl p-12 mx-auto box-border overflow-hidden print:w-full print:shadow-none print:p-0 print:m-0" 
      ref={ref}
      style={{ 
        "--theme-color": currentTheme,
        "--theme-color-dark": data.design?.themeColor === "black" ? "#000" : currentTheme,
        fontFamily: currentFont 
      } as React.CSSProperties}
    >
      
      {/* Header */}
      <header className={cn("text-center mb-8", highlightedField === 'basics' && highlightClass)}>
        <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-[var(--theme-color-dark)]" style={{ letterSpacing: '-0.02em' }}>
          {data.basics.fullName}
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-4">{data.basics.targetJobTitle}</p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-gray-600">
          {data.basics.email && (
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.email}</span>
          )}
          {data.basics.phone && (
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.phone}</span>
          )}
          {data.basics.location && (
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.location}</span>
          )}
          {data.basics.Briefcase && (
            <a href={`https://${data.basics.Briefcase}`} className="flex items-center gap-1.5 hover:text-[var(--theme-color)] transition-colors">
              <Briefcase className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.Briefcase}
            </a>
          )}
          {data.basics.Code && (
            <a href={`https://${data.basics.Code}`} className="flex items-center gap-1.5 hover:text-[var(--theme-color)] transition-colors">
              <Code className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.Code}
            </a>
          )}
          {data.basics.portfolio && (
            <a href={`https://${data.basics.portfolio}`} className="flex items-center gap-1.5 hover:text-[var(--theme-color)] transition-colors">
              <Globe className="w-4 h-4 text-[var(--theme-color)]" /> {data.basics.portfolio}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className={cn("mb-6", highlightedField === 'summary' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--theme-color-dark)] border-b-2 border-[var(--theme-color)] pb-1 mb-3">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className={cn("mb-6", highlightedField === 'skills' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--theme-color-dark)] border-b-2 border-[var(--theme-color)] pb-1 mb-3">Technical Skills</h2>
          <div className="flex flex-col gap-2">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-2">
                <span className="font-bold text-sm text-gray-800 min-w-[120px]">{skillGroup.category}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((item, i) => (
                    <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 10%, transparent)', color: 'var(--theme-color-dark)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className={cn("mb-6", highlightedField === 'projects' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--theme-color-dark)] border-b-2 border-[var(--theme-color)] pb-1 mb-3">Projects & Experience</h2>
          <div className="space-y-5">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-gray-900">
                    {project.title} <span className="font-medium text-[var(--theme-color)]">| {project.role}</span>
                  </h3>
                  {project.link && (
                    <a href={`https://${project.link}`} className="text-sm text-gray-500 hover:text-[var(--theme-color)] transition-colors flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {project.link}
                    </a>
                  )}
                </div>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="list-outside list-disc text-sm text-gray-700 space-y-1.5 pl-4 ml-1 marker:text-[var(--theme-color)]">
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-snug pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className={cn("mb-6", highlightedField === 'education' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--theme-color-dark)] border-b-2 border-[var(--theme-color)] pb-1 mb-3">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-sm mb-0.5">
                <span>{edu.institution}</span>
                <span className="text-[var(--theme-color)]">Class of {edu.graduationYear}</span>
              </div>
              <div className="text-sm text-gray-700 font-medium mb-1">{edu.degree}</div>
              {edu.relevantCoursework.length > 0 && (
                <div className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">Relevant Coursework: </span>
                  {edu.relevantCoursework.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className={cn("mb-6", highlightedField === 'certifications' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--theme-color-dark)] border-b-2 border-[var(--theme-color)] pb-1 mb-3">Certifications</h2>
          <div className="text-sm text-gray-800 space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900">{cert.name} <span className="font-medium text-gray-600">| {cert.issuer}</span></span>
                {cert.link && (
                  <a href={cert.link} className="text-gray-500 hover:text-[var(--theme-color)] transition-colors text-xs flex items-center gap-1">
                    <Globe className="w-3 h-3" /> View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
});
ResumePreview.displayName = "ResumePreview";
