"use client";

import { Copy, FileText } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedDocument } from "@/lib/types";

interface GeneratedDocumentsProps {
  jobId: string;
  generatedDocuments: GeneratedDocument[];
  onGenerate: (type: "resume" | "cover-letter") => Promise<void>;
}

export function GeneratedDocuments({
  jobId,
  generatedDocuments,
  onGenerate,
}: GeneratedDocumentsProps) {
  const [busyType, setBusyType] = useState<"resume" | "cover-letter" | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const documentsForJob = generatedDocuments.filter(
    (doc) => doc.jobId === jobId,
  );
  const resume = documentsForJob.find((doc) => doc.type === "resume");
  const coverLetter = documentsForJob.find(
    (doc) => doc.type === "cover-letter",
  );

  const handleGenerate = async (type: "resume" | "cover-letter") => {
    setBusyType(type);
    try {
      await onGenerate(type);
    } finally {
      setBusyType(null);
    }
  };

  const copyText = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Tailored application materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleGenerate("resume")}
            disabled={busyType === "resume"}
            variant="secondary"
          >
            {busyType === "resume"
              ? "Generating..."
              : "Generate tailored resume"}
          </Button>
          <Button
            onClick={() => handleGenerate("cover-letter")}
            disabled={busyType === "cover-letter"}
            variant="secondary"
          >
            {busyType === "cover-letter"
              ? "Generating..."
              : "Generate cover letter"}
          </Button>
        </div>

        <p className="text-xs text-amber-700">
          Review before sending. The system should not invent experience or
          qualifications.
        </p>

        {resume ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Tailored resume draft</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyText(resume.content)}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea defaultValue={resume.content} rows={12} />
          </div>
        ) : null}

        {coverLetter ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Cover letter draft</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyText(coverLetter.content)}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea defaultValue={coverLetter.content} rows={12} />
          </div>
        ) : null}

        {!resume && !coverLetter ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            <FileText className="mx-auto mb-2 h-5 w-5" />
            Generate a tailored resume or cover letter to get started.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
