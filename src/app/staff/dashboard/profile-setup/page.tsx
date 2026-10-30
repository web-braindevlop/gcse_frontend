import { Suspense } from "react";
import StudentProfilePage from "@/features/dashboard/student-profile-page";

export default function ProfileSetupPage() {
  return <Suspense fallback={<main className="p-10 text-stone-600">Loading student profile…</main>}><StudentProfilePage audience="staff" /></Suspense>;
}
