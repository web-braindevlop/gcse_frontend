"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cx } from "@/lib/utils/cx";
import { CloseIcon, MenuIcon } from "@/components/common";
import type { NavigationItem, TopNavigationProps } from "./top-navigation.types";

function normalizedPath(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const path = href.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return path || "/";
}

function isCurrentPage(pathname: string, href: string) {
  if (href.includes("#")) return false;
  const itemPath = normalizedPath(href);
  if (!itemPath) return false;
  return itemPath === "/" ? pathname === "/" : pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function NavigationLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavigationItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
      {items.map((item) => {
        const current = isCurrentPage(pathname, item.href);
        return (
          <li key={`${item.href}:${item.label}`}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer noopener" : undefined}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={cx(
                "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2",
                current
                  ? "bg-[#e6e6f8] text-[#292943]"
                  : "text-stone-600 hover:bg-[#e6e6f8] hover:text-[#292943]",
              )}
            >
              {item.label}
              {item.external && <span className="sr-only"> (opens in a new tab)</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function TopNavigation({
  items,
  brandLabel = "Educate Cloud",
  brandHref = "/",
  navigationLabel = "Main navigation",
  actions,
  className,
}: TopNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={cx("sticky top-0 z-40 border-b border-stone-200 bg-white", className)}>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-4 py-2 text-stone-900 shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={brandHref}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-lg font-bold tracking-tight text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2"
          aria-label={`${brandLabel} home`}
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={72}
            height={72}
            priority
            className="size-16 object-contain sm:size-[4.5rem]"
          />
          <span className="sr-only">{brandLabel}</span>
        </Link>

        <nav className="hidden md:block" aria-label={navigationLabel}>
          <NavigationLinks items={items} pathname={pathname} />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-stone-300 text-stone-700 transition-colors hover:bg-[#e6e6f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2 md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      <motion.nav
        id={mobileMenuId}
        aria-label={navigationLabel}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          closed: { height: 0, opacity: 0, y: -8, pointerEvents: "none" },
          open: { height: "auto", opacity: 1, y: 0, pointerEvents: "auto" },
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute inset-x-0 top-full overflow-hidden border-b border-stone-200 bg-white px-4 shadow-lg sm:px-6 md:hidden"
      >
        <div className="py-3">
          <NavigationLinks items={items} pathname={pathname} onNavigate={closeMenu} />
        </div>
      </motion.nav>
    </header>
  );
}





