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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EMPLOYMENT_TYPES,
  SENIORITY_LEVELS,
  WORK_MODES,
} from "@/lib/constants";
import { addManualJob } from "@/lib/client-api";
import { splitCommaValues } from "@/lib/utils";

interface ManualJobFormValues {
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
  requiredSkills: string;
  preferredSkills: string;
}

const defaultValues: ManualJobFormValues = {
  title: "",
  company: "",
  location: "",
  remoteType: "remote",
  seniority: "mid",
  employmentType: "full-time",
  industry: "Software",
  applyUrl: "",
  description: "",
  requiredSkills: "",
  preferredSkills: "",
};

export function ManualJobForm({ onCreated }: { onCreated?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<ManualJobFormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setError("");

    try {
      await addManualJob({
        ...values,
        requiredSkills: splitCommaValues(values.requiredSkills),
        preferredSkills: splitCommaValues(values.preferredSkills),
      });
      reset(defaultValues);
      onCreated?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to add manual job.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Job Entry</CardTitle>
        <CardDescription>
          Paste a public job URL and description to analyze restricted pages
          safely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Job title" {...register("title")} />
            <Input placeholder="Company" {...register("company")} />
            <Input placeholder="Location" {...register("location")} />
            <Input placeholder="Industry" {...register("industry")} />
            <Input
              placeholder="Apply URL"
              {...register("applyUrl", { required: true })}
            />
            <Select {...register("remoteType")}>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </Select>
            <Select {...register("seniority")}>
              {SENIORITY_LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select {...register("employmentType")}>
              {EMPLOYMENT_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <Textarea
            rows={5}
            placeholder="Paste full job description for deeper matching"
            {...register("description")}
          />
          <Input
            placeholder="Required skills (comma-separated)"
            {...register("requiredSkills")}
          />
          <Input
            placeholder="Preferred skills (comma-separated)"
            {...register("preferredSkills")}
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add manual job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
