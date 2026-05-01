"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { ApplicationRecord, ApplicationStatus } from "@/lib/types";

interface ApplicationControlsProps {
  application: ApplicationRecord;
  onSave: (status: ApplicationStatus, notes: string) => Promise<void>;
}

export function ApplicationControls({
  application,
  onSave,
}: ApplicationControlsProps) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(status, notes);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application status",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Application status</label>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
        >
          {APPLICATION_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={6}
          placeholder="Add next steps, referral info, interview prep notes..."
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save application status"}
      </Button>
    </div>
  );
}
