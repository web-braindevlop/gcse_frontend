"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/feedback";
import { getCurrentUser, logout, type AuthUser } from "@/features/auth/services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState("Loading your account...");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  function loadUser() {
    getCurrentUser().then(({ user: current }) => {
      if (current.role !== "student") {
        router.replace("/staff/dashboard");
        return;
      }
      setUser(current);
      setMessage("");
    }).catch((error: unknown) => {
      if (typeof error === "object" && error !== null && "status" in error && error.status === 401) {
        router.replace("/login/student");
        return;
      }
      setMessage(error instanceof Error ? error.message : "We could not load your account.");
    });
  }

  useEffect(() => {
    let active = true;
    getCurrentUser().then(({ user: current }) => {
      if (!active) return;
      if (current.role !== "student") {
        router.replace("/staff/dashboard");
        return;
      }
      setUser(current);
      setMessage("");
    }).catch((error: unknown) => {
      if (!active) return;
      if (typeof error === "object" && error !== null && "status" in error && error.status === 401) {
        router.replace("/login/student");
        return;
      }
      setMessage(error instanceof Error ? error.message : "We could not load your account.");
    });
    return () => { active = false; };
  }, [router]);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const { user: current } = await getCurrentUser();
      setUser(current);
      toast.success("Refreshed", "Your dashboard has been refreshed.");
    } catch {
      toast.error("Refresh failed", "We could not refresh your dashboard. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out", "You have been securely signed out.");
      router.replace("/login/student");
    } catch (error) {
      toast.error("Sign-out failed", error instanceof Error ? error.message : "We could not sign you out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <main id="main-content" className="mx-auto flex min-h-[65vh] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      {user && (
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
            <User aria-hidden="true" className="size-4" /> Profile
          </Button>
          <Button variant="outline" onClick={() => void handleRefresh()} loading={isRefreshing} aria-label="Refresh dashboard">
            <RefreshCw aria-hidden="true" className="size-4" /> Refresh
          </Button>
        </div>
      )}
      <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-600">Student dashboard</p>
        {user ? <>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">Welcome back, {user.displayName}.</h1>
          <p className="mt-3 max-w-xl leading-7 text-stone-600">You are signed in to Educate Cloud. Your revision space is ready.</p>
          <p className="mt-6 text-sm text-stone-500">Signed in as {user.email}</p>
          <Button variant="brand" className="mt-8" loading={isLoggingOut} onClick={handleLogout}>Sign out</Button>
        </> : <p role="status" className="mt-4 text-stone-600">{message}</p>}
      </section>
    </main>
  );
}
