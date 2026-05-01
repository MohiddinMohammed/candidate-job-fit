import { describe, expect, it } from "vitest";

import { parseResumeText } from "@/lib/resume-parser";

describe("resume parser fallback logic", () => {
  it("extracts key profile fields from plain text", () => {
    const text = `
Alex Rivera
alex.rivera@example.com
+1 (415) 555-0101
San Francisco, USA
Senior Full Stack Engineer
8 years of experience
Skills: TypeScript, React, Next.js, Node.js, PostgreSQL, AWS
Education: Bachelor of Computer Science
Certification: AWS Certified Developer
Languages: English, Spanish
Project: Built developer analytics platform used by 15k teams
    `.trim();

    const parsed = parseResumeText(text);

    expect(parsed.fullName).toBe("Alex Rivera");
    expect(parsed.email).toBe("alex.rivera@example.com");
    expect(parsed.phone).toContain("415");
    expect(parsed.location).toContain("San Francisco");
    expect(parsed.yearsOfExperience).toBe(8);
    expect(parsed.skills).toEqual(
      expect.arrayContaining(["Typescript", "React", "Node.Js"]),
    );
  });

  it("returns safe defaults when text is sparse", () => {
    const parsed = parseResumeText("Engineer");

    expect(parsed.email).toBe("");
    expect(parsed.phone).toBe("");
    expect(parsed.skills).toEqual([]);
    expect(parsed.yearsOfExperience).toBe(0);
  });
});
