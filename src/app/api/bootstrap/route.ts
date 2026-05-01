import { ensureSeedState } from "@/lib/seed-local-state";
import { getDashboardData } from "@/lib/store";
import { fail, ok } from "@/lib/http";

export async function POST() {
  try {
    await ensureSeedState();
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Failed to bootstrap dashboard state",
      500,
    );
  }
}
