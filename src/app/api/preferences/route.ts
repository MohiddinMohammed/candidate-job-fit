import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/http";
import { getDashboardData, upsertPreferences } from "@/lib/store";
import { jobPreferenceSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = jobPreferenceSchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid preferences", 400, parsed.error.flatten());
    }

    await upsertPreferences(parsed.data);
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to save preferences",
      500,
    );
  }
}
