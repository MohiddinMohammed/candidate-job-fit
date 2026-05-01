import { DEMO_JOBS } from "@/lib/demo-jobs";
import { CandidateProfile, JobPreference, JobResult } from "@/lib/types";

export interface JobSourceProvider {
  search(
    profile: CandidateProfile,
    preferences: JobPreference,
  ): Promise<JobResult[]>;
}

export class MockJobProvider implements JobSourceProvider {
  async search(
    profile: CandidateProfile,
    preferences: JobPreference,
  ): Promise<JobResult[]> {
    const desiredTitle = preferences.desiredJobTitles[0]?.toLowerCase() ?? "";

    if (!desiredTitle) return DEMO_JOBS;

    const narrowed = DEMO_JOBS.filter((job) =>
      `${job.title} ${job.description}`.toLowerCase().includes(desiredTitle),
    );

    return narrowed.length ? narrowed : DEMO_JOBS;
  }
}

export class SearchResultProvider implements JobSourceProvider {
  async search(
    profile: CandidateProfile,
    preferences: JobPreference,
  ): Promise<JobResult[]> {
    const hasSearchConfig =
      Boolean(process.env.GOOGLE_SEARCH_API_KEY) &&
      Boolean(process.env.GOOGLE_SEARCH_ENGINE_ID);

    if (!hasSearchConfig) {
      return DEMO_JOBS.filter((job) => job.source === "Search Result demo").map(
        (job) => ({
          ...job,
          description:
            "Search result snippet only. Paste full job description manually for deeper analysis when source pages are restricted.",
          snippet: `${job.title} at ${job.company}. Safe discovery snippet from approved search results.`,
        }),
      );
    }

    return DEMO_JOBS.filter((job) => job.source === "Search Result demo").map(
      (job) => ({
        ...job,
        snippet: `${job.title} - discovered from configured search API`,
      }),
    );
  }
}

export class ManualJobProvider implements JobSourceProvider {
  constructor(private readonly getManualJobs: () => JobResult[]) {}

  async search(): Promise<JobResult[]> {
    return this.getManualJobs();
  }
}

export function createProviders(
  getManualJobs: () => JobResult[],
): JobSourceProvider[] {
  return [
    new MockJobProvider(),
    new SearchResultProvider(),
    new ManualJobProvider(getManualJobs),
  ];
}
