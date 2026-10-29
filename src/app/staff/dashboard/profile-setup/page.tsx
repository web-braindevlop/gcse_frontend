import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

const optionGroups = [
  { title: "Subjects", description: "Subjects students can choose from.", examples: "Maths, English, Biology, Chemistry, Physics" },
  { title: "Exam boards", description: "Boards available in the student form.", examples: "AQA, Edexcel, OCR, WJEC" },
  { title: "School years", description: "Year groups students can select.", examples: "Year 9, Year 10, Year 11" },
];

export default function ProfileSetupPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#fafafd] px-4 py-8 text-stone-900 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/staff/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[#45456e] hover:text-[#22223d] focus-visible:outline-2 focus-visible:outline-[#7777a6]"><ArrowLeft aria-hidden="true" className="size-4" /> Back to student directory</Link>
        <header className="mt-7 flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e6e6f8] text-[#45456e]"><ClipboardList aria-hidden="true" className="size-6" /></span>
          <div><p className="text-sm font-semibold text-[#595979]">Staff form settings</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#182331]">Student Profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Prepare one shared learning profile form for all students. Students complete it after registration using the choices you make available.</p></div>
        </header>
        <section aria-label="Profile form dropdown options" className="mt-7 grid gap-4">
          {optionGroups.map((group) => <article key={group.title} className="rounded-2xl border border-[#e2e2f1] bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-[#182331]">{group.title}</h2><p className="mt-1 text-sm text-stone-600">{group.description}</p><p className="mt-4 rounded-xl bg-[#f8f8fc] px-4 py-3 text-sm text-stone-700">Suggested options: {group.examples}</p></article>)}
        </section>
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">These options are displayed here as a setup preview. Saving and sharing custom options with student accounts requires the profile-options API and database migration.</p>
      </div>
    </main>
  );
}
