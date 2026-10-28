import { Stagger, StaggerItem } from "@/components/motion";
import { subjects } from "../home-content";
import { SectionHeading } from "./section-heading";

export function SubjectsSection() {
  return (
    <section id="subjects" aria-labelledby="subjects-heading" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="subjects-heading"
          eyebrow="Your subjects"
          title="Everything you study, in one place"
          description="Find clear, focused revision for the GCSE subjects you are working on now."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.06}>
          {subjects.map((subject) => (
            <StaggerItem key={subject.name} className="h-full">
              <article className="h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-800/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-base font-semibold text-emerald-800">
                  {subject.name.charAt(0)}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-stone-900">{subject.name}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{subject.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
