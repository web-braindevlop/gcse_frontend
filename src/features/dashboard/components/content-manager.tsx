"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Check, FilePlus2, Pencil, Search, Trash2, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ContentRequestError, createContent, deleteContent, listContent, updateContent, type ContentInput, type ContentRecord, type ContentStatus } from "../services/content.service";

const emptyForm: ContentInput = { subject: "", title: "", topic: "", summary: "", body: "", status: "draft" };
type Filter = "all" | ContentStatus;

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function errorMessage(error: unknown) {
  if (error instanceof ContentRequestError && error.status === 401) return "Your staff session has expired. Please sign in again.";
  return error instanceof Error ? error.message : "We could not complete that action. Please try again.";
}

export function ContentManager() {
  const prefersReducedMotion = useReducedMotion();
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [form, setForm] = useState<ContentInput>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async (search = query) => {
    setIsLoading(true);
    setPageError("");
    try { setItems((await listContent(search, "all")).items); }
    catch (error) { setPageError(errorMessage(error)); }
    finally { setIsLoading(false); }
  }, [query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void refresh(); }, 180);
    return () => window.clearTimeout(timeout);
  }, [refresh]);

  const counts = useMemo(() => ({
    all: items.length,
    published: items.filter((item) => item.status === "published").length,
    draft: items.filter((item) => item.status === "draft").length,
  }), [items]);
  const visibleItems = filter === "all" ? items : items.filter((item) => item.status === filter);

  function openCreate() {
    setEditing(null); setForm(emptyForm); setDialogError(""); setDialogOpen(true);
  }

  function openEdit(item: ContentRecord) {
    setEditing(item);
    setForm({ subject: item.subject, title: item.title, topic: item.topic, summary: item.summary, body: item.body, status: item.status });
    setDialogError(""); setDialogOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsSaving(true); setDialogError("");
    try {
      if (editing) await updateContent(editing.id, form);
      else await createContent(form);
      setDialogOpen(false);
      await refresh();
    } catch (error) { setDialogError(errorMessage(error)); }
    finally { setIsSaving(false); }
  }

  async function handleDelete(item: ContentRecord) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setDeletingId(item.id); setPageError("");
    try { await deleteContent(item.id); await refresh(); }
    catch (error) { setPageError(errorMessage(error)); }
    finally { setDeletingId(null); }
  }

  useEffect(() => {
    if (!dialogOpen) return;
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape" && !isSaving) setDialogOpen(false); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialogOpen, isSaving]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All content" }, { id: "published", label: "Published" }, { id: "draft", label: "Drafts" },
  ];

  return (
    <section id="content" aria-labelledby="content-heading" className="mt-10 scroll-mt-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#595979]">Learning library</p>
          <h2 id="content-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[#182331]">Student content</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Create and organize learning resources. Published content will be ready for the student dashboard.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0"><FilePlus2 aria-hidden="true" className="size-4" /> Add content</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total items", value: counts.all, icon: BookOpen },
          { label: "Published", value: counts.published, icon: Check },
          { label: "Drafts", value: counts.draft, icon: Pencil },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm shadow-stone-900/[0.025]">
            <div className="flex items-center justify-between text-sm text-stone-600"><span>{label}</span><Icon aria-hidden="true" className="size-4 text-[#62628c]" /></div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[#182331]">{isLoading ? "—" : value}</p>
          </article>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-stone-200 bg-white shadow-sm shadow-stone-900/[0.025]">
        <div className="flex flex-col gap-4 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1" aria-label="Filter content">
            {filters.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#62628c] ${filter === id ? "bg-white text-[#182331] shadow-sm" : "text-stone-600 hover:text-stone-900"}`}>{label}</button>
            ))}
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search learning content</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content" className="min-h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus-visible:border-[#9292bf] focus-visible:ring-2 focus-visible:ring-[#e6e6f8]" />
          </label>
        </div>

        {pageError && <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{pageError}</div>}
        {isLoading ? (
          <div role="status" className="grid gap-3 p-5"><span className="sr-only">Loading learning content</span>{[1, 2, 3].map((key) => <div key={key} className="h-24 animate-pulse rounded-xl bg-stone-100 motion-reduce:animate-none" />)}</div>
        ) : visibleItems.length ? (
          <ul className="divide-y divide-stone-100">
            {visibleItems.map((item) => (
              <li key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-[#f0f0fb] text-[#4e4e77]"}`}>{item.status === "published" ? "Published" : "Draft"}</span>
                    <span className="text-xs font-medium text-stone-500">{item.subject} · {item.topic}</span>
                  </div>
                  <h3 className="mt-2 truncate text-base font-semibold text-[#182331]">{item.title}</h3>
                  {item.summary && <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-stone-600">{item.summary}</p>}
                  <p className="mt-2 text-xs text-stone-400">Updated {formatDate(item.updatedAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil aria-hidden="true" className="size-3.5" /> Edit</Button>
                  <Button size="sm" variant="ghost" disabled={deletingId === item.id} onClick={() => void handleDelete(item)} aria-label={`Delete ${item.title}`}><Trash2 aria-hidden="true" className="size-4 text-stone-500" /> Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f0f0fb] text-[#5e5e82]"><BookOpen aria-hidden="true" className="size-5" /></span>
            <h3 className="mt-4 font-semibold text-[#182331]">{query ? "No matching content" : filter === "all" ? "Your learning library is ready" : `No ${filter} content yet`}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">{query ? "Try a different search term." : "Create your first learning resource. You can save it as a draft or publish it for students."}</p>
            {!query && filter === "all" && <Button className="mt-5" onClick={openCreate}><FilePlus2 aria-hidden="true" className="size-4" /> Create first resource</Button>}
          </div>
        )}
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-[#182331]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setDialogOpen(false); }}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="content-dialog-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-7" initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 340, damping: 30 }}>
              <header className="flex items-start justify-between gap-4">
                <div><p className="text-sm font-medium text-[#62628c]">Learning library</p><h2 id="content-dialog-title" className="mt-1 text-xl font-semibold text-[#182331]">{editing ? "Edit learning content" : "Create learning content"}</h2></div>
                <button type="button" onClick={() => setDialogOpen(false)} disabled={isSaving} aria-label="Close" className="grid size-9 place-items-center rounded-full text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-[#62628c]"><X aria-hidden="true" className="size-5" /></button>
              </header>
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void handleSubmit(event)}>
                <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength={180} required placeholder="e.g. Introduction to algebra" />
                <Input label="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} maxLength={100} required placeholder="e.g. Mathematics" />
                <Input label="Topic" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} maxLength={180} required placeholder="e.g. Equations" />
                <div className="grid gap-1.5"><label htmlFor="content-status" className="text-sm font-medium text-stone-800">Status</label><select id="content-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ContentStatus })} className="min-h-11 rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-[#9292bf]"><option value="draft">Save as draft</option><option value="published">Publish for students</option></select></div>
                <div className="sm:col-span-2"><label htmlFor="content-summary" className="mb-1.5 block text-sm font-medium text-stone-800">Short summary <span className="font-normal text-stone-500">(optional)</span></label><textarea id="content-summary" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} maxLength={500} rows={2} className="w-full resize-y rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#9292bf]" placeholder="What will students learn?" /></div>
                <div className="sm:col-span-2"><label htmlFor="content-body" className="mb-1.5 block text-sm font-medium text-stone-800">Learning content</label><textarea id="content-body" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} maxLength={100000} minLength={1} required rows={8} className="w-full resize-y rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm leading-6 text-stone-900 outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#9292bf]" placeholder="Write the lesson, explanation, or instructions here…" /><p className="mt-1 text-xs text-stone-500">Plain text for now. You can edit or publish this resource at any time.</p></div>
                {dialogError && <p role="alert" className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{dialogError}</p>}
                <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-4 sm:col-span-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={isSaving} onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" loading={isSaving}>{editing ? "Save changes" : form.status === "published" ? "Publish content" : "Save draft"}</Button></div>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
