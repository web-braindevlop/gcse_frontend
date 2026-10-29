"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/feedback";
import { getCurrentUser, logout, type AuthUser } from "@/features/auth/services/auth.service";
import { ContentManager } from "./components/content-manager";
import { StaffSidebar, type StaffSection } from "./components/staff-sidebar";
import { StudentDirectory } from "./components/student-directory";

export default function StaffDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState("Loading your staff account...");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [section, setSection] = useState<StaffSection>("overview");

  useEffect(() => {
    let active = true;
    getCurrentUser().then(({ user: current }) => {
      if (!active) return;
      if (current.role === "student") {
        router.replace("/dashboard/overview");
        return;
      }
      setUser(current);
      setMessage("");
    }).catch((error: unknown) => {
      if (!active) return;
      if (typeof error === "object" && error !== null && "status" in error && error.status === 401) {
        router.replace("/login/staff");
        return;
      }
      setMessage(error instanceof Error ? error.message : "We could not load your staff workspace.");
    });
    return () => { active = false; };
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out", "You have been securely signed out.");
      router.replace("/login/staff");
    } catch (error) {
      toast.error("Sign-out failed", error instanceof Error ? error.message : "We could not sign you out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  const roleLabel = user?.role === "admin" ? "Administrator workspace" : "Teacher workspace";

  return (
    <div className="min-h-screen bg-[#fafafd] text-stone-900 lg:flex">
      <StaffSidebar currentSection={section} onSelect={setSection} />
      <main id="main-content" className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
          <header className="flex flex-wrap items-center justify-between gap-5 border-b border-stone-200/80 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#62628c]">{roleLabel}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#182331] sm:text-3xl">{section === "students" ? "Student directory" : section === "content" ? "Learning content" : user ? `Welcome, ${user.displayName}.` : "Staff workspace"}</h1>
              {user && <p className="mt-1.5 text-sm text-stone-500">{section === "students" ? "View and search students registered with Educate Cloud." : section === "content" ? "Create, organize, and publish learning resources." : "Here’s what’s happening in your learning workspace."}</p>}
            </div>
            <div className="flex items-center gap-3">
              {user && <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-[#182331]">{user.displayName}</p><p className="mt-0.5 text-xs text-stone-500">{user.email}</p></div>}
              {user && <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-[#d8d8ef] bg-[#e6e6f8] text-sm font-bold text-[#3e3e63]">{user.displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>}
              {user && <Button size="sm" variant="outline" loading={isLoggingOut} onClick={handleLogout}>Sign out</Button>}
            </div>
          </header>
          {user ? <>
            {section === "overview" && <section aria-label="Workspace summary" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <article className="group relative overflow-hidden rounded-2xl border border-[#e2e2f1] bg-white p-5 shadow-sm shadow-[#34345d]/[0.035] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#34345d]/[0.07] motion-reduce:transform-none motion-reduce:transition-none">
                <span aria-hidden="true" className="absolute -right-8 -top-9 size-28 rounded-full bg-[#f1f1fc] transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none" />
                <div className="relative flex items-start justify-between"><div><p className="text-sm font-medium text-stone-500">Learning library</p><h2 className="mt-2 text-lg font-semibold tracking-tight text-[#182331]">Build your resource hub</h2></div><span className="grid size-11 place-items-center rounded-xl bg-[#e6e6f8] text-[#45456e]"><BookOpen aria-hidden="true" className="size-5" /></span></div>
                <p className="relative mt-3 max-w-sm text-sm leading-6 text-stone-600">Create clear, curriculum-focused learning material for your students.</p>
                <button type="button" onClick={() => setSection("content")} className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4d4d79] hover:text-[#292943] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#7777a6]">Manage content <span aria-hidden="true">→</span></button>
              </article>
              <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-900/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-stone-500">Your role</p><h2 className="mt-2 text-lg font-semibold tracking-tight text-[#182331]">{user.role === "admin" ? "Administrator" : "Teacher"}</h2></div><span className="grid size-11 place-items-center rounded-xl bg-[#f2f5ef] text-[#526548]"><ShieldCheck aria-hidden="true" className="size-5" /></span></div>
                <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">You have secure access to manage resources in the student learning library.</p>
                <button type="button" onClick={() => setSection("students")} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#4d4d79] hover:text-[#292943] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#7777a6]">Browse students <span aria-hidden="true">→</span></button>
              </article>
              <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-900/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none md:col-span-2 xl:col-span-1">
                <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-stone-500">Student experience</p><h2 className="mt-2 text-lg font-semibold tracking-tight text-[#182331]">Ready to grow</h2></div><span className="grid size-11 place-items-center rounded-xl bg-[#fff5e8] text-[#8a6734]"><Sparkles aria-hidden="true" className="size-5" /></span></div>
                <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">Published resources will appear in the student dashboard when it’s available.</p>
                <span className="mt-4 inline-flex rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-500">Student dashboard · coming soon</span>
              </article>
            </section>}
            {section === "overview" && <div className="mt-7 grid gap-4 lg:grid-cols-2">
              <button type="button" onClick={() => setSection("content")} className="group rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#7777a6] motion-reduce:transform-none motion-reduce:transition-none"><p className="text-sm font-semibold text-[#37375d]">Learning library <span aria-hidden="true" className="float-right">→</span></p><p className="mt-1.5 text-sm leading-6 text-stone-600">Manage drafts and published resources for your students.</p></button>
              <button type="button" onClick={() => setSection("students")} className="group rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#7777a6] motion-reduce:transform-none motion-reduce:transition-none"><p className="text-sm font-semibold text-[#37375d]">Student directory <span aria-hidden="true" className="float-right">→</span></p><p className="mt-1.5 text-sm leading-6 text-stone-600">See every student account and when each learner registered.</p></button>
            </div>}
            {section === "content" && <ContentManager />}
            {section === "students" && <StudentDirectory />}
          </> : <p role="status" className="mt-8 text-stone-600">{message}</p>}
        </div>
      </main>
    </div>
  );
}
