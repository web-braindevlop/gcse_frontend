import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthVerificationUnavailable } from "@/components/auth/auth-verification-unavailable";
import { getVerifiedUser } from "@/lib/auth/server-auth";

export default function StudentAreaLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AuthCheckPending />}>
      <StudentAreaGate>{children}</StudentAreaGate>
    </Suspense>
  );
}

async function StudentAreaGate({ children }: { children: ReactNode }) {
  const auth = await getVerifiedUser();
  if (auth.status === "unauthenticated") redirect("/login/student");
  if (auth.status === "unavailable") return <AuthVerificationUnavailable />;
  if (auth.user.role !== "student") redirect("/staff/dashboard");
  return children;
}

function AuthCheckPending() {
  return <main role="status" className="mx-auto flex min-h-[65vh] w-full max-w-5xl items-center px-4 py-16 text-stone-600 sm:px-6">Checking your sign-in...</main>;
}

