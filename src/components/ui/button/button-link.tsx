import type { ComponentProps } from "react";
import Link from "next/link";
import { cx } from "@/lib/utils/cx";
import { buttonBaseClasses, buttonSizeClasses, buttonVariantClasses } from "./button.styles";
import type { ButtonSize, ButtonVariant } from "./button.types";

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A navigation link that looks like a Button. Use this instead of nesting a Button in a link. */
export function ButtonLink({
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cx(
        buttonBaseClasses,
        "transition duration-200 hover:-translate-y-px active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        className,
      )}
    />
  );
}
