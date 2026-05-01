import { fail, ok } from "@/lib/http";
import { addManualJob, discoverJobs, getDashboardData } from "@/lib/store";
import { manualJobSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = manualJobSchema.parse(payload);

    addManualJob(validated);
    await discoverJobs();
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to save manual job",
    );
  }
}
