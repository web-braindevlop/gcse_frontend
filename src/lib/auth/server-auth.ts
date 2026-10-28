import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

const SESSION_COOKIE = "educate_cloud_session";
const API_BASE_URL = (process.env.AUTH_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

export type ServerAuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: "student" | "teacher" | "admin";
};

export type ServerAuthResult =
  | { status: "authenticated"; user: ServerAuthUser }
  | { status: "unauthenticated" }
  | { status: "unavailable" };

export const getVerifiedUser = cache(async (): Promise<ServerAuthResult> => {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) return { status: "unauthenticated" };

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: { Cookie: `${SESSION_COOKIE}=${session}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (response.status === 401) return { status: "unauthenticated" };
    if (!response.ok) return { status: "unavailable" };

    const payload = (await response.json()) as { user?: ServerAuthUser };
    const user = payload.user;
    if (!user || !["student", "teacher", "admin"].includes(user.role)) return { status: "unavailable" };
    return { status: "authenticated", user };
  } catch {
    return { status: "unavailable" };
  }
});
