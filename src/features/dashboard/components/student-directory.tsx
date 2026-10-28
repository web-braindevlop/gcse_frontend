"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Search, Users } from "lucide-react";
import { Button } from "@/components/ui";
import { getStudents, StudentsRequestError, type StudentRecord } from "../services/students.service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function StudentDirectory() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestSequence = useRef(0);
  const pageSize = 25;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const load = useCallback(async (search: string, currentPage: number) => {
    const sequence = ++requestSequence.current;
    setLoading(true);
    setError("");
    try {
      const result = await getStudents(search, currentPage);
      if (sequence !== requestSequence.current) return;
      setStudents(result.items);
      setTotal(result.total);
    } catch (cause) {
      if (sequence !== requestSequence.current) return;
      if (cause instanceof StudentsRequestError && cause.status === 401) setError("Your staff session has expired. Please sign in again.");
      else if (cause instanceof StudentsRequestError && cause.status === 403) setError("This directory is available to teachers and administrators only.");
      else setError(cause instanceof Error ? cause.message : "We could not load the students. Please try again.");
    } finally {
      if (sequence === requestSequence.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(query, page); }, 180);
    return () => window.clearTimeout(timer);
  }, [load, page, query]);

  function updateSearch(value: string) { setQuery(value); setPage(1); }

  return (
    <section aria-labelledby="students-heading" className="mt-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#595979]">Student accounts</p>
          <h2 id="students-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[#182331]">Students</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">New student registrations appear here automatically. Search by name, username, or email.</p>
        </div>
        <Button variant="outline" onClick={() => void load(query, page)} loading={loading} aria-label="Refresh student list"><RefreshCw aria-hidden="true" className="size-4" /> Refresh</Button>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#e2e2f1] bg-white p-4 shadow-sm shadow-[#34345d]/[0.035] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#e6e6f8] text-[#45456e]"><Users aria-hidden="true" className="size-5" /></span>
          <div><p className="text-xs font-medium text-stone-500">Registered students</p><p aria-live="polite" className="mt-0.5 text-xl font-semibold tabular-nums text-[#182331]">{loading ? "—" : total.toLocaleString()}</p></div>
        </div>
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search students</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input value={query} onChange={(event) => updateSearch(event.target.value)} placeholder="Search students" className="min-h-11 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus-visible:border-[#9292bf] focus-visible:ring-2 focus-visible:ring-[#e6e6f8]" />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm shadow-stone-900/[0.025]">
        {error && <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-[#f8f8fc]">
              <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th scope="col" className="px-5 py-3.5">Student</th>
                <th scope="col" className="px-5 py-3.5">Email address</th>
                <th scope="col" className="px-5 py-3.5">Username</th>
                <th scope="col" className="px-5 py-3.5">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? Array.from({ length: 5 }, (_, index) => <tr key={`loading-${index}`}><td colSpan={4} className="px-5 py-4"><span className="block h-5 animate-pulse rounded-md bg-stone-100 motion-reduce:animate-none" /></td></tr>) : students.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-[#fbfbfe]">
                  <td className="whitespace-nowrap px-5 py-4"><div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f0f0fb] text-xs font-bold text-[#4e4e77]">{student.displayName.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span className="font-medium text-[#182331]">{student.displayName}</span></div></td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-600">{student.email}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-500">{student.username}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-500">{formatDate(student.joinedAt)}</td>
                </tr>
              ))}
              {!loading && students.length === 0 && <tr><td colSpan={4} className="px-5 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f0f0fb] text-[#5e5e82]"><Users aria-hidden="true" className="size-5" /></span><p className="mt-4 font-semibold text-[#182331]">{query ? "No students match that search" : "No students registered yet"}</p><p className="mt-1 text-sm text-stone-500">{query ? "Try searching with another name, username, or email." : "New student accounts will show up here after registration."}</p></td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-col gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">{loading ? "Loading students…" : total === 0 ? "No student records" : `Showing ${((page - 1) * pageSize) + 1}–${Math.min(page * pageSize, total)} of ${total.toLocaleString()} students`}</p>
          <div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={loading || page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button><span className="min-w-16 text-center text-xs tabular-nums text-stone-500">{page} / {pageCount}</span><Button size="sm" variant="outline" disabled={loading || page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</Button></div>
        </footer>
      </div>
    </section>
  );
}
