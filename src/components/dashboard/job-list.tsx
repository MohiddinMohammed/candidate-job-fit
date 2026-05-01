"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobWithMatch } from "@/lib/types";

interface JobListProps {
  jobs: JobWithMatch[];
  selectedJobId?: string;
  onSelect?: (jobId: string) => void;
}

export function JobList({ jobs, selectedJobId, onSelect }: JobListProps) {
  if (!jobs.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No jobs found</CardTitle>
          <CardDescription>
            Adjust your filters or update profile/preferences to widen
            discovery.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map(({ job, match, application }) => (
        <Card
          key={job.id}
          className={
            job.id === selectedJobId
              ? "border-blue-300 ring-1 ring-blue-200"
              : ""
          }
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription>
                {job.company} · {job.location} · {job.remoteType}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{match.score}% match</Badge>
              <Badge variant="secondary">{match.recommendation}</Badge>
              <Badge variant="secondary">Status: {application.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>{match.explanation}</p>
            <div className="flex flex-wrap gap-2">
              {match.matchedSkills.slice(0, 6).map((skill) => (
                <Badge variant="outline" key={`${job.id}-${skill}`}>
                  {skill}
                </Badge>
              ))}
            </div>
            {!!match.missingRequiredSkills.length && (
              <p className="text-amber-700">
                Missing required: {match.missingRequiredSkills.join(", ")}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onSelect?.(job.id)}
                className="font-medium text-blue-700 hover:text-blue-600"
              >
                Preview
              </button>
              <Link
                href={`/jobs/${job.id}`}
                className="font-medium text-blue-700 hover:text-blue-600"
              >
                View details
              </Link>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-600"
              >
                Open application page <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
