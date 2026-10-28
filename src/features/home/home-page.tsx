import { SiteFooter, SiteHeader } from "@/components/layout";
import { CtaSection } from "./components/cta-section";
import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { SubjectsSection } from "./components/subjects-section";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f7f8f6] text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <SubjectsSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
