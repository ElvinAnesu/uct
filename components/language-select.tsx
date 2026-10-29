"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { languages } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

const tones = {
  dark: "max-w-[6.5rem] truncate rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none sm:max-w-xs",
  light: "max-w-[6.5rem] truncate rounded-md border border-[#d9d0c4] bg-white px-3 py-1.5 text-sm text-[#10233f] outline-none sm:max-w-xs",
  plain: "max-w-[6.5rem] cursor-pointer truncate bg-transparent py-1 text-sm font-medium text-[#10233f] outline-none sm:max-w-[15rem]",
};

export function LanguageSelect({ lang, tone = "dark" }: { lang: LangId; tone?: keyof typeof tones }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="min-w-0">
      <span className="sr-only">Language</span>
      <select
        value={lang}
        className={tones[tone]}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("lang", event.target.value);
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        {languages.map((language) => (
          <option key={language.id} value={language.id} className="text-[#1c1915]">
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
