import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getAiService } from "@/lib/ai-service";
import {
  ALLOWED_MIME_TYPES,
  extractResumeText,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/lib/resume-parser";
import {
  discoverJobs,
  getDashboardData,
  setResumeMeta,
  upsertProfile,
} from "@/lib/store";
import { fail, ok } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const textInput = formData.get("resumeText");

    let extractedText = "";
    let fileName = "resume-text-input.txt";
    let mimeType = "text/plain";
    let sizeBytes = 0;

    if (typeof textInput === "string" && textInput.trim().length > 0) {
      extractedText = textInput.trim();
      sizeBytes = Buffer.byteLength(extractedText, "utf8");
    } else if (file instanceof File) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return fail("Only PDF and DOCX uploads are supported.");
      }

      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        return fail("File is too large. Maximum upload size is 5MB.");
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      extractedText = await extractResumeText(file.name, file.type, buffer);
      fileName = file.name;
      mimeType = file.type;
      sizeBytes = file.size;
    } else {
      return fail("Upload a resume file or paste resume text.");
    }

    const parsedProfile = await getAiService().parseResume(extractedText);
    await upsertProfile(parsedProfile);
    setResumeMeta({
      id: randomUUID(),
      fileName,
      mimeType,
      sizeBytes,
      uploadedAt: new Date().toISOString(),
    });

    await discoverJobs();
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to parse resume input.",
      500,
    );
  }
}
