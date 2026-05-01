import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/http";
import { upsertProfile } from "@/lib/store";
import { candidateProfileSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const parsed = candidateProfileSchema.safeParse(await request.json());
    if (!parsed.success) {
      return fail("Invalid profile payload", 400, parsed.error.flatten());
    }

    await upsertProfile(parsed.data);
    return ok({ saved: true });
  } catch (error) {
    return fail("Failed to update profile", 500, String(error));
  }
}
