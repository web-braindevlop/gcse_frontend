"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/feedback";
import {
  getProfileOptions, getOwnProfile, saveOwnProfile, ProfileRequestError,
  type ProfileOptions, type StudentLearningProfileInput, type StudentLearningProfile,
} from "./services/student-profile.service";
import {
  getStudentLearningProfile, saveStudentLearningProfile, StudentsRequestError,
  type StudentLearningProfileInput as StaffProfileInput,
} from "./services/students.service";

const levelLabels: Record<string, string> = {
  gcse: "GCSE",
  igcse_o_level: "IGCSE / O Level",
  a_level: "A Level",
};

const tierLabels: Record<string, string> = {
  foundation: "Foundation",
  higher: "Higher",
  not_sure: "Not sure yet",
};

const emptyForm: StudentLearningProfileInput = {
  level: "gcse", subject: "", examBoard: "", schoolYear: "", targetGrade: "", tier: "not_sure",
};

function errorMessage(error: unknown) {
  if ((error instanceof ProfileRequestError || error instanceof StudentsRequestError) && error.status === 401)
    return "Your session has expired. Please sign in again.";
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function StudentProfilePage({ audience }: { audience: "staff" | "student" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const studentId = audience === "staff" ? searchParams.get("studentId") : null;

  const [options, setOptions] = useState<ProfileOptions | null>(null);
  const [existingProfile, setExistingProfile] = useState<StudentLearningProfile | null>(null);
  const [form, setForm] = useState<StudentLearningProfileInput>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (audience === "student") {
        const [optionsRes, profileRes] = await Promise.all([
          getProfileOptions(),
          getOwnProfile(),
        ]);
        setOptions(optionsRes.options);
        if (profileRes.profile) {
          setExistingProfile(profileRes.profile);
          setForm({
            level: profileRes.profile.level,
            subject: profileRes.profile.subject,
            examBoard: profileRes.profile.examBoard,
            schoolYear: profileRes.profile.schoolYear,
            targetGrade: profileRes.profile.targetGrade,
            tier: profileRes.profile.tier,
          });
        }
      } else {
        if (!studentId) { setError("No student selected."); setIsLoading(false); return; }
        const { profile } = await getStudentLearningProfile(studentId);
        if (profile) {
          setExistingProfile(profile);
          setForm({
            level: profile.level,
            subject: profile.subject,
            examBoard: profile.examBoard,
            schoolYear: profile.schoolYear,
            targetGrade: profile.targetGrade,
            tier: profile.tier,
          });
        }
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [audience, studentId]);

  useEffect(() => { void loadData(); }, [loadData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSaved(false);
    try {
      if (audience === "student") {
        const { profile } = await saveOwnProfile(form);
        setExistingProfile(profile);
      } else {
        if (!studentId) return;
        const { profile } = await saveStudentLearningProfile(studentId, form as StaffProfileInput);
        if (profile) setExistingProfile(profile);
      }
      setSaved(true);
      toast.success("Profile saved", "The learning profile has been saved successfully.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    if (audience === "staff") router.push("/staff/dashboard");
    else router.push("/dashboard/overview");
  }

  const selectClasses = "min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-[#9292bf] disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500";

  return (
    <main className="min-h-screen bg-[#f7f7fc] px-4 py-7 text-[#102b42] sm:px-6">
      <div className="mx-auto max-w-3xl">
      <nav aria-label="Account setup progress" className="mb-7 overflow-x-auto pb-1"><ol className="flex min-w-[660px] items-center">{["Sign up","About you","Diagnostic","Your group","Learning map"].map((step,i)=><li key={step} className="flex flex-1 items-center last:flex-none"><span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i===1?"border-[3px] border-[#b8d8e8] bg-[#102b42] text-white":"bg-[#e6e6f8] text-[#102b42]"}`}>{i===0?"✓":i+1}</span><span className={`ml-2 whitespace-nowrap text-sm ${i===1?"font-semibold":""}`}>{step}</span>{i<4&&<span className="mx-2 h-px flex-1 bg-[#c9ccda]"/>}</li>)}</ol></nav>
      <header className="mb-4"><h1 className="text-3xl font-semibold tracking-tight">Tell us about you, {audience === "student" ? "" : "your student"}</h1><p className="mt-1 text-sm text-[#596579]">We use this to pick the right diagnostic and the right group.</p></header>

      <section className="rounded-3xl border border-[#dedfee] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#e6e6f8] text-[#45456e]">
            <User aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#62628c]">Learning profile</p>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900">{audience === "staff" ? "Student profile setup" : "About you"}</h2>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
          {audience === "staff"
            ? "Configure this student\u2019s learning profile. Choose their level, subject, exam board, and target grade."
            : existingProfile
              ? "Review and update your learning profile below."
              : "Set up your learning profile to personalise your revision experience."}
        </p>

        {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {saved && !error && <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2"><Check aria-hidden="true" className="size-4" /> Profile saved successfully.</div>}

        {isLoading ? (
          <div role="status" className="mt-10 flex items-center justify-center gap-3 py-12 text-stone-500">
            <Loader2 aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" />
            <span>Loading profile…</span>
          </div>
        ) : (
          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={(e) => void handleSubmit(e)}>
            {/* Level — always a dropdown */}
            <div className="grid gap-1.5">
              <label htmlFor="profile-level" className="text-sm font-medium text-stone-800">Level <span aria-hidden="true" className="ml-1 text-red-600">*</span></label>
              <select id="profile-level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as StudentLearningProfileInput["level"] })} required className={selectClasses}>
                {(options?.levels ?? Object.keys(levelLabels)).map((l) => (
                  <option key={l} value={l}>{levelLabels[l] ?? l}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="grid gap-1.5">
              <label htmlFor="profile-subject" className="text-sm font-medium text-stone-800">Subject <span aria-hidden="true" className="ml-1 text-red-600">*</span></label>
              {audience === "student" && options ? (
                <select id="profile-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className={selectClasses}>
                  <option value="" disabled>Select a subject</option>
                  {options.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input id="profile-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required maxLength={80} placeholder="e.g. Mathematics" className={selectClasses} />
              )}
            </div>

            {/* Exam Board */}
            <div className="grid gap-1.5">
              <label htmlFor="profile-examboard" className="text-sm font-medium text-stone-800">Exam board <span aria-hidden="true" className="ml-1 text-red-600">*</span></label>
              {audience === "student" && options ? (
                <select id="profile-examboard" value={form.examBoard} onChange={(e) => setForm({ ...form, examBoard: e.target.value })} required className={selectClasses}>
                  <option value="" disabled>Select an exam board</option>
                  {options.examBoards.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input id="profile-examboard" value={form.examBoard} onChange={(e) => setForm({ ...form, examBoard: e.target.value })} required maxLength={80} placeholder="e.g. AQA" className={selectClasses} />
              )}
            </div>

            {/* School Year */}
            <div className="grid gap-1.5">
              <label htmlFor="profile-schoolyear" className="text-sm font-medium text-stone-800">School year <span aria-hidden="true" className="ml-1 text-red-600">*</span></label>
              {audience === "student" && options ? (
                <select id="profile-schoolyear" value={form.schoolYear} onChange={(e) => setForm({ ...form, schoolYear: e.target.value })} required className={selectClasses}>
                  <option value="" disabled>Select a school year</option>
                  {options.schoolYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : (
                <input id="profile-schoolyear" value={form.schoolYear} onChange={(e) => setForm({ ...form, schoolYear: e.target.value })} required maxLength={20} placeholder="e.g. Year 10" className={selectClasses} />
              )}
            </div>

            {/* Target Grade */}
            <div className="grid gap-1.5">
              <label htmlFor="profile-targetgrade" className="text-sm font-medium text-stone-800">Target grade <span aria-hidden="true" className="ml-1 text-red-600">*</span></label>
              {audience === "student" && options ? (
                <select id="profile-targetgrade" value={form.targetGrade} onChange={(e) => setForm({ ...form, targetGrade: e.target.value })} required className={selectClasses}>
                  <option value="" disabled>Select a target grade</option>
                  {options.targetGrades.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              ) : (
                <input id="profile-targetgrade" value={form.targetGrade} onChange={(e) => setForm({ ...form, targetGrade: e.target.value })} required maxLength={10} placeholder="e.g. 7" className={selectClasses} />
              )}
            </div>

            {/* Tier — only for GCSE */}
            {form.level === "gcse" && (
              <div className="grid gap-1.5">
                <label htmlFor="profile-tier" className="text-sm font-medium text-stone-800">Tier</label>
                <select id="profile-tier" value={form.tier ?? "not_sure"} onChange={(e) => setForm({ ...form, tier: e.target.value as StudentLearningProfileInput["tier"] })} className={selectClasses}>
                  {Object.entries(tierLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSaving} onClick={handleBack}>Cancel</Button>
              <Button type="submit" loading={isSaving}>{existingProfile ? "Update profile" : "Save profile"}</Button>
            </div>
          </form>
        )}
      </section></div>
    </main>
  );
}
