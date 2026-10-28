"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "transition" | "viewport" | "whileInView"
> & {
  /** Vertical distance in pixels. Set to 0 for a fade-only entrance. */
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number | "some" | "all";
};

export function Reveal({
  children,
  distance = 16,
  delay = 0,
  duration = 0.35,
  once = true,
  amount = 0.2,
  ...props
}: RevealProps) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
