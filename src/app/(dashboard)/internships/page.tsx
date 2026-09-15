import { getInternships, resolveCurrentStudentId } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { InternshipsClient } from "./internships-client";

export const dynamic = 'force-dynamic';

export default async function InternshipsPage() {
  let internships = [];
  let appliedInternshipIds: string[] = [];

  try {
    const studentId = await resolveCurrentStudentId();
    const [fetchedInternships, applications] = await Promise.all([
      getInternships(),
      prisma.internshipApplication.findMany({
        where: { studentId },
        select: { internshipId: true },
      }),
    ]);
    internships = fetchedInternships;
    appliedInternshipIds = applications.map((a) => a.internshipId);
  } catch (error) {
    console.error("InternshipsPage fetch error:", error);
    throw error;
  }

  return (
    <InternshipsClient
      internships={internships}
      appliedInternshipIds={appliedInternshipIds}
    />
  );
}

