import { forwardRef } from "react";
import { cx } from "@/lib/utils/cx";
import type {
  CardDescriptionProps,
  CardProps,
  CardSectionProps,
  CardTitleProps,
} from "./card.types";

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return (
    <article
      {...props}
      ref={ref}
      className={cx(
        "rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        className,
      )}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("grid gap-1.5 p-6", className)} />;
});

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return (
    <h2
      {...props}
      ref={ref}
      className={cx("text-lg font-semibold tracking-tight", className)}
    />
  );
});

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription(
  { className, ...props },
  ref,
) {
  return (
    <p {...props} ref={ref} className={cx("text-sm leading-6 text-zinc-600 dark:text-zinc-400", className)} />
  );
});

export const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("px-6 pb-6", className)} />;
});

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("flex items-center gap-3 px-6 pb-6", className)} />;
});
