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
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            {t.profile.editorTitle}
          </h3>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            <Check className="h-3.5 w-3.5" />
            {t.profile.savedSuccess}
          </span>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">
          {t.profile.skillsLabel}
        </label>

        {/* Existing skills chips */}
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 rounded-lg bg-secondary/30 border border-border">
          {skills.length === 0 ? (
            <p className="text-xs text-muted-foreground p-1">{t.profile.noSkills}</p>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-card border border-border text-xs font-medium text-foreground shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5 rounded-full transition-colors"
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
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder={t.profile.skillPlaceholder}
            className="flex-1 min-h-[44px]"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddSkill}
            className="gap-1 min-h-[44px] px-4"
          >
            <Plus className="h-4 w-4" />
            <span>{t.profile.addSkill}</span>
          </Button>
        </div>
      </div>

      {/* Social / External Links Section */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="text-xs font-semibold text-foreground">
          {t.profile.linksLabel}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <GitBranch className="h-3.5 w-3.5" />
              {t.profile.githubLabel}
            </span>
            <Input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/username"
              className="min-h-[44px] font-mono text-xs"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {t.profile.portfolioLabel}
            </span>
            <Input
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://myportfolio.dev"
              className="min-h-[44px] font-mono text-xs"
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
          className="w-full sm:w-auto gap-2 min-h-[44px] px-6 font-semibold"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? t.profile.saving : t.profile.saveButton}</span>
        </Button>
      </div>
    </div>
  );
}

