"use client";

import { useResumeStore } from "@/lib/resume/store";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const ResumePreview = forwardRef<HTMLDivElement, {}>((_, ref) => {
  const { data, activeField } = useResumeStore();
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // Flash highlight effect
  useEffect(() => {
    if (activeField) {
      setHighlightedField(activeField);
      const timer = setTimeout(() => setHighlightedField(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeField, data]);

  const highlightClass = "transition-all duration-500 ease-in-out ring-2 ring-primary/50 bg-primary/5 rounded-md";

  return (
    <div className="bg-white text-black min-h-[1056px] w-[816px] shadow-2xl p-10 font-sans mx-auto box-border overflow-hidden print:w-full print:shadow-none print:p-0 print:m-0" ref={ref}>
      
      {/* Header */}
      <header className={cn("text-center mb-6 pb-4 border-b-2 border-black", highlightedField === 'basics' && highlightClass)}>
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2 text-black">{data.basics.fullName}</h1>
        <p className="text-xl text-gray-800 mb-3">{data.basics.targetJobTitle}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700">
          {data.basics.email && <span>{data.basics.email}</span>}
          {data.basics.phone && <span>• {data.basics.phone}</span>}
          {data.basics.location && <span>• {data.basics.location}</span>}
          {data.basics.linkedin && <span>• <a href={`https://${data.basics.linkedin}`} className="text-blue-700 hover:underline">{data.basics.linkedin}</a></span>}
          {data.basics.github && <span>• <a href={`https://${data.basics.github}`} className="text-blue-700 hover:underline">{data.basics.github}</a></span>}
          {data.basics.portfolio && <span>• <a href={`https://${data.basics.portfolio}`} className="text-blue-700 hover:underline">{data.basics.portfolio}</a></span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className={cn("mb-5", highlightedField === 'summary' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2 text-black">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className={cn("mb-5", highlightedField === 'skills' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2 text-black">Technical Skills</h2>
          <div className="grid grid-cols-1 gap-1 text-sm text-gray-800">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx} className="flex">
                <span className="font-bold min-w-[120px]">{skillGroup.category}:</span>
                <span>{skillGroup.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className={cn("mb-5", highlightedField === 'projects' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 text-black">Projects & Experience</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-black">
                    {project.title} <span className="font-normal text-gray-600">| {project.role}</span>
                  </h3>
                  {project.link && (
                    <a href={`https://${project.link}`} className="text-sm text-blue-700 hover:underline">{project.link}</a>
                  )}
                </div>
                {project.techStack.length > 0 && (
                  <div className="text-xs italic text-gray-600 mb-2">
                    Technologies: {project.techStack.join(', ')}
                  </div>
                )}
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 pl-1">
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-snug">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className={cn("mb-5", highlightedField === 'education' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 text-black">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline font-bold text-black text-sm mb-1">
                <span>{edu.institution}</span>
                <span>Class of {edu.graduationYear}</span>
              </div>
              <div className="text-sm text-gray-800 italic mb-1">{edu.degree}</div>
              {edu.relevantCoursework.length > 0 && (
                <div className="text-xs text-gray-700">
                  <span className="font-bold">Relevant Coursework: </span>
                  {edu.relevantCoursework.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className={cn("mb-5", highlightedField === 'certifications' && highlightClass)}>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 text-black">Certifications</h2>
          <div className="text-sm text-gray-800 space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span className="font-bold">{cert.name} <span className="font-normal">| {cert.issuer}</span></span>
                {cert.link && <a href={cert.link} className="text-blue-700 hover:underline text-xs">View Credential</a>}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
});
ResumePreview.displayName = "ResumePreview";
