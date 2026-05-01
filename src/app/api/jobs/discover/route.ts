import { discoverJobs, getDashboardData } from "@/lib/store";
import { fail, ok } from "@/lib/http";

export async function POST() {
  try {
    await discoverJobs();
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to discover jobs",
      500,
    );
  }
}
