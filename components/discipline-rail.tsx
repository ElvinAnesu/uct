"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { disciplines, href } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

const icons: Record<string, ReactNode> = {
  "chemical-engineering": (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 4h10M13 4v8L7 24a5 5 0 004.6 7h8.8A5 5 0 0025 24l-6-12V4" />
      <path d="M10 20h12" />
    </svg>
  ),
  "civil-engineering": (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 22h24M7 22V12h4v10M21 22V12h4v10M11 12h10M8 12l8-6 8 6" />
    </svg>
  ),
  "electrical-engineering": (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M18 3L8 18h8l-2 11 12-17h-8l2-9z" />
    </svg>
  ),
  architecture: (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 28V12l10-7 10 7v16M6 28h20M13 28v-7h6v7M12 16h2M18 16h2M12 21h2M18 21h2" />
    </svg>
  ),
  "cross-disciplinary-terms": (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="14" r="6" />
      <circle cx="20" cy="18" r="6" />
    </svg>
  ),
};

export function DisciplineRail({ lang }: { lang: LangId }) {
  const scroller = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    scroller.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  return (
    <div className="border-y border-[#cfc8be] bg-[#fffdf9]">
      <div className="my-1 border-y border-[#cfc8be]">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-2 py-2">
          <button
            type="button"
            aria-label="Previous fields"
            onClick={() => move(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8a8176]"
          >
            <Chevron direction="left" />
          </button>
          <div
            ref={scroller}
            className="flex min-w-0 flex-1 items-center justify-between gap-6 overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {disciplines.map((discipline) => (
              <Link
                key={discipline.id}
                href={href("/disciplines", { lang, discipline: discipline.id })}
                className="flex shrink-0 items-center gap-2 text-[13px] font-bold tracking-wide text-[#10233f] uppercase"
              >
                {icons[discipline.id]}
                {discipline.english}
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next fields"
            onClick={() => move(1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8a8176]"
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={direction === "left" ? "M14 6 L8 12 L14 18" : "M10 6 L16 12 L10 18"} />
    </svg>
  );
}
