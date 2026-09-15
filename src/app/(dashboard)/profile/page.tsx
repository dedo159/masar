import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ProfileClient } from "./profile-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session || session.userType !== "student" || !session.userId) {
    throw new Error("Unauthorized");
  }
  const studentId = session.userId;

  const student = (await prisma.student.findFirst({
    where: { id: studentId },
    include: {
      university: true,
      moodleConnection: true,
      certificates: {
        orderBy: { issueDate: "desc" },
      },
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  }));

  if (!student) {
    throw new Error("Student profile could not be found");
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2) || "ط";

  let skillsList: string[] = [];
  try {
    skillsList = JSON.parse(student.skills);
  } catch {
    skillsList = [];
  }

  return (
    <ProfileClient
      student={student as any}
      skillsList={skillsList}
      initials={initials}
    />
  );
}

