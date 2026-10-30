import { Suspense } from "react";
import { ProfileOptionsEditor } from "@/features/dashboard/components/profile-options-editor";

export default function ProfileSetupPage() {
  return <Suspense fallback={<main className="p-10 text-stone-600">Loading profile settings…</main>}><ProfileOptionsEditor /></Suspense>;
}
