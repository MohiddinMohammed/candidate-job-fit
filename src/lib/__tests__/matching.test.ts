import { describe, expect, it } from "vitest";

import { analyzeJobMatch, filterAndSortJobs } from "@/lib/matching";
import { EMPTY_PREFERENCES, EMPTY_PROFILE } from "@/lib/constants";
import { DEMO_JOBS } from "@/lib/demo-jobs";
import { JobWithMatch } from "@/lib/types";

describe("job matching score calculation", () => {
  it("scores strong profile/job overlap higher than weak overlap", () => {
    const job = DEMO_JOBS[0];
    const strongProfile = {
      ...EMPTY_PROFILE,
      skills: [...job.requiredSkills, ...job.preferredSkills],
      toolsAndTechnologies: [],
    };
    const weakProfile = {
      ...EMPTY_PROFILE,
      skills: ["communication"],
      toolsAndTechnologies: [],
    };

    const strong = analyzeJobMatch(strongProfile, job, EMPTY_PREFERENCES);
    const weak = analyzeJobMatch(weakProfile, job, EMPTY_PREFERENCES);

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.recommendation).not.toBe("Weak match");
  });
});

describe("preference filtering", () => {
  it("filters by min score and remote type", () => {
    const jobsWithMatch: JobWithMatch[] = DEMO_JOBS.slice(0, 3).map(
      (job, index) => ({
        job,
        match: {
          jobId: job.id,
          score: [95, 70, 40][index] ?? 0,
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
      }),
    );

    const filtered = filterAndSortJobs(jobsWithMatch, {
      minScore: 60,
      remoteType: "remote",
      sortBy: "best-match",
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].job.remoteType).toBe("remote");
    expect(filtered[0].match.score).toBeGreaterThanOrEqual(60);
  });
});
