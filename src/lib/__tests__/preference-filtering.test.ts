import { describe, expect, test } from "vitest";

import { DEMO_JOBS } from "@/lib/demo-jobs";
import { filterAndSortJobs } from "@/lib/matching";
import { JobWithMatch } from "@/lib/types";

function toJobWithMatch(
  job: (typeof DEMO_JOBS)[number],
  score: number,
): JobWithMatch {
  return {
    job,
    match: {
      jobId: job.id,
      score,
      matchedSkills: [],
      missingRequiredSkills: [],
      missingPreferredSkills: [],
      requiredSkillsMatched: 0,
      preferredSkillsMatched: 0,
      seniorityFit: true,
      locationFit: true,
      preferenceFit: true,
      hardFilterPassed: true,
      explanation: "",
      recommendation: "Good match",
      semanticScore: 0,
    },
    application: {
      jobId: job.id,
      status: "Saved",
      notes: "",
      updatedAt: new Date().toISOString(),
    },
  };
}

describe("preference filtering", () => {
  test("filters by source and minimum score", () => {
    const jobs: JobWithMatch[] = [
      toJobWithMatch(DEMO_JOBS[0], 88),
      toJobWithMatch(DEMO_JOBS[1], 55),
      toJobWithMatch(DEMO_JOBS[3], 72),
    ];

    const result = filterAndSortJobs(jobs, {
      minScore: 70,
      source: "Greenhouse demo",
      sortBy: "best-match",
    });

    expect(result).toHaveLength(1);
    expect(result[0].job.source).toBe("Greenhouse demo");
    expect(result[0].match.score).toBe(88);
  });

  test("sorts by newest when requested", () => {
    const jobs: JobWithMatch[] = [
      toJobWithMatch(DEMO_JOBS[5], 70),
      toJobWithMatch(DEMO_JOBS[0], 70),
      toJobWithMatch(DEMO_JOBS[3], 70),
    ];

    const result = filterAndSortJobs(jobs, {
      sortBy: "newest",
    });

    expect(new Date(result[0].job.postedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(result[1].job.postedAt).getTime(),
    );
  });
});
