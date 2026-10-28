import type { Metadata } from "next";
import { LoginPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "Student log in | Educate Cloud",
  description: "Log in to your Educate Cloud account to continue your GCSE revision.",
};

export default function StudentLoginRoute() {
  return <LoginPage audience="student" />;
}
