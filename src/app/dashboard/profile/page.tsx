import { Suspense } from "react";
import StudentProfilePage from "@/features/dashboard/student-profile-page";

export default function StudentProfileRoute() {
  return <Suspense fallback={<main className="p-10 text-stone-600">Loading your profile…</main>}><StudentProfilePage audience="student" /></Suspense>;
}
