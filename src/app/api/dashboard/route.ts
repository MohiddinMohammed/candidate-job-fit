import { dashboardFilterSchema } from "@/lib/validation";
import { getDashboardData } from "@/lib/store";
import { fail, ok } from "@/lib/http";

function parseNumber(value: string | null) {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = dashboardFilterSchema.safeParse({
    minScore: parseNumber(url.searchParams.get("minScore")),
    remoteType: url.searchParams.get("remoteType") ?? undefined,
    source: url.searchParams.get("source") ?? undefined,
    seniority: url.searchParams.get("seniority") ?? undefined,
    sortBy: url.searchParams.get("sortBy") ?? undefined,
  });

  if (!parsed.success) {
    return fail("Invalid dashboard filters", 400, parsed.error.flatten());
  }

  const data = getDashboardData(parsed.data);
  return ok(data);
}
