import { getInternships, DEFAULT_STUDENT_ID } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { InternshipsClient } from "./internships-client";

export const revalidate = 0;

export default async function InternshipsPage() {
  let internships = [];
  let appliedInternshipIds: string[] = [];

  try {
    const [fetchedInternships, applications] = await Promise.all([
      getInternships(),
      prisma.internshipApplication.findMany({
        where: { studentId: DEFAULT_STUDENT_ID },
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

