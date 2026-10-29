"use client";

import { useState } from "react";
import type { LangId } from "@/lib/types";

type Item = { id: LangId; label: string; term: string; definition: string };

export function TranslationTabs({ items, initial }: { items: Item[]; initial: LangId }) {
  const [active, setActive] = useState(initial);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <section className="rounded-3xl border border-[#e6e1da] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="translate-to" className="text-xs font-semibold tracking-wider text-[#8a8176] uppercase">
          Translate to
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            id="translate-to"
            value={current.id}
            onChange={(event) => setActive(event.target.value as LangId)}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[#d9d0c4] bg-white pr-10 pl-4 text-sm font-medium text-[#10233f] shadow-sm outline-none transition hover:border-[#10233f] focus:border-[#10233f] focus:ring-4 focus:ring-[#10233f]/10 sm:min-w-[16rem]"
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8a8176]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
      <div key={current.id} aria-live="polite" className="mt-6 rounded-2xl bg-[#f6f5f3] p-5 sm:p-6" style={{ animation: "am-fade-in 0.35s ease" }}>
        <p className="text-xs font-semibold tracking-wider text-[#8a8176] uppercase">{current.label}</p>
        {current.term ? (
          <>
            <p className="mt-2 text-3xl leading-tight font-semibold text-[#10233f]">{current.term}</p>
            {current.definition ? <p className="mt-3 text-base leading-relaxed text-[#3f3832]">{current.definition}</p> : null}
          </>
        ) : (
          <p className="mt-2 text-base text-[#a3988c]">Not yet translated into {current.label}.</p>
        )}
      </div>
    </section>
  );
}
