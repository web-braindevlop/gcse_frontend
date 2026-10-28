/**
 * Public API URL is inlined into browser bundles during `next build`.
 * Keep the localhost fallback development-only so a hosted frontend never
 * makes visitors' browsers call their own machine.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "")
).replace(/\/+$/, "");
