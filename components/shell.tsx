import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { LanguageSelect } from "@/components/language-select";
import { ModeSwitch } from "@/components/mode-switch";
import { href } from "@/lib/glossary";
import type { CardMode, LangId } from "@/lib/types";

export function Shell({
  lang,
  active,
  wide = false,
  showLanguage = true,
  mode,
  children,
}: {
  lang: LangId;
  active: "lookup" | "disciplines";
  wide?: boolean;
  showLanguage?: boolean;
  mode?: CardMode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#f6f5f3] text-[#1c1915]">
      <header className="sticky top-0 z-20 bg-linear-to-r from-[#0c1c33] via-[#10233f] to-[#1a3a66] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px]">
          <Link href={href("/", { lang })} className="flex min-w-0 items-center gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 sm:flex">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold tracking-tight sm:text-lg">
                Amathuba<span className="hidden sm:inline"> Multilingual Glossary</span>
              </span>
              <span className="hidden text-xs text-white/70 sm:block">Engineering Built Environment • UCT</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            {showLanguage ? (
              <div data-tour="language" className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-3 text-[#10233f] shadow-sm">
                <svg viewBox="0 0 24 24" className="hidden h-4 w-4 sm:block" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20M2 12h20" />
                </svg>
                <span className="hidden text-xs text-[#6f675e] md:inline">Translate to:</span>
                <Suspense fallback={null}>
                  <LanguageSelect lang={lang} tone="plain" />
                </Suspense>
              </div>
            ) : null}
            {mode ? (
              <Suspense fallback={null}>
                <ModeSwitch mode={mode} />
              </Suspense>
            ) : null}
          </div>
        </div>
      </header>
      <main className={`mx-auto w-full px-4 pt-6 pb-28 ${wide ? "max-w-6xl" : "max-w-5xl"}`}>{children}</main>
      <BottomNav lang={lang} active={active} />
    </div>
  );
}
