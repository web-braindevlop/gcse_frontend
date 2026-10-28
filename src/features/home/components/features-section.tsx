import type { ComponentType } from "react";
import { BookIcon, CalendarIcon, ChartIcon, PencilIcon, type IconProps } from "@/components/common";
import { Stagger, StaggerItem } from "@/components/motion";
import { cx } from "@/lib/utils/cx";
import { features, type FeatureKey } from "../home-content";
import { SectionHeading } from "./section-heading";

const featureIcons: Record<FeatureKey, ComponentType<IconProps>> = {
  revise: BookIcon,
  practise: PencilIcon,
  progress: ChartIcon,
  plan: CalendarIcon,
};

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-16 bg-[#f7f8f6] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="features-heading"
          eyebrow="A better way to revise"
          title="A little more structure. A lot more confidence."
          description="Simple tools to help you focus on understanding your subjects and feeling prepared for your exams."
        />

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3" staggerChildren={0.08}>
          {features.map((feature, index) => {
            const FeatureIcon = featureIcons[feature.key];
            return (
              <StaggerItem key={feature.key} className={cx(feature.wide && "lg:col-span-2")}>
                <article className="flex h-full gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
                    <FeatureIcon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">0{index + 1}</p>
                    <h3 className="mt-2 text-lg font-semibold text-stone-900">{feature.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">{feature.description}</p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
