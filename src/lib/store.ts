import { randomUUID } from "node:crypto";

import {
  EMPTY_PREFERENCES,
  EMPTY_PROFILE,
  LEGAL_NOTICE,
  PRIVACY_NOTICE,
} from "@/lib/constants";
import { getAiService } from "@/lib/ai-service";
import { createProviders } from "@/lib/job-providers";
import { analyzeJobMatch, filterAndSortJobs } from "@/lib/matching";
import { getRepository } from "@/lib/repository";
import {
  ApplicationRecord,
  ApplicationStatus,
  CandidateProfile,
  DashboardData,
  DashboardFilters,
  GeneratedDocument,
  JobPreference,
  JobResult,
  ResumeMeta,
} from "@/lib/types";

interface AppState {
  resumeMeta: ResumeMeta | null;
  profile: CandidateProfile;
  preferences: JobPreference;
  jobs: JobResult[];
  matches: Record<string, ReturnType<typeof analyzeJobMatch>>;
  applications: Record<string, ApplicationRecord>;
  generatedDocuments: GeneratedDocument[];
  manualJobs: JobResult[];
}

declare global {
  // eslint-disable-next-line no-var
  var __jobFitStore: AppState | undefined;
}

function emptyState(): AppState {
  return {
    resumeMeta: null,
    profile: { ...EMPTY_PROFILE },
    preferences: { ...EMPTY_PREFERENCES },
    jobs: [],
    matches: {},
    applications: {},
    generatedDocuments: [],
    manualJobs: [],
  };
}

function getState(): AppState {
  if (!global.__jobFitStore) {
    global.__jobFitStore = emptyState();
  }

  return global.__jobFitStore;
}

export function setResumeMeta(meta: ResumeMeta) {
  const state = getState();
  state.resumeMeta = meta;
}

export async function upsertProfile(profile: CandidateProfile) {
  const state = getState();
  state.profile = profile;
  await getRepository().saveProfile(profile);
}

export async function upsertPreferences(preferences: JobPreference) {
  const state = getState();
  state.preferences = preferences;
  await getRepository().savePreferences(preferences);
}

export function addManualJob(
  job: Omit<JobResult, "id" | "source" | "postedAt">,
): JobResult {
  const state = getState();

  const manualJob: JobResult = {
    ...job,
    id: `manual-${randomUUID()}`,
    source: "Manual Entry demo",
    postedAt: new Date().toISOString(),
  };

  state.manualJobs.unshift(manualJob);
  return manualJob;
}

export async function discoverJobs() {
  const state = getState();
  const aiService = getAiService();
  const providers = createProviders(() => state.manualJobs);

  const providerResults = await Promise.all(
    providers.map((provider) =>
      provider.search(state.profile, state.preferences),
    ),
  );

  const jobs = providerResults.flat();
  const dedupedById = Array.from(
    new Map(jobs.map((job) => [job.id, job])).values(),
  );

  const matchesEntries = await Promise.all(
    dedupedById.map(async (job) => {
      const match = await aiService.analyzeJobMatch(
        state.profile,
        job,
        state.preferences,
      );
      return [job.id, match] as const;
    }),
  );

  state.jobs = dedupedById;
  state.matches = Object.fromEntries(matchesEntries);

  for (const job of dedupedById) {
    if (!state.applications[job.id]) {
      state.applications[job.id] = {
        jobId: job.id,
        status: "Saved",
        notes: "",
        updatedAt: new Date().toISOString(),
      };
    }
  }
}

export function getDashboardData(
  filters: DashboardFilters = {},
): DashboardData {
  const state = getState();

  const jobsWithMatch = state.jobs.map((job) => ({
    job,
    match: state.matches[job.id],
    application: state.applications[job.id],
  }));

  return {
    resumeMeta: state.resumeMeta,
    profile: state.profile,
    preferences: state.preferences,
    jobs: filterAndSortJobs(jobsWithMatch, filters),
    generatedDocuments: state.generatedDocuments,
    legalNotice: LEGAL_NOTICE,
    privacyNotice: PRIVACY_NOTICE,
  };
}

export function updateApplication(
  jobId: string,
  status: ApplicationStatus,
  notes: string,
) {
  const state = getState();

  state.applications[jobId] = {
    jobId,
    status,
    notes,
    updatedAt: new Date().toISOString(),
  };

  return state.applications[jobId];
}

export async function generateDocument(
  jobId: string,
  type: "resume" | "cover-letter",
) {
  const state = getState();
  const aiService = getAiService();
  const job = state.jobs.find((candidate) => candidate.id === jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const content =
    type === "resume"
      ? await aiService.generateTailoredResume(state.profile, job)
      : await aiService.generateCoverLetter(state.profile, job);

  const document: GeneratedDocument = {
    id: randomUUID(),
    jobId,
    type,
    content,
    createdAt: new Date().toISOString(),
  };

  const withoutOld = state.generatedDocuments.filter(
    (existing) => !(existing.jobId === jobId && existing.type === type),
  );
  state.generatedDocuments = [document, ...withoutOld];
  await getRepository().saveGeneratedDocument(document);

  return document;
}

export function getJobById(jobId: string) {
  const state = getState();
  return {
    job: state.jobs.find((entry) => entry.id === jobId) ?? null,
    match: state.matches[jobId] ?? null,
    application: state.applications[jobId] ?? null,
    generated: state.generatedDocuments.filter((doc) => doc.jobId === jobId),
  };
}

export function resetUserData() {
  global.__jobFitStore = emptyState();
}

export function getCurrentStateSnapshot() {
  const state = getState();
  return {
    hasJobs: state.jobs.length > 0,
    profile: state.profile,
    preferences: state.preferences,
  };
}
