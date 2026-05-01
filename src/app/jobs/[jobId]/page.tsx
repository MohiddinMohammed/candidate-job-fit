"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ApplicationControls } from "@/components/dashboard/application-controls";
import { GeneratedDocuments } from "@/components/dashboard/generated-documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchDashboard,
  generateDocument,
  setApplicationStatus,
} from "@/lib/client-api";
import { DashboardData } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboard();
        if (!canceled) {
          setDashboard(data);
          setError(null);
        }
      } catch (err) {
        if (!canceled) {
          setError(
            err instanceof Error ? err.message : "Failed to load job details",
          );
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [refreshKey]);

  const selected = useMemo(() => {
    if (!dashboard) return null;
    return dashboard.jobs.find(({ job }) => job.id === params.jobId) ?? null;
  }, [dashboard, params.jobId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">Loading job details...</main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      </main>
    );
  }

  if (!selected) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Card>
          <CardContent className="space-y-4 py-8 text-sm text-slate-600">
            <p>Job not found. It may have been filtered out or removed.</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { job, match, application } = selected;

  const handleApplicationUpdate = async (
    status: typeof application.status,
    notes: string,
  ) => {
    await setApplicationStatus(job.id, { status, notes });
    setRefreshKey((current) => current + 1);
  };

  const handleDocumentGenerate = async (type: "resume" | "cover-letter") => {
    await generateDocument(job.id, type);
    setRefreshKey((current) => current + 1);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            Match analysis
            <Badge>{match.score}%</Badge>
            <Badge variant="secondary">{match.recommendation}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <p>{match.explanation}</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="font-semibold">Matched skills</p>
              <p>
                {match.matchedSkills.join(", ") || "No direct overlaps yet"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Missing required skills</p>
              <p>{match.missingRequiredSkills.join(", ") || "None"}</p>
            </div>
            <div>
              <p className="font-semibold">Missing preferred skills</p>
              <p>{match.missingPreferredSkills.join(", ") || "None"}</p>
            </div>
          </div>
          <p>
            Seniority fit: <strong>{match.seniorityFit ? "Yes" : "No"}</strong>{" "}
            · Location fit: <strong>{match.locationFit ? "Yes" : "No"}</strong>{" "}
            · Preference fit:{" "}
            <strong>{match.preferenceFit ? "Yes" : "No"}</strong>
          </p>
          <p>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold"
            >
              Open original job page
            </a>
          </p>
        </CardContent>
      </Card>

      <ApplicationControls
        application={application}
        onSave={handleApplicationUpdate}
      />

      <GeneratedDocuments
        jobId={job.id}
        generatedDocuments={dashboard?.generatedDocuments ?? []}
        onGenerate={handleDocumentGenerate}
      />
    </main>
  );
}
