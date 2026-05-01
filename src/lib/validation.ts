import { z } from "zod";

const workModeSchema = z.enum(["remote", "hybrid", "on-site"]);
const senioritySchema = z.enum([
  "intern",
  "junior",
  "mid",
  "senior",
  "staff",
  "lead",
]);
const employmentTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);

export const candidateProfileSchema = z.object({
  fullName: z.string().max(120),
  email: z.string().email().or(z.literal("")),
  phone: z.string().max(50),
  location: z.string().max(120),
  jobTitles: z.array(z.string().max(120)),
  skills: z.array(z.string().max(80)),
  toolsAndTechnologies: z.array(z.string().max(80)),
  yearsOfExperience: z.number().min(0).max(60),
  education: z.array(z.string().max(200)),
  certifications: z.array(z.string().max(200)),
  languages: z.array(z.string().max(100)),
  projects: z.array(z.string().max(200)),
  summary: z.string().max(1200),
});

export const jobPreferenceSchema = z.object({
  desiredJobTitles: z.array(z.string().max(120)),
  preferredLocations: z.array(z.string().max(120)),
  remotePreference: z.array(workModeSchema),
  salaryExpectation: z.string().max(100),
  seniorityLevel: z.array(senioritySchema),
  employmentTypes: z.array(employmentTypeSchema),
  preferredIndustries: z.array(z.string().max(120)),
  visaNotes: z.string().max(400),
  excludedKeywordsOrCompanies: z.array(z.string().max(120)),
  preferredTechStack: z.array(z.string().max(120)),
});

export const dashboardFilterSchema = z.object({
  minScore: z.number().min(0).max(100).optional(),
  remoteType: z.enum(["remote", "hybrid", "on-site", "all"]).optional(),
  source: z
    .enum([
      "Greenhouse demo",
      "Lever demo",
      "Company Careers demo",
      "Search Result demo",
      "Manual Entry demo",
      "all",
    ])
    .optional(),
  seniority: z
    .enum(["intern", "junior", "mid", "senior", "staff", "lead", "all"])
    .optional(),
  sortBy: z.enum(["best-match", "newest", "company"]).optional(),
});

export const manualJobSchema = z.object({
  title: z.string().min(2).max(120),
  company: z.string().min(2).max(120),
  location: z.string().min(2).max(120),
  remoteType: workModeSchema,
  seniority: senioritySchema,
  employmentType: employmentTypeSchema,
  industry: z.string().min(2).max(100),
  applyUrl: z.string().url(),
  description: z.string().min(40).max(8000),
  requiredSkills: z.array(z.string().max(80)),
  preferredSkills: z.array(z.string().max(80)),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(["Saved", "Applied", "Interviewing", "Rejected", "Offer"]),
  notes: z.string().max(4000),
});

export const documentGenerationSchema = z.object({
  type: z.enum(["resume", "cover-letter"]),
});
