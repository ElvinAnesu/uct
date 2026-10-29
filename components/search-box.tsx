"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LangId } from "@/lib/types";

export function SearchBox({ lang, query, discipline, mode }: { lang: LangId; query: string; discipline?: string; mode?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    if (value === query) return;
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("open", "1");
      if (discipline) params.set("discipline", discipline);
      if (mode) params.set("mode", mode);
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      router.replace(`/?${params.toString()}`);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [value, query, lang, discipline, mode, router]);

  return (
    <form data-tour="search" action="/" method="get" className="sticky top-20 z-10 mx-auto max-w-2xl sm:top-[5.5rem]">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="open" value="1" />
      {discipline ? <input type="hidden" name="discipline" value={discipline} /> : null}
      {mode ? <input type="hidden" name="mode" value={mode} /> : null}
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8a8176]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search terms in English or any language…"
          aria-label="Search terms"
          className="w-full rounded-2xl border border-[#d9d0c4] bg-white py-3.5 pr-4 pl-12 text-base shadow-sm outline-none transition placeholder:text-[#8a8176] focus:border-[#10233f] focus:ring-4 focus:ring-[#10233f]/10"
        />
      </div>
    </form>
  );
}
