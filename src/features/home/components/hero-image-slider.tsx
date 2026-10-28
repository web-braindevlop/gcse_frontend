"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { heroSlides } from "../hero-slides";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/common";

const ROTATION_INTERVAL = 6_500;

export function HeroImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const rotationButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const activeSlide = heroSlides[activeIndex];

  function pauseWhenNavigating(event: FocusEvent<HTMLDivElement>) {
    if ((event.target as EventTarget) !== rotationButtonRef.current) setAutoRotate(false);
  }

  useEffect(() => {
    if (!autoRotate || isHovered || prefersReducedMotion || heroSlides.length < 2) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveIndex((current) => (current + 1) % heroSlides.length);
      }
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [autoRotate, isHovered, prefersReducedMotion]);

  function selectSlide(index: number) {
    setAutoRotate(false);
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }

  if (!activeSlide) return null;

  const reduceMotion = Boolean(prefersReducedMotion);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="GCSE study stories"
      className="mx-auto w-full max-w-xl lg:ml-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={pauseWhenNavigating}
    >
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-2 shadow-[0_20px_55px_-28px_rgba(25,50,40,0.32)] sm:p-2.5">
        <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-stone-100">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: "easeOut" }}
              className="absolute inset-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${activeIndex + 1} of ${heroSlides.length}: ${activeSlide.title}`}
              aria-live={autoRotate && !reduceMotion ? "off" : "polite"}
              aria-atomic="true"
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.alt}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-center"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:left-5 sm:top-5 sm:text-sm">
                {activeSlide.kicker}
              </span>
              <span className="absolute bottom-4 right-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-medium tabular-nums text-stone-700 shadow-sm sm:bottom-5 sm:right-5">
                {String(activeIndex + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:py-6">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-2xl">
              {activeSlide.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-[0.95rem]">
              {activeSlide.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-0.5" aria-label="Choose a slide">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => selectSlide(index)}
                  className="group grid size-10 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  <span className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${index === activeIndex ? "w-6 bg-[#e6e6f8]" : "w-2 bg-stone-300 group-hover:bg-[#c3c3e4]"}`} />
                </button>
              ))}
            </div>

            {!reduceMotion && (
              <button
                ref={rotationButtonRef}
                type="button"
                aria-label={autoRotate ? "Pause automatic slide rotation" : "Resume automatic slide rotation"}
                aria-pressed={autoRotate}
                onClick={() => setAutoRotate((playing) => !playing)}
                className="grid size-10 place-items-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:bg-[#e6e6f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2"
              >
                {autoRotate ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
              </button>
            )}
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => selectSlide(activeIndex - 1)}
              className="grid size-10 place-items-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:bg-[#e6e6f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => selectSlide(activeIndex + 1)}
              className="grid size-10 place-items-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:bg-[#e6e6f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8585b8] focus-visible:ring-offset-2"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



