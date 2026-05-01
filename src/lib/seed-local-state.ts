import { DEMO_JOBS } from "@/lib/demo-jobs";
import {
  addManualJob,
  discoverJobs,
  getCurrentStateSnapshot,
} from "@/lib/store";

export async function ensureSeedState() {
  const snapshot = getCurrentStateSnapshot();
  if (snapshot.hasJobs) return;

  // Keep one manual-entry-style job available out of the box.
  const manualTemplate = DEMO_JOBS.find(
    (job) => job.source === "Manual Entry demo",
  );
  if (manualTemplate) {
    addManualJob({
      title: manualTemplate.title,
      company: manualTemplate.company,
      location: manualTemplate.location,
      remoteType: manualTemplate.remoteType,
      seniority: manualTemplate.seniority,
      employmentType: manualTemplate.employmentType,
      industry: manualTemplate.industry,
      description: manualTemplate.description,
      requiredSkills: manualTemplate.requiredSkills,
      preferredSkills: manualTemplate.preferredSkills,
      applyUrl: manualTemplate.applyUrl,
    });
  }

  await discoverJobs();
}
