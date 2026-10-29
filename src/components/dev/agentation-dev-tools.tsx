"use client";

import { Agentation } from "agentation";

/** UI feedback toolbar for local development; never rendered in production. */
export function AgentationDevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}
