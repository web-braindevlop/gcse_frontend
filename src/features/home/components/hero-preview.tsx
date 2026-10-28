import { CalendarIcon, FlameIcon } from "@/components/common";
import { cx } from "@/lib/utils/cx";

const grades = [9, 8, 7, 6, 5, 4, 3, 2, 1] as const;
const targetGrade = 7;
const topics = [
  { name: "Algebra", value: 84 },
  { name: "Geometry", value: 62 },
  { name: "Probability", value: 47 },
] as const;
const RING_RADIUS = 44;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_VALUE = 72;

/** Illustrative preview using sample data, hidden from assistive technology. */
export function HeroPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-900/5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Maths · Higher</p>
            <p className="mt-1 text-lg font-semibold text-stone-900">Your progress</p>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">Sample preview</span>
        </div>
        <div className="mt-6 flex items-center gap-6">
          <div className="relative size-28 shrink-0 sm:size-32">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#e7e5e4" strokeWidth="8" />
              <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#16835d" strokeWidth="8" strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={RING_CIRCUMFERENCE * (1 - RING_VALUE / 100)} />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div><p className="text-2xl font-bold leading-none text-stone-900 sm:text-3xl">{RING_VALUE}%</p><p className="mt-1 text-[0.65rem] uppercase tracking-widest text-stone-500">on track</p></div>
            </div>
          </div>
          <ul className="grid flex-1 gap-3.5">
            {topics.map((topic) => <li key={topic.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium text-stone-700">{topic.name}</span><span className="text-stone-500">{topic.value}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${topic.value}%` }} /></div>
            </li>)}
          </ul>
        </div>
        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center justify-between text-xs"><span className="font-medium text-stone-700">Target grade</span><span className="text-stone-500">9–1 scale</span></div>
          <div className="mt-3 grid grid-cols-9 gap-1.5">{grades.map((grade) => <span key={grade} className={cx("grid aspect-square place-items-center rounded-lg text-sm font-semibold", grade === targetGrade ? "bg-emerald-700 text-white" : grade > targetGrade ? "bg-stone-100 text-stone-500" : "bg-white text-stone-700")}>{grade}</span>)}</div>
        </div>
      </div>
      <div className="absolute -left-3 top-24 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-lg shadow-stone-900/5 sm:flex lg:-left-10">
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><FlameIcon className="size-5" /></span>
        <div><p className="text-sm font-semibold text-stone-900">7-day streak</p><p className="text-xs text-stone-500">Keep it going</p></div>
      </div>
      <div className="absolute -right-3 -bottom-6 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-lg shadow-stone-900/5 sm:flex lg:-right-8">
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><CalendarIcon className="size-5" /></span>
        <div><p className="text-sm font-semibold text-stone-900">Next up</p><p className="text-xs text-stone-500">Quadratic equations</p></div>
      </div>
    </div>
  );
}
