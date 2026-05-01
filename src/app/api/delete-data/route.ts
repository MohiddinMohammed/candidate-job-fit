import { fail, ok } from "@/lib/http";
import { resetUserData, getDashboardData } from "@/lib/store";

export async function DELETE() {
  try {
    resetUserData();
    return ok(getDashboardData());
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Failed to delete user data",
      500,
    );
  }
}
