"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check, Globe, GitBranch, Link2, Save, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface ProfileEditorProps {
  initialSkills: string[];
  initialGithub?: string;
  initialPortfolio?: string;
}

const IT_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", 
  "Swift", "Kotlin", "Go", "Rust", "React", "Angular", "Vue.js", "Next.js", 
  "Node.js", "Express", "Django", "Spring Boot", "ASP.NET Core", "SQL", 
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", 
  "Azure", "Google Cloud", "Git", "Linux", "CI/CD", "Agile", "Scrum", 
  "UI/UX Design", "Figma", "Tailwind CSS", "SASS/SCSS", "GraphQL", 
  "REST API", "Machine Learning", "Data Analysis", "Cybersecurity", 
  "Flutter", "React Native"
].sort();

const GENERAL_SKILLS = [
  "Microsoft Office", "Excel", "PowerPoint", "Word", "Google Workspace",
  "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
  "Time Management", "Project Management", "Research", "Writing", "Presentation",
  "Public Speaking", "Negotiation", "Data Analysis", "Statistics", "Report Writing",
  "Arabic", "English", "French", "Spanish"
].sort();

const FACULTY_SKILLS: Record<string, string[]> = {
  it: IT_SKILLS,
  engineering: [...IT_SKILLS.filter(s => ["Python", "C++", "SQL", "Git", "Linux", "Docker", "AWS", "Azure", "Google Cloud"].includes(s)), "MATLAB", "AutoCAD", "SolidWorks", "Simulink", "LabVIEW", "CAD/CAM", ...GENERAL_SKILLS].sort(),
  business: ["Accounting", "Finance", "Marketing", "HR Management", "Supply Chain", "Business Analytics", "SAP", "ERP", "CRM", "Salesforce", "QuickBooks", "Financial Modeling", "Budgeting", "Risk Management", "Strategic Planning", ...GENERAL_SKILLS].sort(),
  pharmacy: ["Clinical Pharmacy", "Pharmacology", "Drug Interactions", "Pharmaceutical Chemistry", "Patient Counseling", "GMP", "Drug Safety", "Clinical Trials", "Regulatory Affairs", ...GENERAL_SKILLS].sort(),
  nursing: ["Patient Care", "Clinical Assessment", "Emergency Care", "Pediatric Nursing", "Surgical Nursing", "Mental Health", "Health Education", "CPR/BLS", "Electronic Health Records", ...GENERAL_SKILLS].sort(),
  allied_medical: ["Lab Diagnostics", "Medical Imaging", "Physical Therapy", "Audiology", "Optometry", "Rehabilitation", "Clinical Research", "Infection Control", ...GENERAL_SKILLS].sort(),
  architecture_design: ["AutoCAD", "Revit", "SketchUp", "3ds Max", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Figma", "Interior Design", "Urban Planning", "Sustainable Design", "BIM", ...GENERAL_SKILLS].sort(),
  law: ["Legal Research", "Contract Drafting", "Litigation", "Arbitration", "Constitutional Law", "Criminal Law", "International Law", "Human Rights Law", "Legal Writing", "Mediation", ...GENERAL_SKILLS].sort(),
  arts_sciences: ["Translation", "Linguistics", "Literary Analysis", "Academic Writing", "Content Creation", "Editing", "Applied Physics", "Mathematics", "Statistical Analysis", ...GENERAL_SKILLS].sort(),
  educational_sciences: ["Curriculum Design", "Special Education", "Educational Psychology", "Classroom Management", "E-Learning", "Assessment Design", "Child Development", "Physical Education", ...GENERAL_SKILLS].sort(),
  dentistry: ["Oral Surgery", "Prosthodontics", "Orthodontics", "Periodontics", "Dental Imaging", "Patient Management", "Clinical Skills", "Dental Materials", ...GENERAL_SKILLS].sort(),
};

export function ProfileEditor({
  initialSkills = [],
  initialGithub = "",
  initialPortfolio = "",
}: ProfileEditorProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [github, setGithub] = useState(initialGithub || "");
  const [portfolio, setPortfolio] = useState(initialPortfolio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const faculty = typeof window !== "undefined" ? localStorage.getItem("masar_user_faculty") || "it" : "it";
  const isIT = faculty === "it";
  const AVAILABLE_SKILLS = FACULTY_SKILLS[faculty] || GENERAL_SKILLS;

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
    <div className="rounded-lg border border-border bg-card p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-foreground font-medium" />
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
          <select
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex flex-1 h-11 min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>{isAr ? (isIT ? "اختر مهارة تقنية..." : "اختر مهارة...") : "Choose a skill..."}</option>
            {AVAILABLE_SKILLS.filter(s => !skills.includes(s)).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
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
          {/* GitHub - only for IT faculty; LinkedIn for others */}
          {isIT ? (
            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                {t.profile.githubLabel}
              </span>
              <Input value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/username"
                className="min-h-[44px] font-mono text-xs"
                dir="ltr"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                LinkedIn
              </span>
              <Input value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="linkedin.com/in/username"
                className="min-h-[44px] font-mono text-xs"
                dir="ltr"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {t.profile.portfolioLabel}
            </span>
            <Input value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder={isIT ? "https://myportfolio.dev" : "https://myportfolio.com"}
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
