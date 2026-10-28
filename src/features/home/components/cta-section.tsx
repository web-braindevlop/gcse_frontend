import { ArrowRightIcon } from "@/components/common";
import { Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-emerald-900/10 bg-emerald-50 px-6 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">Your next step</p>
          <h2 id="cta-heading" className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Make revision feel more manageable.
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
            Log in and pick up where you left off across your GCSE subjects.
          </p>
        </div>
        <ButtonLink href="/login/student" variant="brand" size="lg" className="shrink-0">
          Student log in
          <ArrowRightIcon className="size-5" />
        </ButtonLink>
      </Reveal>
    </section>
  );
}

