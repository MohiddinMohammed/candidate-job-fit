import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import { KNOWN_LANGUAGES, KNOWN_SKILLS } from "@/lib/constants";
import { CandidateProfile } from "@/lib/types";
import { cleanText, uniqNormalized } from "@/lib/utils";

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function detectEmail(text: string): string {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0] ?? "";
}

function detectPhone(text: string): string {
  const match = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/);
  return match?.[0] ?? "";
}

function detectName(text: string): string {
  const firstLine = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 2 && line.length < 80);

  if (!firstLine) return "";
  if (/resume|curriculum|profile/i.test(firstLine)) return "";

  return firstLine;
}

function detectLocation(text: string): string {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const candidate = lines.find(
    (line) =>
      /,/.test(line) && /(usa|uk|germany|india|remote|canada|eu)/i.test(line),
  );
  return candidate ?? "";
}

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const skills = KNOWN_SKILLS.filter((skill) =>
    lower.includes(skill.toLowerCase()),
  );
  return uniqNormalized(
    skills.map((skill) => skill.replace(/\b\w/g, (char) => char.toUpperCase())),
  );
}

function detectLanguages(text: string): string[] {
  const lower = text.toLowerCase();
  return KNOWN_LANGUAGES.filter((language) =>
    lower.includes(language.toLowerCase()),
  );
}

function detectYearsExperience(text: string): number {
  const match = text.match(/(\d{1,2})\+?\s+years?\s+(?:of\s+)?experience/i);
  if (match?.[1]) return Number(match[1]);

  const fallback = text.match(/experience\s*[:\-]?\s*(\d{1,2})/i);
  return fallback?.[1] ? Number(fallback[1]) : 0;
}

function detectLinesByKeyword(text: string, pattern: RegExp): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 4 && pattern.test(line));
}

function firstSentences(text: string, maxLength = 400): string {
  const collapsed = cleanText(text);
  return collapsed.slice(0, maxLength);
}

export function parseResumeText(text: string): CandidateProfile {
  const cleaned = text.replace(/\u0000/g, " ").replace(/\t/g, " ");

  const jobTitles = detectLinesByKeyword(
    cleaned,
    /(engineer|developer|architect|manager|analyst|consultant|designer)/i,
  );

  const education = detectLinesByKeyword(
    cleaned,
    /(university|college|b\.?sc|m\.?sc|bachelor|master|phd)/i,
  );

  const certifications = detectLinesByKeyword(
    cleaned,
    /(certified|certification|certificate|aws|azure)/i,
  );

  const projects = detectLinesByKeyword(
    cleaned,
    /(project|built|launched|developed)/i,
  ).slice(0, 8);

  const skills = detectSkills(cleaned);

  return {
    fullName: detectName(cleaned),
    email: detectEmail(cleaned),
    phone: detectPhone(cleaned),
    location: detectLocation(cleaned),
    jobTitles: uniqNormalized(jobTitles).slice(0, 10),
    skills,
    toolsAndTechnologies: skills,
    yearsOfExperience: detectYearsExperience(cleaned),
    education: uniqNormalized(education).slice(0, 8),
    certifications: uniqNormalized(certifications).slice(0, 8),
    languages: detectLanguages(cleaned),
    projects,
    summary: firstSentences(cleaned),
  };
}

export async function extractResumeText(
  fileName: string,
  mimeType: string,
  bytes: Buffer,
): Promise<string> {
  if (
    mimeType === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf")
  ) {
    const parser = new PDFParse({ data: bytes });
    const parsed = await parser.getText();
    await parser.destroy();
    return cleanText(parsed.text);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.toLowerCase().endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer: bytes });
    return cleanText(parsed.value);
  }

  throw new Error("Unsupported file type");
}
