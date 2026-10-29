import Link from "next/link";
import { disciplineTone } from "@/lib/discipline-tones";
import { disciplines, href } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

const base = "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition";

export function DisciplineChips({ lang, query, active, mode }: { lang: LangId; query: string; active?: string; mode?: string }) {
  return (
    <nav
      data-tour="disciplines"
      aria-label="Filter by discipline"
      className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center [&::-webkit-scrollbar]:hidden"
    >
      <Link
        href={href("/", { lang, open: 1, q: query, mode })}
        aria-current={active ? undefined : "true"}
        className={`${base} ${active ? "border-[#d9d0c4] bg-white text-[#3f3832] hover:border-[#10233f]" : "border-[#10233f] bg-[#10233f] text-white"}`}
      >
        All disciplines
      </Link>
      {disciplines.map((discipline) => {
        const tone = disciplineTone(discipline.id);
        const selected = discipline.id === active;
        return (
          <Link
            key={discipline.id}
            href={href("/", { lang, open: 1, q: query, discipline: discipline.id, mode })}
            aria-current={selected ? "true" : undefined}
            className={`${base} ${selected ? tone.active : tone.chip}`}
          >
            {discipline.english}
          </Link>
        );
      })}
    </nav>
  );
}
