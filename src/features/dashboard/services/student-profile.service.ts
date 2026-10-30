import { API_BASE_URL } from "@/lib/api/base-url";

export type ProfileOptions = {
  levels: string[];
  subjects: string[];
  examBoards: string[];
  schoolYears: string[];
  targetGrades: string[];
};

export type StudentLearningProfileInput = {
  level: "gcse" | "igcse_o_level" | "a_level";
  subject: string;
  examBoard: string;
  schoolYear: string;
  targetGrade: string;
  tier: "foundation" | "higher" | "not_sure" | null;
};

export type StudentLearningProfile = StudentLearningProfileInput & {
  studentId: string;
  updatedAt: string;
};

export class ProfileRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ProfileRequestError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ProfileRequestError("Profile features will be available after the API is connected.", 503);
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/students${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ProfileRequestError("We could not reach the profile service. Please try again.", 0);
  }
  const body = await response.json().catch(() => null) as { error?: { message?: string } } | T | null;
  if (!response.ok) {
    const message = body && typeof body === "object" && "error" in body ? body.error?.message : undefined;
    throw new ProfileRequestError(message ?? "Something went wrong. Please try again.", response.status);
  }
  return body as T;
}

export async function getProfileOptions(): Promise<{ options: ProfileOptions }> {
  return request<{ options: ProfileOptions }>("/profile-options");
}

export async function saveProfileOptions(options: ProfileOptions): Promise<{ options: ProfileOptions }> {
  return request<{ options: ProfileOptions }>("/profile-options", { method: "PUT", body: JSON.stringify(options) });
}

export async function getOwnProfile(): Promise<{ profile: StudentLearningProfile | null }> {
  return request<{ profile: StudentLearningProfile | null }>("/my-profile");
}

export async function saveOwnProfile(input: StudentLearningProfileInput): Promise<{ profile: StudentLearningProfile }> {
  return request<{ profile: StudentLearningProfile }>("/my-profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
