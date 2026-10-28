"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChartColumnIncreasing,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  LockKeyhole,
  Menu,
  Pause,
  Pencil,
  Play,
  Sparkles,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { cx } from "@/lib/utils/cx";

export type IconAnimation = "nudge" | "pop" | "sparkle" | "check";
export type IconProps = Omit<LucideProps, "ref"> & { animation?: IconAnimation };

const iconMotions: Record<IconAnimation, { hover: Record<string, number>; tap: Record<string, number> }> = {
  nudge: { hover: { x: 2 }, tap: { x: 3 } },
  pop: { hover: { scale: 1.1, rotate: -4 }, tap: { scale: 0.94 } },
  sparkle: { hover: { scale: 1.12, rotate: 12 }, tap: { scale: 0.94 } },
  check: { hover: { scale: 1.12 }, tap: { scale: 0.94 } },
};

function createAnimatedIcon(Icon: LucideIcon, defaultAnimation: IconAnimation = "pop") {
  function AnimatedIcon({ animation = defaultAnimation, className, ...props }: IconProps) {
    const prefersReducedMotion = useReducedMotion();
    const movement = iconMotions[animation];

    return (
      <motion.span
        aria-hidden="true"
        className={cx("inline-flex shrink-0 leading-none", className)}
        whileHover={prefersReducedMotion ? undefined : movement.hover}
        whileTap={prefersReducedMotion ? undefined : movement.tap}
        transition={{ type: "spring", stiffness: 420, damping: 18, mass: 0.55 }}
      >
        <Icon {...props} aria-hidden="true" className="size-full" />
      </motion.span>
    );
  }

  AnimatedIcon.displayName = `Animated${Icon.displayName ?? Icon.name}`;
  return AnimatedIcon;
}

export const ArrowRightIcon = createAnimatedIcon(ArrowRight, "nudge");
export const ArrowLeftIcon = createAnimatedIcon(ArrowLeft, "nudge");
export const CheckIcon = createAnimatedIcon(Check, "check");
export const SparklesIcon = createAnimatedIcon(Sparkles, "sparkle");
export const BookIcon = createAnimatedIcon(BookOpen, "pop");
export const PencilIcon = createAnimatedIcon(Pencil, "nudge");
export const ChartIcon = createAnimatedIcon(ChartColumnIncreasing, "pop");
export const CalendarIcon = createAnimatedIcon(CalendarDays, "pop");
export const FlameIcon = createAnimatedIcon(Flame, "pop");
export const LockIcon = createAnimatedIcon(LockKeyhole, "pop");
export const EyeIcon = createAnimatedIcon(Eye, "pop");
export const EyeOffIcon = createAnimatedIcon(EyeOff, "pop");
export const ChevronLeftIcon = createAnimatedIcon(ChevronLeft, "nudge");
export const ChevronRightIcon = createAnimatedIcon(ChevronRight, "nudge");
export const PauseIcon = createAnimatedIcon(Pause, "pop");
export const PlayIcon = createAnimatedIcon(Play, "pop");
export const MenuIcon = createAnimatedIcon(Menu, "pop");
export const CloseIcon = createAnimatedIcon(X, "pop");
