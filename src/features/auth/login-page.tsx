import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, LockIcon } from "@/components/common";
import { SiteFooter, SiteHeader } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { LoginForm } from "./components/login-form";
import type { LoginAudience } from "./services/auth.service";

const studentPerks = [
  "Pick up your revision where you left off",
  "See how you’re doing in every subject",
  "Stay on track for your target grades",
] as const;
const staffPerks = [
  "Support students through their GCSE journey",
  "Keep learning groups organised",
  "Help learners focus on the topics that matter",
] as const;

type LoginPageProps = { audience?: LoginAudience };

export default function LoginPage({ audience = "student" }: LoginPageProps) {
  const isStaff = audience === "staff";
  const perks = isStaff ? staffPerks : studentPerks;

  return (
    <div className="flex flex-1 flex-col bg-[#f7f8f6] text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">{isStaff ? "Staff workspace" : "Welcome back"}</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-[1.1] tracking-tight text-stone-900 xl:text-6xl">
              {isStaff ? "Help every learner find their next step." : "Pick up where your revision left off."}
            </h1>
            <ul className="mt-9 grid gap-4 text-stone-600">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                    <CheckIcon className="size-4" strokeWidth={2.4} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="mx-auto w-full max-w-md">
            <section aria-labelledby="login-heading" className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(25,50,40,0.3)] sm:p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#e6e6f8] text-[#292943]">
                <LockIcon className="size-6" />
              </span>
              <h2 id="login-heading" className="mt-6 text-2xl font-semibold tracking-tight text-stone-900">
                {isStaff ? "Admin & teacher sign in" : "Student log in"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {isStaff ? "Use your staff account to continue to your workspace." : "Enter your details to access your subjects."}
              </p>

              <div className="mt-8">
                <LoginForm audience={audience} />
                {isStaff ? (
                  <p className="mt-5 text-center text-sm text-stone-600">Are you a student? <Link href="/login/student" className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-700">Student sign in</Link></p>
                ) : (
                  <>
                    <p className="mt-5 text-center text-sm text-stone-600">New to Educate Cloud? <Link href="/register" className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-700">Create an account</Link></p>
                  </>
                )}
              </div>

              <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-md text-sm text-stone-600 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                <ArrowLeftIcon className="size-4" />
                Back to home
              </Link>
            </section>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


