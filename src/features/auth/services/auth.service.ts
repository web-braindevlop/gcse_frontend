export type LoginAudience = "student" | "staff";
export type UserRole = "student" | "teacher" | "admin";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
};

type AuthResponse = { user: AuthUser };

export class AuthRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AuthRequestError";
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new AuthRequestError("We could not reach the sign-in service. Check that the API is running and try again.", 0);
  }

  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => null)) as { user?: AuthUser; error?: { message?: string } } | null;
  if (!response.ok) {
    throw new AuthRequestError(body?.error?.message ?? "Something went wrong. Please try again.", response.status);
  }
  return body as T;
}

export async function login(identifier: string, password: string, audience: LoginAudience = "student") {
  return request<AuthResponse>(`/api/auth/login/${audience}`, {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function registerAccount(input: { displayName: string; email: string; password: string }) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return request<AuthResponse>("/api/auth/me", { method: "GET", headers: {} });
}

export async function logout() {
  return request<void>("/api/auth/logout", { method: "POST" });
}
