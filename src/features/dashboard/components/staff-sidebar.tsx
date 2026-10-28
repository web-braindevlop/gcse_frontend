"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, ChevronDown, GraduationCap, LayoutDashboard, Menu, Settings2, Users, X } from "lucide-react";

export type StaffSection = "overview" | "content" | "students";

const navigation: { id: StaffSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "Learning content", icon: BookOpen },
  { id: "students", label: "Students", icon: Users },
] as const;
const futureNavigation = [
  { label: "Settings", icon: Settings2 },
] as const;

function SidebarContents({ closeMenu, onSelect, currentSection }: { closeMenu?: () => void; onSelect: (section: StaffSection) => void; currentSection: StaffSection }) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="grid size-10 place-items-center rounded-xl bg-[#e6e6f8] text-[#292943]"><GraduationCap aria-hidden="true" className="size-5" /></span>
        <span className="min-w-0"><span className="block text-sm font-bold tracking-tight text-[#182331]">Educate Cloud</span><span className="mt-0.5 block text-xs text-stone-500">Teacher workspace</span></span>
      </div>
      <div className="mx-4 h-px bg-stone-100" />
      <nav aria-label="Teacher dashboard" className="px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">Workspace</p>
        <ul className="grid gap-1">
          {navigation.map(({ id, label, icon: Icon }) => (
            <li key={id}><button type="button" onClick={() => { onSelect(id); closeMenu?.(); }} aria-current={currentSection === id ? "page" : undefined} className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7777a6] ${currentSection === id ? "bg-[#f0f0fb] text-[#37375d]" : "text-stone-600 hover:bg-[#f3f3fc] hover:text-[#292943]"}`}><Icon aria-hidden="true" className={`size-[18px] transition-colors ${currentSection === id ? "text-[#62628c]" : "text-stone-400 group-hover:text-[#62628c]"}`} />{label}</button></li>
          ))}
        </ul>
        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">Coming soon</p>
        <ul className="grid gap-1">
          {futureNavigation.map(({ label, icon: Icon }) => (
            <li key={label}><span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-medium text-stone-400"><Icon aria-hidden="true" className="size-[18px]" />{label}<span className="ml-auto text-[10px] font-medium">Soon</span></span></li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-[#e7e7f6] bg-[#f8f8fe] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3d3d60]"><span className="size-2 rounded-full bg-emerald-500" />Workspace ready</div>
          <p className="mt-2 text-xs leading-5 text-stone-500">Your published learning resources will be ready for students.</p>
        </div>
      </div>
    </>
  );
}

export function StaffSidebar({ currentSection, onSelect }: { currentSection: StaffSection; onSelect: (section: StaffSection) => void }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-[252px] shrink-0 flex-col border-r border-stone-200/80 bg-white lg:flex">
        <SidebarContents currentSection={currentSection} onSelect={onSelect} />
      </aside>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-[#e6e6f8] text-[#292943]"><GraduationCap aria-hidden="true" className="size-5" /></span><span className="text-sm font-bold text-[#182331]">Educate Cloud</span></div>
        <button type="button" aria-label={open ? "Close dashboard menu" : "Open dashboard menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-[#7777a6]">{open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}</button>
      </div>
      <AnimatePresence>
        {open && <>
          <motion.button aria-label="Close dashboard menu" className="fixed inset-0 z-40 bg-[#182331]/20 lg:hidden" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="fixed inset-y-0 left-0 z-50 flex w-[min(84vw,300px)] flex-col border-r border-stone-200 bg-white shadow-xl lg:hidden" initial={reducedMotion ? false : { x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 34 }}>
            <div className="flex justify-end px-3 pt-3"><button type="button" aria-label="Close dashboard menu" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100"><ChevronDown aria-hidden="true" className="size-5 rotate-90" /></button></div>
            <SidebarContents currentSection={currentSection} onSelect={onSelect} closeMenu={() => setOpen(false)} />
          </motion.aside>
        </>}
      </AnimatePresence>
    </>
  );
}
