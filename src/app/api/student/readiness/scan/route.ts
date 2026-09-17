import { NextResponse } from "next/server";
import { getStudentProfile } from "@/lib/db-queries";
import { getSession } from "@/lib/auth";
import { scanGitHubUser } from "@/lib/github-scanner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const studentId = session?.userType === "student" ? session.userId : undefined;
    const student = await getStudentProfile(studentId);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const githubUrl = student.github || "";
    const profileSkills = Array.isArray(student.skills) ? student.skills : [];

    let scanResult = null;
    if (githubUrl) {
      scanResult = await scanGitHubUser(githubUrl, profileSkills);
    }

    return NextResponse.json({
      success: true,
      hasGithub: Boolean(githubUrl),
      githubUrl,
      profileSkills,
      scan: scanResult,
      student: {
        name: student.name,
        major: student.major,
        gpa: student.gpa,
        completedCredits: student.completedCredits,
        totalCredits: student.totalCredits,
      }
    });
  } catch (error: any) {
    console.error("GET /api/student/readiness/scan error:", error);
    return NextResponse.json({ error: error.message || "Failed to scan GitHub" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { github_url, skills } = body;

    const session = await getSession();
    const studentId = session?.userType === "student" ? session.userId : undefined;
    const student = await getStudentProfile(studentId).catch(() => null);

    const targetGithub = github_url || student?.github || "";
    const targetSkills = Array.isArray(skills) ? skills : (Array.isArray(student?.skills) ? student.skills : []);

    const scanResult = await scanGitHubUser(targetGithub, targetSkills);

    return NextResponse.json({
      success: true,
      scan: scanResult,
      profileSkills: targetSkills
    });
  } catch (error: any) {
    console.error("POST /api/student/readiness/scan error:", error);
    return NextResponse.json({ error: error.message || "Failed to scan GitHub" }, { status: 500 });
  }
}
