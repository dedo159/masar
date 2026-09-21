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
  ChevronLeft,
  ChevronRight,
  Award,
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

      <div className="max-w-4xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {/* Main User Profile Card */}
        <div className="apple-glass-card p-6 shadow-xl transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 rounded-2xl border border-white/20 bg-white/[0.06] flex-shrink-0 shadow-lg">
              {student.avatar && (
                <AvatarImage
                  src={student.avatar}
                  alt={student.name}
                  className="rounded-2xl object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                {displayInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight truncate">
                  {displayName}
                </h2>
                <Badge variant="success" className="gap-1 text-xs bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                  <CheckCircle2 className="h-3 w-3" />
                  {t.profile.verifiedStudent}
                </Badge>
              </div>

              <p className="text-sm font-semibold text-blue-400/90 mt-1">
                {displayMajor} · {t.profile.academicYear} {student.year || 3}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-medium text-slate-200">{displayUniversity}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Fingerprint className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-mono text-slate-200">{student.studentId}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-200">{student.email}</span>
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
        <div className="apple-glass-card p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shadow-sm">
                <LinkIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.profile.moodleCardTitle}</p>
                <p className="text-xs text-slate-300">
                  {t.profile.moodleCardDesc}
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-xs gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              <CheckCircle2 className="h-3 w-3" />
              {t.profile.moodleStatus}
            </Badge>
          </div>

          <div className="bg-white/[0.03] rounded-2xl p-4 text-xs space-y-2.5 border border-white/10">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">{t.profile.serverHost}</span>
              <span className="font-mono text-white font-medium" dir="ltr">
                {student.moodleConnection?.moodleBaseUrl || "moodle.ju.edu.jo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">{t.profile.encryptionAuth}</span>
              <span className="text-white font-medium">{t.profile.encryptionValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">{t.profile.syncedCourses}</span>
              <span className="text-white font-bold">
                {enrolledCourses.length} {t.profile.activeCoursesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <CertificatesSection certificates={student.certificates || []} />

        {/* Account Quick Links */}
        <div className="apple-glass-card overflow-hidden mt-6 shadow-xl">
          <Link
            href="/settings"
            className="flex items-center justify-between p-5 min-h-[60px] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-white/[0.08] border border-white/12 flex items-center justify-center text-slate-200">
                <Settings className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="text-start">
                <p className="text-sm font-bold text-white">{t.profile.settingsLink}</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t.profile.settingsDesc}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-slate-300" />
          </Link>
        </div>
      </div>
    </>
  );
}

