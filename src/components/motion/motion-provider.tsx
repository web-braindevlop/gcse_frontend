"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </MotionConfig>
  );
}
