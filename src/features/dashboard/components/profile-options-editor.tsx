"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/feedback";
import { getProfileOptions, saveProfileOptions, type ProfileOptions } from "../services/student-profile.service";

const defaults: ProfileOptions = { levels:["gcse","igcse_o_level","a_level"], subjects:["Maths","English","Biology","Chemistry","Physics"], examBoards:["AQA","Edexcel","OCR","WJEC"], schoolYears:["Year 9","Year 10","Year 11"], targetGrades:["1","2","3","4","5","6","7","8","9"] };
const fields: {key:keyof ProfileOptions; label:string; hint:string}[]=[{key:"levels",label:"Study levels",hint:"One per line"},{key:"subjects",label:"Subjects",hint:"One per line"},{key:"examBoards",label:"Exam boards",hint:"One per line"},{key:"schoolYears",label:"School years",hint:"One per line"},{key:"targetGrades",label:"Target grades",hint:"One per line"}];

export function ProfileOptionsEditor(){
 const [options,setOptions]=useState<ProfileOptions>(defaults); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const toast=useToast();
 useEffect(()=>{let live=true;void getProfileOptions().then(r=>{if(live)setOptions(r.options);}).catch(e=>toast.error("Could not load settings",e instanceof Error?e.message:"Please retry.")).finally(()=>{if(live)setLoading(false);});return()=>{live=false;};},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setSaving(true);try{const result=await saveProfileOptions(options);setOptions(result.options);toast.success("Profile form updated","Students will see these choices in their profile form.");}catch(e){toast.error("Could not save form","Check the options and try again.");}finally{setSaving(false);}}
 return <main className="min-h-screen bg-[#f7f7fc] px-4 py-7 text-[#102b42] sm:px-6"><div className="mx-auto max-w-3xl">
  <ol aria-label="Student profile form sections" className="mb-7 flex items-center"><li className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full border-[3px] border-[#b8d8e8] bg-[#102b42] text-sm font-semibold text-white">2</span><span className="text-sm font-semibold">About you</span></li><li className="mx-3 h-px flex-1 bg-[#c9ccda]"/><li className="text-sm text-[#596579]">Shared student form settings</li></ol>
  <Link href="/staff/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#55557c]"><ArrowLeft className="size-4"/> Back to dashboard</Link><h1 className="mt-5 text-3xl font-semibold tracking-tight">Prepare the student profile form</h1><p className="mt-1 text-sm leading-6 text-[#596579]">Configure the choices students will use when they tell us about themselves.</p>
  <form onSubmit={e=>void submit(e)} className="mt-5 rounded-3xl border border-[#dedfee] bg-white p-5 shadow-sm sm:p-6"><div className="grid gap-5 sm:grid-cols-2">{fields.map(f=><label key={f.key} className="block text-sm font-semibold text-[#102b42]">{f.label}<span className="ml-2 font-normal text-[#596579]">({f.hint})</span><textarea required rows={4} value={options[f.key].join("\n")} onChange={e=>setOptions({...options,[f.key]:e.target.value.split(/\n|,/).map(x=>x.trim()).filter(Boolean)})} className="mt-2 w-full rounded-xl border border-[#c9ccda] bg-white p-3 text-sm font-normal outline-none focus:border-[#9292bf] focus:ring-2 focus:ring-[#e6e6f8]"/></label>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4"><span className="text-xs text-stone-500">These choices appear as dropdowns for every student.</span><Button type="submit" loading={saving} disabled={loading}><Save className="size-4"/> Save shared form</Button></div></form>{loading&&<p role="status" className="mt-3 text-sm text-stone-500">Loading saved choices…</p>}</div></main>;
}
