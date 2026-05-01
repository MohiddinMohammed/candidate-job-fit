import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/http";
import { generateDocument, getDashboardData } from "@/lib/store";
import { documentGenerationSchema } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const body = await request.json();
    const parsed = documentGenerationSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid generation request", 400, parsed.error.flatten());
    }

    await generateDocument(params.jobId, parsed.data.type);
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to generate document",
      500,
    );
  }
}
