import type { ButtonSize, ButtonVariant } from "./button.types";

export const buttonBaseClasses =
  "inline-flex items-center justify-center whitespace-nowrap font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2";

const darkRing = "focus-visible:ring-violet-400 focus-visible:ring-offset-ink";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "border border-[#d2d2ed] bg-[#e6e6f8] text-[#292943] shadow-sm hover:border-[#c3c3e4] hover:bg-[#d9d9f2]",
  secondary: "border border-[#e6e6f8] bg-[#e6e6f8] text-[#292943] hover:border-[#d2d2ed] hover:bg-[#d9d9f2]",
  outline: "border border-stone-300 bg-transparent text-stone-800 hover:border-[#d2d2ed] hover:bg-[#e6e6f8]",
  ghost: "border border-transparent bg-transparent text-stone-700 hover:bg-[#e6e6f8] hover:text-[#292943]",
  danger: "border border-transparent bg-red-700 text-white shadow-sm hover:bg-red-800",
  brand: "border border-[#d2d2ed] bg-[#e6e6f8] text-[#292943] shadow-sm hover:border-[#c3c3e4] hover:bg-[#d9d9f2] focus-visible:ring-[#8585b8] focus-visible:ring-offset-2",
  navy: "border border-[#102b42] bg-[#102b42] text-white shadow-sm hover:border-[#1b3e5a] hover:bg-[#1b3e5a] focus-visible:ring-[#6d91ad]",
  light: `border border-transparent bg-white text-slate-950 shadow-sm hover:bg-slate-100 ${darkRing}`,
  glass: `border border-white/15 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 ${darkRing}`,
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 gap-2 rounded-lg px-3 text-sm",
  md: "min-h-11 gap-2 rounded-xl px-4 text-sm",
  lg: "min-h-12 gap-2 rounded-xl px-5 text-base",
  icon: "size-11 rounded-xl p-0",
};

