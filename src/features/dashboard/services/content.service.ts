import { API_BASE_URL } from "@/lib/api/base-url";

export type ContentStatus = "draft" | "published";
export type ContentRecord = {
  id: string;
  subject: string;
  title: string;
  topic: string;
  summary: string;
  body: string;
  status: ContentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
export type ContentInput = Pick<ContentRecord, "subject" | "title" | "topic" | "summary" | "body" | "status">;

export class ContentRequestError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "ContentRequestError"; }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ContentRequestError("Content management will be available after the API is connected.", 503);
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/content${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ContentRequestError("We could not reach the content service. Check that the API is running and try again.", 0);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null) as { error?: { message?: string } } | T | null;
  if (!response.ok) {
    const message = body && typeof body === "object" && "error" in body ? body.error?.message : undefined;
    throw new ContentRequestError(message ?? "Something went wrong. Please try again.", response.status);
  }
  return body as T;
}

export async function listContent(query: string, status: "all" | ContentStatus) {
  const params = new URLSearchParams({ status });
  if (query.trim()) params.set("q", query.trim());
  return request<{ items: ContentRecord[] }>(`?${params.toString()}`);
}

export async function createContent(input: ContentInput) {
  return request<{ item: ContentRecord }>("", { method: "POST", body: JSON.stringify(input) });
}

export async function updateContent(id: string, input: ContentInput) {
  return request<{ item: ContentRecord }>(`/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function deleteContent(id: string) {
  return request<void>(`/${encodeURIComponent(id)}`, { method: "DELETE" });
}
