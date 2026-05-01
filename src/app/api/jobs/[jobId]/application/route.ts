import { NextRequest } from "next/server";

import { getDashboardData, updateApplication } from "@/lib/store";
import { fail, ok } from "@/lib/http";
import { applicationUpdateSchema } from "@/lib/validation";

interface Params {
  params: { jobId: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const json = await request.json();
    const parsed = applicationUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return fail(
        "Invalid application update payload",
        400,
        parsed.error.flatten(),
      );
    }

    updateApplication(params.jobId, parsed.data.status, parsed.data.notes);
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Failed to update application status",
      500,
    );
  }
}
