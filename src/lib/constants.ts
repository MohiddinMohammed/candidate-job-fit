import {
  CandidateProfile,
  EmploymentType,
  JobPreference,
  SeniorityLevel,
  WorkMode,
} from "@/lib/types";

export const KNOWN_SKILLS = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "node.js",
  "express",
  "nestjs",
  "python",
  "java",
  "go",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "graphql",
  "rest",
  "tailwind",
  "prisma",
  "ci/cd",
  "terraform",
  "machine learning",
  "pytorch",
  "tensorflow",
  "langchain",
  "nlp",
  "linux",
  "git",
  "testing",
  "vitest",
  "jest",
  "playwright",
  "figma",
  "product thinking",
];

export const KNOWN_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Arabic",
  "Mandarin",
  "Portuguese",
];

export const WORK_MODES: WorkMode[] = ["remote", "hybrid", "on-site"];
export const SENIORITY_LEVELS: SeniorityLevel[] = [
  "intern",
  "junior",
  "mid",
  "senior",
  "staff",
  "lead",
];
export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
];

export const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "Interviewing",
  "Rejected",
  "Offer",
] as const;

export const EMPTY_PROFILE: CandidateProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  jobTitles: [],
  skills: [],
  toolsAndTechnologies: [],
  yearsOfExperience: 0,
  education: [],
  certifications: [],
  languages: [],
  projects: [],
  summary: "",
};

export const EMPTY_PREFERENCES: JobPreference = {
  desiredJobTitles: ["Full Stack Developer"],
  preferredLocations: ["Remote", "San Francisco", "Berlin"],
  remotePreference: ["remote", "hybrid"],
  salaryExpectation: "",
  seniorityLevel: ["mid", "senior"],
  employmentTypes: ["full-time"],
  preferredIndustries: ["SaaS", "Fintech"],
  visaNotes: "",
  excludedKeywordsOrCompanies: [],
  preferredTechStack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
};

export const PRIVACY_NOTICE =
  "Resumes contain sensitive data. We only store what is necessary for matching and let you delete data at any time.";

export const LEGAL_NOTICE =
  "This platform helps users discover and evaluate jobs. Applications happen on the original employer or job platform page. The system does not automate restricted third-party platforms. Review all generated materials before applying.";
