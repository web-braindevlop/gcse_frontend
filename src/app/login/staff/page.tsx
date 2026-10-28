import type { Metadata } from "next";
import { LoginPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "Staff sign in | Educate Cloud",
  description: "Sign in to the Educate Cloud teacher and admin workspace.",
};

export default function StaffLoginRoute() {
  return <LoginPage audience="staff" />;
}
