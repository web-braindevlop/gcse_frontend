import Link from "next/link";
import { cx } from "@/lib/utils/cx";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className={cx("rounded-md font-semibold text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700")}>
          Educate Cloud
        </Link>
        <p>A learning space for GCSE students.</p>
      </div>
    </footer>
  );
}
