import { API_BASE_URL } from "@/lib/api/base-url";

export type StudentRecord = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  joinedAt: string;
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
