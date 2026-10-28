import type { InputHTMLAttributes, ReactNode } from "react";

export type InputTone = "default" | "dark";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  /** `dark` is for dark surfaces and does not depend on the OS colour scheme. */
  tone?: InputTone;
  /** Interactive or decorative content placed inside the field's trailing edge. */
  endAdornment?: ReactNode;
};
