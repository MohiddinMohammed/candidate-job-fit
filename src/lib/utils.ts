import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCommaValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function cleanText(value: string): string {
  return value
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      output.push(normalized);
    }
  }

  return output;
}
