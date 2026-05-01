import { NextResponse } from "next/server";

export function ok<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export const apiOk = ok;
export const apiError = fail;
export const jsonOk = ok;
export const jsonError = fail;
export const jsonBadRequest = (message: string, details?: unknown) =>
  fail(message, 400, details);
export const badRequest = jsonBadRequest;
export const internalError = (message: string, details?: unknown) =>
  fail(message, 500, details);
export const successJson = ok;
export const errorJson = fail;
