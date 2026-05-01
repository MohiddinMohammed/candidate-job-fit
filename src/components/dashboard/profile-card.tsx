"use client";

import { CandidateProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({
  profile,
  resumeMeta,
  privacyNotice,
}: {
  profile: CandidateProfile;
  resumeMeta: { fileName: string; uploadedAt: string } | null;
  privacyNotice: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-700">
        <div className="space-y-0.5">
          <p className="text-base font-semibold text-slate-900">
            {profile.fullName || "No name yet"}
          </p>
          <p>{profile.email || "No email"}</p>
          <p>{profile.location || "No location"}</p>
        </div>
        {resumeMeta ? (
          <p className="text-xs text-slate-500">
            Resume uploaded: {resumeMeta.fileName} (
            {new Date(resumeMeta.uploadedAt).toLocaleDateString()})
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            No resume uploaded yet. You can upload a PDF or DOCX.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {profile.skills.length === 0 ? (
            <p className="text-slate-500">No skills parsed yet.</p>
          ) : (
            profile.skills
              .slice(0, 10)
              .map((skill) => <Badge key={skill}>{skill}</Badge>)
          )}
        </div>
        <p className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
          {privacyNotice}
        </p>
      </CardContent>
    </Card>
  );
}
