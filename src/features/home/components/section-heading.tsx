import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">{description}</p>
    </Reveal>
  );
}
