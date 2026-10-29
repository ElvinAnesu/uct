import Link from "next/link";
import { HeroLanguages } from "@/components/hero-languages";
import { LandingVisual } from "@/components/landing-visual";
import { DisciplineRail } from "@/components/discipline-rail";
import { disciplines, faintLabel, href } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

const steps = [
  { title: "Choose a language", text: "Afrikaans, IsiXhosa, Sesotho, or Swahili. The choice stays with you." },
  { title: "Find the term", text: "Search the word from the lecture, or open a discipline and a subject group." },
  { title: "Read both meanings", text: "The English term and the validated translation stay on the same screen." },
];

export function Landing({ lang }: { lang: LangId }) {
  const openHref = href("/", { lang, open: 1 });

  return (
    <div className="bg-[#f6f5f3] text-[#1c1915]">
      <header className="sticky top-0 z-20 border-b border-[#e6e1da] bg-[#fffdf9]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10233f] text-white shadow-sm sm:flex">
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
              <span className="block truncate text-base font-semibold tracking-tight text-[#10233f] sm:text-lg">
                Amathuba<span className="hidden sm:inline"> Multilingual Glossary</span>
              </span>
              <span className="hidden text-xs text-[#6f675e] sm:block">Engineering Built Environment • UCT</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={href("/", { lang, open: 1, tour: 1 })}
              className="shrink-0 rounded-md border border-[#10233f] bg-[#10233f] px-3 py-1.5 text-sm text-white"
            >
              Guided tour
            </Link>
          </div>
        </div>
      </header>

      <section className="flex min-h-[calc(100dvh-4rem)] flex-col">
        <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-6 py-8 md:grid-cols-2 md:gap-4 md:py-6">
          <HeroLanguages />
          <LandingVisual />
          <div className="max-w-xl md:justify-self-start">
            <h1 className="text-4xl font-semibold tracking-tight text-[#10233f] sm:text-5xl">Amathuba Multilingual Glossary</h1>
            <p className="mt-3 text-base text-[#6f675e]">Engineering Built Environment • UCT</p>
            <p className="mt-5 text-lg leading-relaxed text-[#3f3832]">
              Validated engineering terms in Afrikaans, IsiXhosa, Sesotho - Lesotho Orthography, Sesotho - SA Orthography, and Swahili.
            </p>
            <Link
              href={openHref}
              className="mt-8 inline-flex h-12 items-center rounded-2xl bg-[#10233f] px-6 text-sm font-semibold tracking-wide text-white uppercase"
            >
              Open glossary
            </Link>
          </div>
        </div>
        <DisciplineRail lang={lang} />
      </section>

      <section className="flex min-h-dvh items-center bg-[#fffdf9]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-[#10233f] sm:text-5xl">The lecture term, in the language you need.</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#3f3832]">
              Amathuba is a glossary for Engineering and the Built Environment. Each entry is a validated term, not a lesson.
            </p>
          </div>
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-[#e6e1da] pt-6">
                <p className="text-sm font-semibold tracking-wide text-[#8a8176] uppercase">0{index + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#10233f]">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[#3f3832]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex min-h-dvh items-center bg-[#10233f] text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">300+ validated terms.</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
              Grouped by the disciplines in the Engineering and Built Environment glossary.
            </p>
            <Link
              href={openHref}
              className="mt-8 inline-flex h-12 items-center rounded-2xl bg-white px-6 text-sm font-semibold tracking-wide text-[#10233f] uppercase"
            >
              Open glossary
            </Link>
          </div>
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {disciplines.map((discipline) => {
              const faint = faintLabel(discipline, lang);
              return (
                <li key={discipline.id} className="py-4">
                  <p className="text-xl font-medium">{discipline.english}</p>
                  {faint ? <p className="mt-1 text-sm text-white/55">{faint}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
