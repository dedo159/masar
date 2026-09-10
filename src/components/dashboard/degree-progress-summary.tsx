import { getDegreeRequirements } from "@/lib/db-queries";
import { DegreeProgressSummaryClient } from "./degree-progress-summary-client";
import type { DegreeRequirement } from "@/lib/types";

export async function DegreeProgressSummary() {
  let requirements: DegreeRequirement[] = [];
  try {
    requirements = await getDegreeRequirements();
  } catch (error) {
    console.error("DegreeProgressSummary fetch error:", error);
    requirements = [];
  }

  return <DegreeProgressSummaryClient requirements={requirements} />;
}

