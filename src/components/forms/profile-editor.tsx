"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CandidateProfile } from "@/lib/types";
import { splitCommaValues } from "@/lib/utils";

interface ProfileEditorProps {
  profile: CandidateProfile;
  onSave: (profile: CandidateProfile) => Promise<void>;
}

interface ProfileEditorValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience: number;
  summary: string;
  jobTitles: string;
  skills: string;
  toolsAndTechnologies: string;
  education: string;
  certifications: string;
  languages: string;
  projects: string;
}

export function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const form = useForm<ProfileEditorValues>({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      yearsOfExperience: profile.yearsOfExperience,
      summary: profile.summary,
      jobTitles: profile.jobTitles.join(", "),
      skills: profile.skills.join(", "),
      toolsAndTechnologies: profile.toolsAndTechnologies.join(", "),
      education: profile.education.join(", "),
      certifications: profile.certifications.join(", "),
      languages: profile.languages.join(", "),
      projects: profile.projects.join(", "),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSaved(false);
    setError(null);
    const payload: CandidateProfile = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      location: values.location,
      yearsOfExperience: Number(values.yearsOfExperience) || 0,
      summary: values.summary,
      jobTitles: splitCommaValues(values.jobTitles),
      skills: splitCommaValues(values.skills),
      toolsAndTechnologies: splitCommaValues(values.toolsAndTechnologies),
      education: splitCommaValues(values.education),
      certifications: splitCommaValues(values.certifications),
      languages: splitCommaValues(values.languages),
      projects: splitCommaValues(values.projects),
    };
    try {
      await onSave(payload);
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not save profile",
      );
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate profile</CardTitle>
        <CardDescription>
          Review and edit parsed resume details before matching.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" {...form.register("fullName")} />
            <Input placeholder="Email" {...form.register("email")} />
            <Input placeholder="Phone" {...form.register("phone")} />
            <Input placeholder="Location" {...form.register("location")} />
            <Input
              placeholder="Years of experience"
              type="number"
              {...form.register("yearsOfExperience", { valueAsNumber: true })}
            />
            <Input
              placeholder="Job titles (comma separated)"
              {...form.register("jobTitles")}
            />
          </div>
          <Input
            placeholder="Skills (comma separated)"
            {...form.register("skills")}
          />
          <Input
            placeholder="Tools and technologies (comma separated)"
            {...form.register("toolsAndTechnologies")}
          />
          <Input
            placeholder="Education (comma separated)"
            {...form.register("education")}
          />
          <Input
            placeholder="Certifications (comma separated)"
            {...form.register("certifications")}
          />
          <Input
            placeholder="Languages (comma separated)"
            {...form.register("languages")}
          />
          <Input
            placeholder="Projects (comma separated)"
            {...form.register("projects")}
          />
          <Textarea
            placeholder="Summary"
            rows={5}
            {...form.register("summary")}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {saved ? (
            <p className="text-sm text-emerald-700">Profile saved.</p>
          ) : null}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : "Save candidate profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
