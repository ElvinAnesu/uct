"use client";

import { useRef } from "react";
import Link from "next/link";
import { href, languages } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

export function LanguageRail({ lang }: { lang: LangId }) {
  const scroller = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    scroller.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  return (
    <div className="border-t border-[#e6e1da] bg-[#fffdf9]">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-2 py-3">
        <button
          type="button"
          aria-label="Previous languages"
          onClick={() => move(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8a8176]"
        >
          <Chevron direction="left" />
        </button>
        <div
          ref={scroller}
          className="flex min-w-0 flex-1 items-center gap-8 overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {languages.map((language) => {
            const selected = language.id === lang;
            return (
              <Link
                key={language.id}
                href={href("/", { lang: language.id })}
                className={`shrink-0 text-[13px] font-bold tracking-wide uppercase ${
                  selected ? "text-[#10233f]" : "text-[#8a8176]"
                }`}
              >
                {language.label}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Next languages"
          onClick={() => move(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[#8a8176]"
        >
          <Chevron direction="right" />
        </button>
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
