"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

export type ToastVariant = "error" | "success" | "warning" | "info";

type ToastItem = {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
};

type ToastContextValue = {
  showToast: (variant: ToastVariant, title: string, description?: string, duration?: number) => void;
  dismissToast: (id: number) => void;
  pauseToast: (id: number) => void;
  resumeToast: (item: ToastItem) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const MAX_VISIBLE_TOASTS = 4;
const DEFAULT_DURATION = 5_000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const pauseToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const resumeToast = useCallback((item: ToastItem) => {
    if (item.duration <= 0 || timers.current.has(item.id)) return;
    timers.current.set(item.id, setTimeout(() => dismissToast(item.id), item.duration));
  }, [dismissToast]);

  const showToast = useCallback((variant: ToastVariant, title: string, description?: string, duration = DEFAULT_DURATION) => {
    const item = { id: ++nextId.current, variant, title, description, duration };
    setToasts((current) => {
      const next = [...current, item];
      const removed = next.splice(0, Math.max(0, next.length - MAX_VISIBLE_TOASTS));
      for (const old of removed) {
        const timer = timers.current.get(old.id);
        if (timer) clearTimeout(timer);
        timers.current.delete(old.id);
      }
      return next;
    });
    if (duration > 0) {
      timers.current.set(item.id, setTimeout(() => dismissToast(item.id), duration));
    }
  }, [dismissToast]);

  useEffect(() => () => {
    for (const timer of timers.current.values()) clearTimeout(timer);
    timers.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, pauseToast, resumeToast }}>
      {children}
      <ToastViewport
        toasts={toasts}
        dismissToast={dismissToast}
        pauseToast={pauseToast}
        resumeToast={resumeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");

  return {
    error: (title: string, description?: string, duration?: number) => context.showToast("error", title, description, duration),
    success: (title: string, description?: string, duration?: number) => context.showToast("success", title, description, duration),
    warning: (title: string, description?: string, duration?: number) => context.showToast("warning", title, description, duration),
    info: (title: string, description?: string, duration?: number) => context.showToast("info", title, description, duration),
  };
}

function ToastViewport({
  toasts,
  dismissToast,
  pauseToast,
  resumeToast,
}: {
  toasts: ToastItem[];
  dismissToast: (id: number) => void;
  pauseToast: (id: number) => void;
  resumeToast: (item: ToastItem) => void;
}) {
  return (
    <ol
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex max-h-[calc(100dvh-2rem)] flex-col items-center gap-3 overflow-y-auto sm:inset-x-auto sm:right-6 sm:top-6 sm:w-[min(22rem,calc(100vw-3rem))] sm:items-stretch"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => (
          <ToastCard
            key={item.id}
            item={item}
            onDismiss={() => dismissToast(item.id)}
            onMouseEnter={() => pauseToast(item.id)}
            onMouseLeave={() => resumeToast(item)}
            onFocus={() => pauseToast(item.id)}
            onBlur={() => resumeToast(item)}
          />
        ))}
      </AnimatePresence>
    </ol>
  );
}

function ToastCard({
  item,
  onDismiss,
  ...timerEvents
}: {
  item: ToastItem;
  onDismiss: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const config = toastStyles[item.variant];
  const Icon = config.icon;

  return (
    <motion.li
      layout
      role={item.variant === "error" ? "alert" : "status"}
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={timerEvents.onMouseEnter}
      onMouseLeave={timerEvents.onMouseLeave}
      onFocus={timerEvents.onFocus}
      onBlur={timerEvents.onBlur}
      className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-[0_12px_36px_rgba(34,42,77,0.15)] ring-1 ring-[#d9d9ef]/80 backdrop-blur sm:p-4"
    >
      <span aria-hidden="true" className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${config.iconBackground}`}>
        <Icon className="size-[17px]" strokeWidth={2.5} />
      </span>
      <span className="min-w-0 flex-1 pt-0.5">
        <span className={`block text-sm font-semibold leading-5 ${config.titleColor}`}>{item.title}</span>
        {item.description && <span className="mt-0.5 block text-[13px] leading-5 text-stone-700">{item.description}</span>}
      </span>
      <button
        type="button"
        aria-label={`Dismiss ${item.variant} notification`}
        onClick={onDismiss}
        className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7777a6]"
      >
        <X aria-hidden="true" className="size-[17px]" />
      </button>
    </motion.li>
  );
}

const toastStyles = {
  error: { icon: CircleAlert, iconBackground: "bg-rose-500 text-white", titleColor: "text-rose-700" },
  success: { icon: CircleCheck, iconBackground: "bg-emerald-500 text-white", titleColor: "text-emerald-700" },
  warning: { icon: TriangleAlert, iconBackground: "bg-amber-400 text-white", titleColor: "text-amber-700" },
  info: { icon: Info, iconBackground: "bg-blue-600 text-white", titleColor: "text-blue-700" },
} satisfies Record<ToastVariant, { icon: typeof Info; iconBackground: string; titleColor: string }>;
