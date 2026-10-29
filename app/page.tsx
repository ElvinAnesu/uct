import Link from "next/link";
import { redirect } from "next/navigation";
import { DisciplineChips } from "@/components/discipline-chips";
import { Landing } from "@/components/landing";
import { ModeCard } from "@/components/mode-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { SpotlightTour } from "@/components/spotlight-tour";
import { cardData, TermCard } from "@/components/term-card";
import { getDiscipline, getTerm, href, one, parseLang, parseMode, searchTerms, terms } from "@/lib/glossary";

type Search = Record<string, string | string[] | undefined>;

const pageSize = 24;

export default async function LookupPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const lang = parseLang(one(params.lang));
  const query = one(params.q)?.trim() ?? "";
  const entry = getTerm(Number(one(params.entry)));
  const opened = one(params.open) === "1";
  const discipline = getDiscipline(one(params.discipline));
  const page = Math.max(1, Number(one(params.page)) || 1);
  const mode = parseMode(one(params.mode));
  const modeParam = mode === "normal" ? undefined : mode;
  const pageParam = page > 1 ? page : undefined;
  const termLink = (id: number) =>
    href(`/terms/${id}`, { lang, q: query, discipline: discipline?.id, page: pageParam, mode: modeParam });

  if (entry) {
    redirect(termLink(entry.id));
  }

  if (!query && !opened) {
    return <Landing lang={lang} />;
  }

  const pool = query ? searchTerms(query, lang) : terms;
  const matches = discipline ? pool.filter((term) => term.disciplineId === discipline.id) : pool;
  const visible = matches.slice(0, page * pageSize);
  const state = { lang, open: 1, q: query, discipline: discipline?.id, page: pageParam, mode: modeParam };

  return (
    <Shell lang={lang} active="lookup" wide mode={mode}>
      <SpotlightTour start={one(params.tour) === "1"} />
      <SearchBox lang={lang} query={query} discipline={discipline?.id} mode={modeParam} />
      <DisciplineChips lang={lang} query={query} active={discipline?.id} mode={modeParam} />
      <p className="mt-5 flex items-center justify-center gap-2 text-sm text-[#6f675e]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 7v14M3 18a1 1 0 01-1-1V4a1 1 0 011-1h5a4 4 0 014 4 4 4 0 014-4h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a3 3 0 00-3 3 3 3 0 00-3-3z" />
        </svg>
        Showing {visible.length} of {matches.length} {matches.length === 1 ? "term" : "terms"}
      </p>
      {visible.length ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((term, index) => (
            <li key={term.id} data-tour={index === 0 ? "card" : undefined}>
              {mode === "normal" ? (
                <TermCard term={term} lang={lang} link={termLink(term.id)} />
              ) : (
                <ModeCard mode={mode} card={cardData(term, lang, termLink(term.id))} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-[#d9d0c4] bg-white/60 px-6 py-12 text-center">
          <p className="font-medium text-[#10233f]">No matching terms</p>
          <p className="mt-1 text-sm text-[#6f675e]">Try another spelling, another discipline, or search in English.</p>
        </div>
      )}
      {visible.length < matches.length ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={href("/", { ...state, page: page + 1 })}
            scroll={false}
            className="inline-flex h-11 items-center rounded-xl border border-[#d9d0c4] bg-white px-6 text-sm font-semibold text-[#10233f] shadow-sm transition hover:border-[#10233f]"
          >
            Load more terms
          </Link>
        </div>
      ) : null}
    </Shell>
  );
}
