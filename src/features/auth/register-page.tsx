"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { registerAccount } from "./services/auth.service";

const steps = ["Sign up", "About you", "Diagnostic", "Your group", "Learning map"] as const;
const learningSteps = [
  { title: "Diagnose", description: "A 10-question check finds your gaps" },
  { title: "Group session", description: "A teacher fixes your misconceptions live" },
  { title: "Learning map", description: "Every topic, in the right order for you" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const data = new FormData(event.currentTarget);
    const displayName = String(data.get("displayName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    setNotice(null);
    setIsSubmitting(true);
    try {
      await registerAccount({ displayName, email, password });
      router.replace("/dashboard/overview");
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f7fc] px-4 pb-12 pt-7 text-[#102b42] sm:px-6 sm:pt-9">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Account setup progress" className="mx-auto mb-7 max-w-3xl overflow-x-auto px-1 pb-1">
          <ol className="flex min-w-[690px] items-center sm:min-w-0">
            {steps.map((step, index) => {
              const active = index === 0;
              return (
                <li key={step} aria-current={active ? "step" : undefined} aria-disabled={!active} className="flex min-w-0 flex-1 items-center last:flex-none">
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className={active
                      ? "grid size-8 place-items-center rounded-full border-[3px] border-[#b8d8e8] bg-[#102b42] text-sm font-semibold text-white"
                      : "grid size-7 place-items-center rounded-full bg-[#e6e6f8] text-sm font-semibold text-[#102b42]"}>
                      {index + 1}
                    </span>
                    <span className={active ? "text-sm font-semibold text-[#102b42]" : "text-sm text-[#34465c]"}>{step}</span>
                  </div>
                  {index < steps.length - 1 && <span aria-hidden="true" className="mx-2.5 h-px min-w-3 flex-1 bg-[#c9ccda] sm:mx-3" />}
                </li>
              );
            })}
          </ol>
        </nav>

        <section aria-labelledby="register-heading" className="grid overflow-hidden rounded-[1.5rem] border border-[#dedfee] bg-white shadow-[0_18px_55px_-38px_rgba(16,43,66,0.3)] md:min-h-[380px] md:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#e6e6f8] px-7 py-9 sm:px-10 sm:py-11">
            <h1 className="max-w-lg text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.035em] text-[#102b42] sm:text-[2rem]">
              Know exactly what to learn next, with a teacher by your side.
            </h1>
            <p className="mt-5 text-[0.95rem] leading-6 text-[#263c54]">
              Educate Cloud is Google Maps for learning, plus a personal tutor.
            </p>
            <ol className="mt-6 grid gap-4">
              {learningSteps.map((item, index) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-[#102b42]">{index + 1}</span>
                  <div className="pt-0.5">
                    <h2 className="text-sm font-semibold leading-5 text-[#102b42]">{item.title}</h2>
                    <p className="text-sm leading-5 text-[#263c54]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-center px-7 py-9 sm:px-10 sm:py-11">
            <h2 id="register-heading" className="text-[1.35rem] font-semibold tracking-tight text-[#102b42]">Create your account</h2>
            <p className="mt-1 text-sm text-[#596579]">It takes about a minute.</p>
            <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-3">
              <Input name="displayName" label="Full name" autoComplete="name" placeholder="e.g. Ayesha Khan" required maxLength={120} />
              <Input name="email" label="Email" type="email" autoComplete="email" autoCapitalize="none" placeholder="you@example.com" required maxLength={254} />
              <Input name="password" label="Password" type="password" autoComplete="new-password" minLength={8} maxLength={128} placeholder="At least 8 characters" required />
              {notice && <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{notice}</p>}
              <Button type="submit" variant="navy" size="lg" loading={isSubmitting} className="mt-0.5 w-fit rounded-xl px-6">{isSubmitting ? "Creating account..." : "Create account"}</Button>
            </form>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs leading-5 text-[#596579]">
              <p>Your account is stored securely.</p>
              <p>Already registered? <Link href="/login/student" className="font-medium text-[#102b42] underline underline-offset-2">Log in</Link></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}



