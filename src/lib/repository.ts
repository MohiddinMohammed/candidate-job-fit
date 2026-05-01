import type { PrismaClient } from ".prisma/client";

import { getPrismaClient } from "@/lib/prisma";
import {
  CandidateProfile,
  GeneratedDocument,
  JobPreference,
} from "@/lib/types";

const DEMO_USER_EMAIL = "demo@jobfit.local";
const DEMO_USER_NAME = "Demo User";

export interface Repository {
  saveProfile(profile: CandidateProfile): Promise<void>;
  savePreferences(preferences: JobPreference): Promise<void>;
  saveGeneratedDocument(document: GeneratedDocument): Promise<void>;
}

const toPrismaWorkMode = (mode: "remote" | "hybrid" | "on-site") =>
  mode === "on-site" ? "on_site" : mode;

const toPrismaEmploymentType = (
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance",
) => {
  if (type === "full-time") return "full_time";
  if (type === "part-time") return "part_time";
  return type;
};

class PrismaRepository implements Repository {
  constructor(private readonly client: PrismaClient) {}

  private async ensureUserId() {
    const user = await this.client.user.upsert({
      where: { email: DEMO_USER_EMAIL },
      update: { name: DEMO_USER_NAME },
      create: { email: DEMO_USER_EMAIL, name: DEMO_USER_NAME },
      select: { id: true },
    });
    return user.id;
  }

  async saveProfile(profile: CandidateProfile): Promise<void> {
    const userId = await this.ensureUserId();

    await this.client.candidateProfile.upsert({
      where: { userId },
      update: profile,
      create: { userId, ...profile },
    });
  }

  async savePreferences(preferences: JobPreference): Promise<void> {
    const userId = await this.ensureUserId();

    const mapped = {
      ...preferences,
      remotePreference: preferences.remotePreference.map(toPrismaWorkMode),
      employmentTypes: preferences.employmentTypes.map(toPrismaEmploymentType),
      seniorityLevel: preferences.seniorityLevel,
    };

    await this.client.jobPreference.upsert({
      where: { userId },
      update: mapped,
      create: { userId, ...mapped },
    });
  }

  async saveGeneratedDocument(document: GeneratedDocument): Promise<void> {
    const userId = await this.ensureUserId();
    const linkedJob = await this.client.job.findUnique({
      where: { id: document.jobId },
      select: { id: true },
    });

    if (!linkedJob) return;

    await this.client.generatedDocument.create({
      data: {
        userId,
        jobId: linkedJob.id,
        type: document.type === "cover-letter" ? "cover_letter" : "resume",
        content: document.content,
      },
    });
  }
}

class NoopRepository implements Repository {
  async saveProfile(): Promise<void> {}
  async savePreferences(): Promise<void> {}
  async saveGeneratedDocument(): Promise<void> {}
}

export function getRepository(): Repository {
  if (!process.env.DATABASE_URL) {
    return new NoopRepository();
  }
  return new PrismaRepository(getPrismaClient());
}
