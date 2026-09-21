"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check, Globe, GitBranch, Save, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface ProfileEditorProps {
  initialSkills: string[];
  initialGithub?: string;
  initialPortfolio?: string;
}

const AVAILABLE_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", 
  "Swift", "Kotlin", "Go", "Rust", "React", "Angular", "Vue.js", "Next.js", 
  "Node.js", "Express", "Django", "Spring Boot", "ASP.NET Core", "SQL", 
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", 
  "Azure", "Google Cloud", "Git", "Linux", "CI/CD", "Agile", "Scrum", 
  "UI/UX Design", "Figma", "Tailwind CSS", "SASS/SCSS", "GraphQL", 
  "REST API", "Machine Learning", "Data Analysis", "Cybersecurity", 
  "Flutter", "React Native"
].sort();

export function ProfileEditor({
  initialSkills = [],
  initialGithub = "",
  initialPortfolio = "",
}: ProfileEditorProps) {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [github, setGithub] = useState(initialGithub || "");
  const [portfolio, setPortfolio] = useState(initialPortfolio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/students/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, github, portfolio }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="apple-glass-card p-5 sm:p-6 space-y-5 shadow-xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.profile.editorTitle}
          </h3>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-400/30">
            <Check className="h-3.5 w-3.5" />
            {t.profile.savedSuccess}
          </span>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-200 block">
          {t.profile.skillsLabel}
        </label>

        {/* Existing skills chips */}
        <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 p-1 font-medium">{t.profile.noSkills}</p>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.07] border border-white/15 text-xs font-semibold text-white shadow-sm hover:bg-white/[0.12] transition-colors"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-red-400 cursor-pointer p-0.5 rounded-full transition-colors"
                  aria-label={`${t.profile.removeSkill} ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add skill row */}
        <div className="flex gap-2">
          <select
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex flex-1 h-11 min-h-[44px] rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <option value="" disabled className="bg-[#0f172a] text-slate-400">اختر مهارة تقنية...</option>
            {AVAILABLE_SKILLS.filter(s => !skills.includes(s)).map(skill => (
              <option key={skill} value={skill} className="bg-[#0f172a] text-white">{skill}</option>
            ))}
          </select>
          <Button
            type="button"
            onClick={handleAddSkill}
            className="gap-1.5 min-h-[44px] px-5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/15 shadow-sm transition-all text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t.profile.addSkill}</span>
          </Button>
        </div>
      </div>

      {/* Social / External Links Section */}
      <div className="space-y-3 pt-3.5 border-t border-white/10">
        <label className="text-xs font-bold text-slate-200 block">
          {t.profile.linksLabel}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-blue-400" />
              {t.profile.githubLabel}
            </span>
            <Input 
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/username"
              className="min-h-[44px] font-mono text-xs bg-white/[0.06] border-white/15 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-xl"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              {t.profile.portfolioLabel}
            </span>
            <Input 
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://myportfolio.dev"
              className="min-h-[44px] font-mono text-xs bg-white/[0.06] border-white/15 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-xl"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto gap-2 min-h-[44px] px-6 font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-xs"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? t.profile.saving : t.profile.saveButton}</span>
        </Button>
      </div>
    </div>
  );
}

