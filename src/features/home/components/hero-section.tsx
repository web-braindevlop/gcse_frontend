import { CheckIcon, ArrowRightIcon } from "@/components/common";
import { Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink } from "@/components/ui";
import { heroHighlights } from "../home-content";
import { HeroImageSlider } from "./hero-image-slider";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="bg-[#f7f8f6]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 lg:py-24">
        <Stagger staggerChildren={0.08} amount={0.1}>
          <StaggerItem>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-white px-3.5 py-2 text-sm font-medium text-emerald-900 shadow-sm">
              <span aria-hidden="true" className="size-2 rounded-full bg-emerald-700" />
              Built for GCSE students
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1
              id="hero-heading"
              className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.06] tracking-tight text-stone-900 sm:text-6xl lg:text-[4.35rem]"
            >
              Make your next grade feel within reach.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
              A calmer way to revise, practise exam questions and see how far you have come across your GCSE subjects.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login/student" variant="brand" size="lg" className="sm:min-w-48">
                Student log in
                <ArrowRightIcon className="size-5" />
              </ButtonLink>
              <ButtonLink href="/#subjects" variant="outline" size="lg">
                Explore subjects
              </ButtonLink>
            </div>
          </StaggerItem>

          <StaggerItem>
            <ul className="mt-9 grid gap-3 text-sm text-stone-600">
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                    <CheckIcon className="size-3.5" strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>

        <HeroImageSlider />
      </div>
    </section>
  );
}

