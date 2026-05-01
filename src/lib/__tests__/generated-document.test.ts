import { beforeEach, describe, expect, it } from "vitest";

import { ensureSeedState } from "@/lib/seed-local-state";
import { generateDocument, getDashboardData, resetUserData } from "@/lib/store";

describe("generated document creation", () => {
  beforeEach(async () => {
    resetUserData();
    await ensureSeedState();
  });

  it("creates and stores resume and cover letter documents", async () => {
    const initial = getDashboardData();
    const jobId = initial.jobs[0]?.job.id;
    expect(jobId).toBeDefined();

    const resume = await generateDocument(jobId!, "resume");
    const coverLetter = await generateDocument(jobId!, "cover-letter");

    expect(resume.type).toBe("resume");
    expect(coverLetter.type).toBe("cover-letter");

    const dashboard = getDashboardData();
    const docs = dashboard.generatedDocuments.filter(
      (entry) => entry.jobId === jobId,
    );
    expect(docs.length).toBe(2);
  });
});
