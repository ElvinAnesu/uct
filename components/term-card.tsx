import Link from "next/link";
import { CardTop, type CardData } from "@/components/card-top";
import { disciplineTone } from "@/lib/discipline-tones";
import { getCategory, getDiscipline, languages } from "@/lib/glossary";
import type { LangId, Term } from "@/lib/types";

export function cardData(term: Term, lang: LangId, link: string): CardData {
  const tone = disciplineTone(term.disciplineId);
  const translation = term.translations[lang];
  return {
    discipline: getDiscipline(term.disciplineId)?.english,
    category: getCategory(term.categoryId ?? undefined)?.english,
    badge: tone.badge,
    bar: tone.bar,
    english: term.english,
    definition: term.englishDefinition,
    language: languages.find((item) => item.id === lang)?.label ?? "",
    translation: translation?.term ?? "",
    translationDefinition: translation?.definition ?? "",
    link,
  };
}

export function TermCard({ term, lang, link, selected = false }: { term: Term; lang: LangId; link: string; selected?: boolean }) {
  const card = cardData(term, lang, link);

  return (
    <Link
      href={link}
      aria-current={selected ? "true" : undefined}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? "border-[#10233f] ring-2 ring-[#10233f]/15" : "border-[#e6e1da] hover:border-[#cfc8be]"
      }`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${card.bar}`} aria-hidden="true" />
      <CardTop {...card} />
      <div className="mt-auto pt-5">
        <div className="rounded-xl bg-[#f6f5f3] px-3.5 py-3 transition group-hover:bg-[#eef2f7]">
          <p className="text-[10px] font-semibold tracking-wider text-[#8a8176] uppercase">{card.language}</p>
          <p className={`mt-1 leading-snug font-semibold ${card.translation ? "text-[#10233f]" : "text-[#a3988c]"}`}>
            {card.translation || "Not yet translated"}
          </p>
        </div>
        <p className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-[#10233f] opacity-70 transition group-hover:opacity-100">
          View details
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </p>
      </div>
    </Link>
  );
}
