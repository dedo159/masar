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
} from "lucide-react";
import Link from "next/link";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { useLanguage } from "@/components/providers/language-provider";

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
    university?: { name: string } | null;
    moodleConnection?: { moodleBaseUrl: string } | null;
    enrollments: Array<{ course: any }>;
  };
  skillsList: string[];
  initials: string;
}

export function ProfileClient({ student, skillsList, initials }: ProfileClientProps) {
  const { t, isRtl } = useLanguage();
  const enrolledCourses = student.enrollments.map((e) => e.course);
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  return (
    <>
      <PageHeader
        title={t.profile.title}
        subtitle={t.profile.subtitle}
      />

      <div className="px-4 py-5 space-y-5 max-w-4xl mx-auto">
        {/* Main User Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 rounded-2xl border-2 border-border bg-secondary flex-shrink-0">
              {student.avatar && (
                <AvatarImage
                  src={student.avatar}
                  alt={student.name}
                  className="rounded-2xl object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {student.name}
                </h2>
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  {t.profile.verifiedStudent}
                </Badge>
              </div>

              <p className="text-sm font-medium text-foreground/80 mt-1">
                {student.major} · {t.profile.academicYear} {student.year || 3}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{student.university?.name || t.profile.defaultUniversity}</span>
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

        {/* Academic Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <GraduationCap className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {student.gpa || 3.42}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.profile.gpaLabel}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {enrolledCourses.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.profile.enrolledCourses}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <Award className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {student.completedCredits || 79}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.profile.completedCredits}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {t.profile.moodleStatus}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.profile.moodlePortal}</p>
          </div>
        </div>

        {/* Interactive Skills and Social Links Editor */}
        <ProfileEditor
          initialSkills={skillsList}
          initialGithub={student.github || ""}
          initialPortfolio={student.portfolio || ""}
        />

        {/* Moodle Integration Card */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
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

          <div className="bg-secondary/40 rounded-lg p-3.5 text-xs space-y-2 border border-border/50">
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

        {/* Account Quick Links */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <Link
            href="/settings"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
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
