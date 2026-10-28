"use client";

import { forwardRef, useId } from "react";
import { cx } from "@/lib/utils/cx";
import type { InputProps } from "./input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    description,
    endAdornment,
    error,
    id: providedId,
    label,
    required,
    tone = "default",
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedByIds = [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const dark = tone === "dark";

  return (
    <div className={cx("grid gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx("text-sm font-medium", dark ? "text-slate-200" : "text-stone-800")}
        >
          {label}
          {required && (
            <span aria-hidden="true" className={cx("ml-1", dark ? "text-fuchsia-400" : "text-red-600")}>
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={id}
          required={required}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedByIds}
          className={cx(
            "min-h-11 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none",
            "focus-visible:ring-2 focus-visible:ring-offset-1",
            dark
              ? cx(
                  "bg-white/5 text-white shadow-none transition-colors placeholder:text-slate-500 focus-visible:ring-offset-transparent",
                  "hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60",
                  error
                    ? "border-red-400/70 focus-visible:ring-red-400"
                    : "border-white/12 focus-visible:border-violet-400/60 focus-visible:ring-violet-400",
                )
              : cx(
                  "bg-white text-stone-950 shadow-sm placeholder:text-stone-400 focus-visible:ring-emerald-700",
                  "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500",
                  error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-stone-300",
                ),
            Boolean(endAdornment) && "pr-11",
            className,
          )}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
        )}
      </div>
      {description && (
        <p id={descriptionId} className={cx("text-sm", dark ? "text-slate-400" : "text-stone-500")}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className={cx("text-sm", dark ? "text-red-300" : "text-red-700")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

