import { beforeEach, describe, expect, it } from "vitest";

import { ensureSeedState } from "@/lib/seed-local-state";
import {
  getDashboardData,
  resetUserData,
  updateApplication,
} from "@/lib/store";

describe("application status updates", () => {
  beforeEach(async () => {
    resetUserData();
    await ensureSeedState();
  });

  it("updates job application status and notes", () => {
    const first = getDashboardData().jobs[0];
    expect(first).toBeDefined();

    updateApplication(
      first.job.id,
      "Interviewing",
      "Technical interview scheduled",
    );

    const updated = getDashboardData().jobs.find(
      (job) => job.job.id === first.job.id,
    );
    expect(updated?.application.status).toBe("Interviewing");
    expect(updated?.application.notes).toContain("Technical interview");
  });
});
