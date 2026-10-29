import { API_BASE_URL } from "@/lib/api/base-url";

export type StudentRecord = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  joinedAt: string;
  hasLearningProfile: boolean;
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

export type StudentsPage = { items: StudentRecord[]; total: number; page: number; pageSize: number };

export class StudentsRequestError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "StudentsRequestError"; }
}

export async function getStudents(query: string, page: number): Promise<StudentsPage> {
  if (!API_BASE_URL) {
    throw new StudentsRequestError("The student directory will be available after the API is connected.", 503);
  }
  const params = new URLSearchParams({ page: String(page) });
  if (query.trim()) params.set("q", query.trim());
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/students?${params.toString()}`, {
      credentials: "include", cache: "no-store",
    });
  } catch {
    throw new StudentsRequestError("We could not reach the student directory. Check that the API is running and try again.", 0);
  }
  const body = await response.json().catch(() => null) as StudentsPage | { error?: { message?: string } } | null;
  if (!response.ok) {
    const message = body && "error" in body ? body.error?.message : undefined;
    throw new StudentsRequestError(message ?? "We could not load the student directory.", response.status);
  }
  return body as StudentsPage;
}

async function requestStudentProfile<T>(studentId: string, method: "GET" | "PUT", input?: StudentLearningProfileInput) {
  if (!API_BASE_URL) {
    throw new StudentsRequestError("Student profiles are unavailable until the API is connected.", 503);
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/students/${encodeURIComponent(studentId)}/learning-profile`, {
      method,
      credentials: "include",
      cache: "no-store",
      ...(input ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) } : {}),
    });
  } catch {
    throw new StudentsRequestError("We could not reach the student profile service. Please try again.", 0);
  }
  const body = await response.json().catch(() => null) as { profile?: T; error?: { message?: string } } | null;
  if (!response.ok) {
    throw new StudentsRequestError(body?.error?.message ?? "We could not update the student profile.", response.status);
  }
  return body as { profile: T };
}

export async function getStudentLearningProfile(studentId: string) {
  return requestStudentProfile<StudentLearningProfile | null>(studentId, "GET");
}

export async function saveStudentLearningProfile(studentId: string, input: StudentLearningProfileInput) {
  return requestStudentProfile<StudentLearningProfile>(studentId, "PUT", input);
}
