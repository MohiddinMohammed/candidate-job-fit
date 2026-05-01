import {
  DashboardFilters,
  JobPreference,
  JobResult,
  JobWithMatch,
} from "@/lib/types";

import type { CandidateProfile, JobMatchAnalysis } from "@/lib/types";

function normalize(values: string[]): string[] {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function overlap(base: string[], candidate: string[]): string[] {
  const set = new Set(normalize(candidate));
  return base.filter((item) => set.has(item.toLowerCase()));
}

export function analyzeJobMatch(
  profile: CandidateProfile,
  job: JobResult,
  preferences: JobPreference,
): JobMatchAnalysis {
  const candidateSkills = normalize([
    ...profile.skills,
    ...profile.toolsAndTechnologies,
  ]);
  const required = normalize(job.requiredSkills);
  const preferred = normalize(job.preferredSkills);

  const matchedRequired = required.filter((skill) =>
    candidateSkills.includes(skill),
  );
  const matchedPreferred = preferred.filter((skill) =>
    candidateSkills.includes(skill),
  );

  const missingRequired = required.filter(
    (skill) => !candidateSkills.includes(skill),
  );
  const missingPreferred = preferred.filter(
    (skill) => !candidateSkills.includes(skill),
  );

  const locationFit =
    preferences.preferredLocations.length === 0 ||
    preferences.preferredLocations.some((location) =>
      job.location.toLowerCase().includes(location.toLowerCase()),
    ) ||
    (preferences.preferredLocations.some(
      (location) => location.toLowerCase() === "remote",
    ) &&
      job.remoteType === "remote");

  const remoteFit =
    preferences.remotePreference.length === 0 ||
    preferences.remotePreference.includes(job.remoteType);
  const seniorityFit =
    preferences.seniorityLevel.length === 0 ||
    preferences.seniorityLevel.includes(job.seniority);
  const employmentFit =
    preferences.employmentTypes.length === 0 ||
    preferences.employmentTypes.includes(job.employmentType);

  const hardFilterPassed =
    locationFit && remoteFit && seniorityFit && employmentFit;

  const requiredRatio =
    required.length > 0 ? matchedRequired.length / required.length : 1;
  const preferredRatio =
    preferred.length > 0 ? matchedPreferred.length / preferred.length : 1;
  const techStackOverlap = overlap(preferences.preferredTechStack, [
    ...job.requiredSkills,
    ...job.preferredSkills,
  ]);
  const semanticScore = Math.min(
    1,
    techStackOverlap.length /
      Math.max(1, preferences.preferredTechStack.length),
  );

  const weighted =
    requiredRatio * 0.45 +
    preferredRatio * 0.2 +
    semanticScore * 0.15 +
    Number(locationFit) * 0.1 +
    Number(seniorityFit) * 0.1;

  let score = Math.round(weighted * 100);
  if (!hardFilterPassed) {
    score = Math.round(score * 0.35);
  }

  let recommendation: JobMatchAnalysis["recommendation"] = "Weak match";
  if (score >= 80) recommendation = "Strong match";
  else if (score >= 65) recommendation = "Good match";
  else if (score >= 45) recommendation = "Stretch role";

  const explanationParts = [
    `${matchedRequired.length}/${required.length || 1} required skills matched`,
    `${matchedPreferred.length}/${preferred.length || 1} preferred skills matched`,
    locationFit ? "location aligned" : "location mismatch",
    seniorityFit ? "seniority aligned" : "seniority mismatch",
  ];

  return {
    jobId: job.id,
    score,
    matchedSkills: [...matchedRequired, ...matchedPreferred],
    missingRequiredSkills: missingRequired,
    missingPreferredSkills: missingPreferred,
    requiredSkillsMatched: matchedRequired.length,
    preferredSkillsMatched: matchedPreferred.length,
    seniorityFit,
    locationFit,
    preferenceFit: remoteFit && employmentFit,
    hardFilterPassed,
    explanation: explanationParts.join("; "),
    recommendation,
    semanticScore: Math.round(semanticScore * 100),
  };
}

export function filterAndSortJobs(
  jobs: JobWithMatch[],
  filters: DashboardFilters,
): JobWithMatch[] {
  const minScore = filters.minScore ?? 0;
  const filtered = jobs.filter(({ job, match }) => {
    if (match.score < minScore) return false;
    if (
      filters.remoteType &&
      filters.remoteType !== "all" &&
      job.remoteType !== filters.remoteType
    )
      return false;
    if (
      filters.source &&
      filters.source !== "all" &&
      job.source !== filters.source
    )
      return false;
    if (
      filters.seniority &&
      filters.seniority !== "all" &&
      job.seniority !== filters.seniority
    )
      return false;
    return true;
  });

  const sortBy = filters.sortBy ?? "best-match";

  if (sortBy === "company") {
    return filtered.sort((a, b) => a.job.company.localeCompare(b.job.company));
  }

  if (sortBy === "newest") {
    return filtered.sort(
      (a, b) =>
        new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime(),
    );
  }

  return filtered.sort((a, b) => b.match.score - a.match.score);
}
