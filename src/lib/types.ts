export type WorkMode = "remote" | "hybrid" | "on-site";

export type SeniorityLevel =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "lead";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

export type JobSource =
  | "Greenhouse demo"
  | "Lever demo"
  | "Company Careers demo"
  | "Search Result demo"
  | "Manual Entry demo";

export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Interviewing"
  | "Rejected"
  | "Offer";

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobTitles: string[];
  skills: string[];
  toolsAndTechnologies: string[];
  yearsOfExperience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  projects: string[];
  summary: string;
}

export interface JobPreference {
  desiredJobTitles: string[];
  preferredLocations: string[];
  remotePreference: WorkMode[];
  salaryExpectation: string;
  seniorityLevel: SeniorityLevel[];
  employmentTypes: EmploymentType[];
  preferredIndustries: string[];
  visaNotes: string;
  excludedKeywordsOrCompanies: string[];
  preferredTechStack: string[];
}

export interface ResumeMeta {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  remoteType: WorkMode;
  seniority: SeniorityLevel;
  employmentType: EmploymentType;
  industry: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  applyUrl: string;
  source: JobSource;
  postedAt: string;
  snippet?: string;
}

export interface JobMatchAnalysis {
  jobId: string;
  score: number;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  requiredSkillsMatched: number;
  preferredSkillsMatched: number;
  seniorityFit: boolean;
  locationFit: boolean;
  preferenceFit: boolean;
  hardFilterPassed: boolean;
  explanation: string;
  recommendation: "Strong match" | "Good match" | "Stretch role" | "Weak match";
  semanticScore: number;
}

export interface ApplicationRecord {
  jobId: string;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
}

export interface JobWithMatch {
  job: JobResult;
  match: JobMatchAnalysis;
  application: ApplicationRecord;
}

export interface GeneratedDocument {
  id: string;
  jobId: string;
  type: "resume" | "cover-letter";
  content: string;
  createdAt: string;
}

export interface DashboardFilters {
  minScore?: number;
  remoteType?: WorkMode | "all";
  source?: JobSource | "all";
  seniority?: SeniorityLevel | "all";
  sortBy?: "best-match" | "newest" | "company";
}

export interface DashboardData {
  resumeMeta: ResumeMeta | null;
  profile: CandidateProfile;
  preferences: JobPreference;
  jobs: JobWithMatch[];
  generatedDocuments: GeneratedDocument[];
  legalNotice: string;
  privacyNotice: string;
}
