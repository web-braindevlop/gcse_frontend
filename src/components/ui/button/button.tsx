"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cx } from "@/lib/utils/cx";
import { buttonBaseClasses, buttonSizeClasses, buttonVariantClasses } from "./button.styles";
import type { ButtonSize, ButtonVariant } from "./button.types";

export type ButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children" | "size" | "transition" | "whileHover" | "whileTap"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  loading?: boolean;
};


export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    loading = false,
    size = "md",
    type = "button",
    variant = "primary",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      {...props}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cx(
        buttonBaseClasses,
        "transition-colors disabled:cursor-not-allowed disabled:opacity-55",
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        className,
      )}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
        />
      )}
      {children}
    </motion.button>
  );
});


