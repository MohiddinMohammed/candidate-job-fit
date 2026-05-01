import { analyzeJobMatch } from "@/lib/matching";
import {
  CandidateProfile,
  JobMatchAnalysis,
  JobPreference,
  JobResult,
} from "@/lib/types";

export interface AiService {
  parseResume(text: string): Promise<CandidateProfile>;
  analyzeJobMatch(
    profile: CandidateProfile,
    job: JobResult,
    preferences: JobPreference,
  ): Promise<JobMatchAnalysis>;
  generateTailoredResume(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string>;
  generateCoverLetter(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string>;
}

export class MockAiService implements AiService {
  async parseResume(text: string): Promise<CandidateProfile> {
    const { parseResumeText } = await import("@/lib/resume-parser");
    return parseResumeText(text);
  }

  async analyzeJobMatch(
    profile: CandidateProfile,
    job: JobResult,
    preferences: JobPreference,
  ): Promise<JobMatchAnalysis> {
    return analyzeJobMatch(profile, job, preferences);
  }

  async generateTailoredResume(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string> {
    const topSkills = profile.skills.slice(0, 6).join(", ");
    return [
      `${profile.fullName || "Candidate"}`,
      `${profile.email}${profile.phone ? ` | ${profile.phone}` : ""}`,
      "",
      `Target Role: ${job.title} at ${job.company}`,
      "",
      "Professional Summary",
      `${
        profile.summary ||
        "Experienced professional with hands-on delivery across modern product teams."
      }`,
      "",
      "Relevant Skills",
      `${topSkills || "TypeScript, React, Node.js, Product Delivery"}`,
      "",
      "Highlights",
      `- Delivered production features aligned to ${job.title} responsibilities.`,
      `- Demonstrated strengths in ${job.requiredSkills.slice(0, 3).join(", ")}.`,
      "",
      "Review before sending. The system should not invent experience or qualifications.",
    ].join("\n");
  }

  async generateCoverLetter(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string> {
    return [
      `Dear Hiring Team at ${job.company},`,
      "",
      `I am excited to apply for the ${job.title} role. My background aligns with your requirements in ${job.requiredSkills.slice(0, 3).join(", ")}.`,
      "I have built customer-facing solutions and collaborated across product, design, and engineering to ship high-quality outcomes.",
      `I would welcome the opportunity to contribute to ${job.company} and support your goals in ${job.industry}.`,
      "",
      "Sincerely,",
      profile.fullName || "Candidate",
      "",
      "Review before sending. The system should not invent experience or qualifications.",
    ].join("\n");
  }
}

export class OpenAiService implements AiService {
  constructor(private readonly apiKey: string) {}

  async parseResume(text: string): Promise<CandidateProfile> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    const { parseResumeText } = await import("@/lib/resume-parser");
    return parseResumeText(text);
  }

  async analyzeJobMatch(
    profile: CandidateProfile,
    job: JobResult,
    preferences: JobPreference,
  ): Promise<JobMatchAnalysis> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    return analyzeJobMatch(profile, job, preferences);
  }

  async generateTailoredResume(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    return new MockAiService().generateTailoredResume(profile, job);
  }

  async generateCoverLetter(
    profile: CandidateProfile,
    job: JobResult,
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    return new MockAiService().generateCoverLetter(profile, job);
  }
}

export function getAiService(): AiService {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAiService(process.env.OPENAI_API_KEY);
  }

  return new MockAiService();
}
