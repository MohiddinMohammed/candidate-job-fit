"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ApplicationControls } from "@/components/dashboard/application-controls";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { GeneratedDocuments } from "@/components/dashboard/generated-documents";
import { JobList } from "@/components/dashboard/job-list";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { ManualJobForm } from "@/components/forms/manual-job-form";
import { PreferencesForm } from "@/components/forms/preferences-form";
import { ProfileEditor } from "@/components/forms/profile-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addManualJob,
  bootstrap,
  deleteData,
  discoverJobs,
  fetchDashboard,
  generateDocument,
  setApplicationStatus,
  updatePreferences,
  updateProfile,
} from "@/lib/client-api";
import { DashboardData, DashboardFilters, JobWithMatch } from "@/lib/types";

const defaultFilters: DashboardFilters = {
  minScore: 0,
  remoteType: "all",
  source: "all",
  seniority: "all",
  sortBy: "best-match",
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string>("");

  const loadDashboard = async (override?: DashboardFilters) => {
    const nextFilters = { ...filters, ...(override ?? {}) };
    const data = await fetchDashboard(nextFilters);
    setDashboard(data);
    setFilters(nextFilters);
    if (data.jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(data.jobs[0].job.id);
    }
  };

  useEffect(() => {
    async function setup() {
      try {
        setIsLoading(true);
        await bootstrap();
        const discovered = await discoverJobs();
        setDashboard(discovered);
        setSelectedJobId(discovered.jobs[0]?.job.id ?? "");
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedJob = useMemo<JobWithMatch | null>(() => {
    if (!dashboard) return null;
    const fallback = dashboard.jobs[0] ?? null;
    if (!selectedJobId) return fallback;
    return (
      dashboard.jobs.find((entry) => entry.job.id === selectedJobId) ?? fallback
    );
  }, [dashboard, selectedJobId]);

  const handleFilterChange = async (nextFilters: DashboardFilters) => {
    await loadDashboard(nextFilters);
  };

  const handleSaveProfile = async (profile: DashboardData["profile"]) => {
    await updateProfile(profile);
    await discoverJobs();
    await loadDashboard();
  };

  const handleSavePreferences = async (
    preferences: DashboardData["preferences"],
  ) => {
    await updatePreferences(preferences);
    await discoverJobs();
    await loadDashboard();
  };

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      await discoverJobs();
      await loadDashboard();
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleManualJobSubmit = async (
    payload: Parameters<typeof addManualJob>[0],
  ) => {
    await addManualJob(payload);
    await discoverJobs();
    await loadDashboard();
  };

  const handleApplicationUpdate = async (
    status: "Saved" | "Applied" | "Interviewing" | "Rejected" | "Offer",
    notes: string,
  ) => {
    if (!selectedJob) return;
    await setApplicationStatus(selectedJob.job.id, { status, notes });
    await loadDashboard();
  };

  const handleGenerateDocument = async (type: "resume" | "cover-letter") => {
    if (!selectedJob) return;
    await generateDocument(selectedJob.job.id, type);
    await loadDashboard();
  };

  const handleDeleteData = async () => {
    await deleteData();
    await loadDashboard(defaultFilters);
  };

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <Card>
          <CardContent className="py-10 text-sm text-slate-600">
            Loading dashboard...
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">
              Dashboard unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-red-700">
            <p>{error || "Unable to load dashboard data."}</p>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Demo dashboard</h1>
          <p className="text-sm text-slate-600">
            Review resume parsing, set preferences, and track your application
            funnel.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDiscover} disabled={isDiscovering}>
            {isDiscovering ? "Refreshing jobs..." : "Discover jobs"}
          </Button>
          <Button variant="outline" onClick={handleDeleteData}>
            Delete my data (demo)
          </Button>
          <Link href="/">
            <Button variant="ghost">Landing page</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <ProfileCard
            profile={dashboard.profile}
            resumeMeta={dashboard.resumeMeta}
            privacyNotice={dashboard.privacyNotice}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-slate-700">
                  Desired titles:
                </span>{" "}
                {dashboard.preferences.desiredJobTitles.join(", ") || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Locations:</span>{" "}
                {dashboard.preferences.preferredLocations.join(", ") ||
                  "Not set"}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Work mode:</span>{" "}
                {dashboard.preferences.remotePreference.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-slate-700">
                  Industries:
                </span>{" "}
                {dashboard.preferences.preferredIndustries.join(", ") ||
                  "Not set"}
              </p>
              <p className="text-xs text-slate-500">{dashboard.legalNotice}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card id="resume">
            <CardHeader>
              <CardTitle className="text-lg">
                Review and edit candidate profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditor
                profile={dashboard.profile}
                onSave={handleSaveProfile}
              />
            </CardContent>
          </Card>

          <PreferencesForm
            preferences={dashboard.preferences}
            onSave={handleSavePreferences}
          />
          <ManualJobForm
            onCreated={() => {
              void handleDiscover();
            }}
          />

          <FilterBar filters={filters} onChange={handleFilterChange} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
            <JobList
              jobs={dashboard.jobs}
              selectedJobId={selectedJob?.job.id}
              onSelect={setSelectedJobId}
            />

            {selectedJob ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle>{selectedJob.job.title}</CardTitle>
                      <Badge variant="secondary">
                        {selectedJob.match.recommendation}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {selectedJob.job.company} · {selectedJob.job.location}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        Score: {selectedJob.match.score}
                      </Badge>
                      <Badge variant="outline">
                        {selectedJob.job.remoteType}
                      </Badge>
                      <Badge variant="outline">
                        {selectedJob.job.seniority}
                      </Badge>
                      <Badge variant="outline">{selectedJob.job.source}</Badge>
                    </div>
                    <p>{selectedJob.job.description}</p>
                    {selectedJob.job.snippet ? (
                      <p className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                        Snippet-only source: {selectedJob.job.snippet}
                      </p>
                    ) : null}
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold text-slate-700">
                          Matched skills:
                        </span>{" "}
                        {selectedJob.match.matchedSkills.join(", ") ||
                          "None yet"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">
                          Missing required:
                        </span>{" "}
                        {selectedJob.match.missingRequiredSkills.join(", ") ||
                          "None"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">
                          Missing preferred:
                        </span>{" "}
                        {selectedJob.match.missingPreferredSkills.join(", ") ||
                          "None"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">
                          Why this score:
                        </span>{" "}
                        {selectedJob.match.explanation}
                      </p>
                    </div>
                    <a
                      href={selectedJob.job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full">Open original job page</Button>
                    </a>
                    <p className="text-xs text-slate-500">
                      Applications happen on the original employer or job
                      platform page.
                    </p>
                  </CardContent>
                </Card>

                <ApplicationControls
                  application={selectedJob.application}
                  onSave={handleApplicationUpdate}
                />

                <GeneratedDocuments
                  jobId={selectedJob.job.id}
                  generatedDocuments={dashboard.generatedDocuments}
                  onGenerate={handleGenerateDocument}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-sm text-slate-500">
                  No jobs available yet. Discover jobs or add a manual job.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
