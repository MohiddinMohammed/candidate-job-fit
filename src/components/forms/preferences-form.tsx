"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  EMPLOYMENT_TYPES,
  SENIORITY_LEVELS,
  WORK_MODES,
} from "@/lib/constants";
import { splitCommaValues } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JobPreference } from "@/lib/types";

interface PreferencesFormFields {
  desiredJobTitles: string;
  preferredLocations: string;
  salaryExpectation: string;
  preferredIndustries: string;
  visaNotes: string;
  excludedKeywordsOrCompanies: string;
  preferredTechStack: string;
  remotePreference: JobPreference["remotePreference"];
  seniorityLevel: JobPreference["seniorityLevel"];
  employmentTypes: JobPreference["employmentTypes"];
}

interface PreferencesFormProps {
  preferences: JobPreference;
  onSave: (preferences: JobPreference) => Promise<void>;
}

export function PreferencesForm({ preferences, onSave }: PreferencesFormProps) {
  const [message, setMessage] = useState<string>("");

  const defaults = useMemo<PreferencesFormFields>(
    () => ({
      desiredJobTitles: preferences.desiredJobTitles.join(", "),
      preferredLocations: preferences.preferredLocations.join(", "),
      salaryExpectation: preferences.salaryExpectation,
      preferredIndustries: preferences.preferredIndustries.join(", "),
      visaNotes: preferences.visaNotes,
      excludedKeywordsOrCompanies:
        preferences.excludedKeywordsOrCompanies.join(", "),
      preferredTechStack: preferences.preferredTechStack.join(", "),
      remotePreference: preferences.remotePreference,
      seniorityLevel: preferences.seniorityLevel,
      employmentTypes: preferences.employmentTypes,
    }),
    [preferences],
  );

  const { register, handleSubmit, formState } = useForm<PreferencesFormFields>({
    defaultValues: defaults,
  });

  const submit = handleSubmit(async (value) => {
    setMessage("");
    try {
      await onSave({
        desiredJobTitles: splitCommaValues(value.desiredJobTitles),
        preferredLocations: splitCommaValues(value.preferredLocations),
        remotePreference: value.remotePreference,
        salaryExpectation: value.salaryExpectation.trim(),
        seniorityLevel: value.seniorityLevel,
        employmentTypes: value.employmentTypes,
        preferredIndustries: splitCommaValues(value.preferredIndustries),
        visaNotes: value.visaNotes.trim(),
        excludedKeywordsOrCompanies: splitCommaValues(
          value.excludedKeywordsOrCompanies,
        ),
        preferredTechStack: splitCommaValues(value.preferredTechStack),
      });
      setMessage("Preferences saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save preferences.",
      );
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job preferences</CardTitle>
        <CardDescription>
          Define role, location, and hiring constraints used in hard filters and
          scoring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <Input
            {...register("desiredJobTitles")}
            placeholder="Desired job titles (comma-separated)"
          />
          <Input
            {...register("preferredLocations")}
            placeholder="Preferred locations (comma-separated)"
          />
          <Input
            {...register("salaryExpectation")}
            placeholder="Salary expectation (example: $130k - $170k)"
          />
          <Input
            {...register("preferredIndustries")}
            placeholder="Preferred industries (comma-separated)"
          />
          <Input
            {...register("visaNotes")}
            placeholder="Visa/work authorization notes"
          />
          <Input
            {...register("excludedKeywordsOrCompanies")}
            placeholder="Excluded companies or keywords"
          />
          <Input
            {...register("preferredTechStack")}
            placeholder="Preferred tech stack"
          />

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">
              Remote/hybrid/on-site
            </legend>
            <div className="flex flex-wrap gap-4">
              {WORK_MODES.map((mode) => (
                <label
                  className="flex items-center gap-2 text-sm text-slate-700"
                  key={mode}
                >
                  <input
                    type="checkbox"
                    value={mode}
                    {...register("remotePreference")}
                  />
                  <span className="capitalize">{mode}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">
              Seniority
            </legend>
            <div className="flex flex-wrap gap-4">
              {SENIORITY_LEVELS.map((level) => (
                <label
                  className="flex items-center gap-2 text-sm text-slate-700"
                  key={level}
                >
                  <input
                    type="checkbox"
                    value={level}
                    {...register("seniorityLevel")}
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">
              Employment types
            </legend>
            <div className="flex flex-wrap gap-4">
              {EMPLOYMENT_TYPES.map((type) => (
                <label
                  className="flex items-center gap-2 text-sm text-slate-700"
                  key={type}
                >
                  <input
                    type="checkbox"
                    value={type}
                    {...register("employmentTypes")}
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <Button disabled={formState.isSubmitting} type="submit">
            {formState.isSubmitting ? "Saving..." : "Save preferences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
