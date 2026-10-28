"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type StaggerProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "transition" | "variants" | "viewport" | "whileInView"
> & {
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number | "some" | "all";
};

export function Stagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      {...props}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}
