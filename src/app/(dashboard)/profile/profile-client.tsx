"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Building2,
  Mail,
  Fingerprint,
  Link as LinkIcon,
  CheckCircle2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { CertificatesSection } from "@/components/profile/certificates-section";
import { useLanguage } from "@/components/providers/language-provider";
import {
  translateStudentName,
  translateMajor,
  translateUniversityName,
  getStudentInitials,
} from "@/lib/translations/content";

interface ProfileClientProps {
  student: {
    id: string;
    name: string;
    avatar?: string | null;
    major: string;
    year?: number | null;
    studentId: string;
    email: string;
    gpa?: number | null;
    completedCredits?: number | null;
    github?: string | null;
    portfolio?: string | null;
    university?: { name: string; nameEn?: string | null } | null;
    moodleConnection?: { moodleBaseUrl: string } | null;
    enrollments: Array<{ course: any }>;
    certificates?: Array<any>;
  };
  skillsList: string[];
  initials: string;
}

export function ProfileClient({ student, skillsList, initials }: ProfileClientProps) {
const { t, isRtl, language } = useLanguage();
  const enrolledCourses = student.enrollments.map((e) => e.course);
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const displayName = translateStudentName(student.name, language);
  const displayMajor = translateMajor(student.major, language);
  const displayUniversity = translateUniversityName(student.university, language) || t.profile.defaultUniversity;
  const displayInitials = getStudentInitials(student.name, language) || initials;

  return (
    <>
      <PageHeader
        title={t.profile.title}
        subtitle={t.profile.subtitle}
      />

      <div className="px-4 py-5 space-y-5 max-w-4xl mx-auto">
        {/* Main User Profile Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 rounded-lg border border-border bg-muted flex-shrink-0">
              {student.avatar && (
                <AvatarImage
                  src={student.avatar}
                  alt={student.name}
                  className="rounded-lg object-cover"
                />
              )}
              <AvatarFallback className="rounded-lg text-xl font-bold bg-primary/10 text-primary">
                {displayInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {displayName}
                </h2>
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  {t.profile.verifiedStudent}
                </Badge>
              </div>

              <p className="text-sm font-medium text-foreground/80 mt-1">
                {displayMajor} آ· {t.profile.academicYear} {student.year || 3}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{displayUniversity}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Fingerprint className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono">{student.studentId}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Interactive Skills and Social Links Editor */}
        <ProfileEditor
          initialSkills={skillsList}
          initialGithub={student.github || ""}
          initialPortfolio={student.portfolio || ""}
        />

        {/* Moodle Integration Card */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t.profile.moodleCardTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {t.profile.moodleCardDesc}
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {t.profile.moodleStatus}
            </Badge>
          </div>

          <div className="bg-muted/40 rounded-lg p-3.5 text-xs space-y-2 border border-border/50">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.profile.serverHost}</span>
              <span className="font-mono text-foreground" dir="ltr">
                {student.moodleConnection?.moodleBaseUrl || "moodle.ju.edu.jo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.profile.encryptionAuth}</span>
              <span className="text-foreground">{t.profile.encryptionValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.profile.syncedCourses}</span>
              <span className="text-foreground font-semibold">
                {enrolledCourses.length} {t.profile.activeCoursesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <CertificatesSection certificates={student.certificates || []} />

        {/* Account Quick Links */}
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden mt-6 shadow-sm">
          <Link
            href="/resume-builder"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary active:bg-muted/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium text-foreground">{isRtl ? t.appdashboardprofileprofileclienttsx.text_04bl : "AI Resume Builder"}</p>
                <p className="text-xs text-muted-foreground">
                  {isRtl ? t.appdashboardprofileprofileclienttsx.text_y7o3 : "Build an ATS-friendly resume with AI assistance"}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/settings"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Settings className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium text-foreground">{t.profile.settingsLink}</p>
                <p className="text-xs text-muted-foreground">
                  {t.profile.settingsDesc}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-destructive/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium text-destructive">{t.profile.logoutLink}</p>
                <p className="text-xs text-muted-foreground">
                  {t.profile.logoutDesc}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
}

