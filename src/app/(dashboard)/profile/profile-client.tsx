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
import { getStudentInitials } from "@/lib/translations/content";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  student: any;
  enrolledCourses: any[];
}

export function ProfileClient({ student, enrolledCourses }: ProfileClientProps) {
  const { t, isRtl, language } = useLanguage();
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const displayName = student.name;
  
  const displayMajor = language === "en" 
    ? (student.major === "هندسة البرمجيات" ? "Software Engineering" : student.major)
    : student.major;
    
  const displayUniversity = language === "en"
    ? (student.university?.name === "الجامعة الأردنية" ? "University of Jordan" : student.university?.name)
    : student.university?.name;

  const nameParts = displayName.split(" ");
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    : nameParts[0][0];

  const skillsList = student.skills ? student.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  
  const displayInitials = getStudentInitials(student.name, language) || initials;

  return (
    <>
      <PageHeader
        title={t.profile.title}
        subtitle={t.profile.subtitle}
      />

      <div className="px-4 py-5 space-y-5 max-w-4xl mx-auto">
        {/* Main User Profile Card */}
        <div className="rounded-[20px] border border-white/5 bg-card p-6 shadow-sm transition-all relative overflow-hidden group hover:border-white/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
            <div className="fintech-gradient-purple p-1 rounded-[22px] shadow-lg">
              <Avatar className="h-20 w-20 rounded-[18px] bg-card flex-shrink-0">
                {student.avatar && (
                  <AvatarImage
                    src={student.avatar}
                    alt={student.name}
                    className="rounded-[18px] object-cover"
                  />
                )}
                <AvatarFallback className="rounded-[18px] text-xl font-bold bg-[#151530] text-white">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="text-xl font-extrabold text-white truncate">
                  {displayName}
                </h2>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  {t.profile.verifiedStudent}
                </div>
              </div>

              <p className="text-sm font-semibold text-white/70 mt-1">
                {displayMajor} · {t.profile.academicYear} {student.year || 3}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-white/5 text-xs text-white/50 font-medium">
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                  <Building2 className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span className="text-white/80">{displayUniversity}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md" dir="ltr">
                  <Fingerprint className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span className="font-mono text-white/80">{student.studentId}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md" dir="ltr">
                  <Mail className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span className="text-white/80">{student.email}</span>
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
        <div className="rounded-[20px] border border-white/5 bg-card p-5 space-y-4 shadow-sm hover:border-white/20 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl fintech-gradient-orange flex items-center justify-center text-white shadow-md">
                <LinkIcon className="h-4 w-4 fill-white/20" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.profile.moodleCardTitle}</p>
                <p className="text-xs text-white/50 font-medium mt-0.5">
                  {t.profile.moodleCardDesc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-2 py-1 rounded-md shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
              {t.profile.moodleStatus}
            </div>
          </div>

          <div className="bg-black/20 rounded-[16px] p-4 text-[11px] font-semibold space-y-2.5 border border-white/5 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-white/40">{t.profile.serverHost}</span>
              <span className="font-mono text-white/80 bg-white/5 px-2 py-0.5 rounded border border-white/5" dir="ltr">
                {student.moodleConnection?.moodleBaseUrl || "moodle.ju.edu.jo"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">{t.profile.encryptionAuth}</span>
              <span className="text-white/80 bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded border border-[#059669]/20">{t.profile.encryptionValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">{t.profile.syncedCourses}</span>
              <span className="text-white font-extrabold tabular-nums bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded border border-[#3B82F6]/20">
                {enrolledCourses.length} {t.profile.activeCoursesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <CertificatesSection certificates={student.certificates || []} />

        {/* Account Quick Links */}
        <div className="rounded-[20px] border border-white/5 bg-card divide-y divide-white/5 overflow-hidden mt-6 shadow-sm">
          <Link
            href="/resume-builder"
            className="flex items-center justify-between p-5 min-h-[56px] hover:bg-white/[0.03] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl fintech-gradient-purple flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-4 w-4 fill-white/20" strokeWidth={2} />
              </div>
              <div className="text-start">
                <p className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#7C3AED] group-hover:to-[#EC4899] transition-all">
                  {isRtl ? "منشئ السيرة الذاتية (بالذكاء الاصطناعي)" : "AI Resume Builder"}
                </p>
                <p className="text-xs text-white/50 font-medium mt-0.5">
                  {isRtl ? "ابنِ سيرة ذاتية متوافقة مع أنظمة ATS بمساعدة الذكاء الاصطناعي" : "Build an ATS-friendly resume with AI assistance"}
                </p>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
              <Chevron className="h-4 w-4 text-white/50" />
            </div>
          </Link>

          <Link
            href="/settings"
            className="flex items-center justify-between p-5 min-h-[56px] hover:bg-white/[0.03] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white/70 shadow-inner">
                <Settings className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="text-start">
                <p className="text-sm font-bold text-white">{t.profile.settingsLink}</p>
                <p className="text-xs text-white/50 font-medium mt-0.5">
                  {t.profile.settingsDesc}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-white/50" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-between p-5 min-h-[56px] hover:bg-[#EF4444]/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
                <LogOut className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="text-start">
                <p className="text-sm font-bold text-[#EF4444]">{t.profile.logoutLink}</p>
                <p className="text-xs text-[#EF4444]/60 font-medium mt-0.5">
                  {t.profile.logoutDesc}
                </p>
              </div>
            </div>
            <Chevron className="h-4 w-4 text-[#EF4444]/50 group-hover:text-[#EF4444] transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
}