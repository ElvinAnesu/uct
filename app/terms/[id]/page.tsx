import Link from "next/link";
import { notFound } from "next/navigation";
import { RememberTerm } from "@/components/recent-terms";
import { Shell } from "@/components/shell";
import { SpeakButton } from "@/components/speak-button";
import { TermCard } from "@/components/term-card";
import { TranslationTabs } from "@/components/translation-tabs";
import { disciplineTone } from "@/lib/discipline-tones";
import { getCategory, getDiscipline, getTerm, href, languages, one, parseLang, topRelated } from "@/lib/glossary";

type Search = Record<string, string | string[] | undefined>;

export default async function TermPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Search>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const term = getTerm(Number(id));
  if (!term) notFound();

  const lang = parseLang(one(search.lang));
  const from = one(search.from) === "disciplines" ? "disciplines" : undefined;
  const state = {
    lang,
    from,
    q: one(search.q),
    discipline: one(search.discipline),
    category: one(search.category),
    page: one(search.page),
    mode: one(search.mode),
  };
  const backHref = from
    ? href("/disciplines", { lang, discipline: state.discipline, category: state.category })
    : href("/", { lang, open: 1, q: state.q, discipline: state.discipline, page: state.page, mode: state.mode });
  const discipline = getDiscipline(term.disciplineId);
  const category = getCategory(term.categoryId ?? undefined);
  const tone = disciplineTone(term.disciplineId);
  const related = topRelated(term);
  const items = languages.map((language) => ({
    id: language.id,
    label: language.label,
    term: term.translations[language.id]?.term ?? "",
    definition: term.translations[language.id]?.definition ?? "",
  }));

  return (
    <Shell lang={lang} active={from ? "disciplines" : "lookup"} wide showLanguage={false}>
      <RememberTerm
        item={{
          id: term.id,
          english: term.english,
          translations: {
            af: term.translations.af?.term,
            xh: term.translations.xh?.term,
            stL: term.translations.stL?.term,
            stSA: term.translations.stSA?.term,
            sw: term.translations.sw?.term,
          },
        }}
      />
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#10233f] hover:underline">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Back to {from ? "disciplines" : "glossary"}
      </Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start">
        <article className="relative overflow-hidden rounded-3xl border border-[#e6e1da] bg-white p-6 shadow-sm sm:p-8">
          <span className={`absolute inset-x-0 top-0 h-1.5 ${tone.bar}`} aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            {discipline ? (
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.badge}`}>{discipline.english}</span>
            ) : null}
            {category ? <span className="text-xs text-[#8a8176]">{category.english}</span> : null}
          </div>
          <p className="mt-6 text-xs font-semibold tracking-wider text-[#8a8176] uppercase">English</p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-[#10233f] sm:text-4xl">{term.english}</h1>
            <SpeakButton text={term.english} />
          </div>
          <p className="mt-4 text-base leading-relaxed text-[#3f3832]">{term.englishDefinition}</p>
        </article>
        <TranslationTabs items={items} initial={lang} />
      </div>
      {related.length ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[#10233f]">Related terms</h2>
          <ul className="mt-4 flex snap-x gap-4 overflow-x-auto pt-1 pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {related.map((item) => (
              <li key={item.id} className="w-64 shrink-0 snap-start lg:w-auto">
                <TermCard term={item} lang={lang} link={href(`/terms/${item.id}`, state)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Shell>
  );
}
