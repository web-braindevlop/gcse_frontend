"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type StaggerItemProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "transition" | "variants" | "whileInView"
>;

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div
      {...props}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}
