import {
  CandidateProfile,
  DashboardData,
  DashboardFilters,
  JobPreference,
} from "@/lib/types";

interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as ApiResult<T>;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function bootstrap(): Promise<DashboardData> {
  return request<DashboardData>("/api/bootstrap", { method: "POST" });
}

export async function uploadResume(file: File): Promise<DashboardData> {
  const formData = new FormData();
  formData.append("file", file);
  return request<DashboardData>("/api/resume", {
    method: "POST",
    body: formData,
  });
}

export async function updateProfile(
  profile: CandidateProfile,
): Promise<DashboardData> {
  return request<DashboardData>("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}

export async function updatePreferences(
  preferences: JobPreference,
): Promise<DashboardData> {
  return request<DashboardData>("/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
}

export async function discoverJobs(): Promise<DashboardData> {
  return request<DashboardData>("/api/jobs/discover", { method: "POST" });
}

export async function addManualJob(payload: {
  title: string;
  company: string;
  location: string;
  remoteType: "remote" | "hybrid" | "on-site";
  seniority: "intern" | "junior" | "mid" | "senior" | "staff" | "lead";
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "freelance";
  industry: string;
  applyUrl: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
}): Promise<DashboardData> {
  return request<DashboardData>("/api/jobs/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function setApplicationStatus(
  jobId: string,
  payload: {
    status: "Saved" | "Applied" | "Interviewing" | "Rejected" | "Offer";
    notes: string;
  },
): Promise<DashboardData> {
  return request<DashboardData>(`/api/jobs/${jobId}/application`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function generateDocument(
  jobId: string,
  type: "resume" | "cover-letter",
): Promise<DashboardData> {
  return request<DashboardData>(`/api/jobs/${jobId}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
}

export async function fetchDashboard(
  filters: DashboardFilters = {},
): Promise<DashboardData> {
  const query = new URLSearchParams();
  if (filters.minScore !== undefined)
    query.set("minScore", String(filters.minScore));
  if (filters.remoteType) query.set("remoteType", filters.remoteType);
  if (filters.source) query.set("source", filters.source);
  if (filters.seniority) query.set("seniority", filters.seniority);
  if (filters.sortBy) query.set("sortBy", filters.sortBy);
  const suffix = query.size ? `?${query.toString()}` : "";
  return request<DashboardData>(`/api/dashboard${suffix}`);
}

export async function deleteData(): Promise<DashboardData> {
  return request<DashboardData>("/api/delete-data", { method: "POST" });
}
