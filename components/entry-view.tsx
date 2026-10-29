import Link from "next/link";
import { RememberTerm } from "@/components/recent-terms";
import { SpeakButton } from "@/components/speak-button";
import { faintLabel, getCategory, getDiscipline, href, languages, relatedTerms } from "@/lib/glossary";
import type { LangId, Term } from "@/lib/types";

export function EntryView({ term, lang, backHref }: { term: Term; lang: LangId; backHref: string }) {
  const discipline = getDiscipline(term.disciplineId);
  const category = getCategory(term.categoryId ?? undefined);
  const translation = term.translations[lang];
  const language = languages.find((item) => item.id === lang);
  const related = relatedTerms(term);
  const disciplineFaint = discipline ? faintLabel(discipline, lang) : null;
  const categoryFaint = category ? faintLabel(category, lang) : null;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
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
      <Link href={backHref} className="text-sm font-medium text-[#10233f]">
        Back
      </Link>
      {discipline ? (
        <p className="mt-4 text-sm font-medium text-[#10233f]">
          {discipline.english}
          {disciplineFaint ? <span className="mt-0.5 block font-normal text-[#a3988c]">{disciplineFaint}</span> : null}
        </p>
      ) : null}
      {category ? (
        <p className="mt-2 text-sm text-[#6f675e]">
          {category.english}
          {categoryFaint ? <span className="mt-0.5 block text-[#a3988c]">{categoryFaint}</span> : null}
        </p>
      ) : null}
      <div className="mt-5 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{term.english}</h1>
        <SpeakButton text={term.english} />
      </div>
      <p className="mt-2 text-base leading-relaxed text-[#3f3832]">{term.englishDefinition}</p>
      <div className="my-5 h-px bg-[#efeae2]" />
      <p className="text-xs font-medium uppercase tracking-wide text-[#8a8176]">{language?.label}</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h2 className="text-3xl font-semibold leading-tight text-[#10233f]">{translation?.term}</h2>
        {translation?.term ? <SpeakButton text={translation.term} /> : null}
      </div>
      {translation?.definition ? <p className="mt-3 text-base leading-relaxed">{translation.definition}</p> : null}
      {related.length ? (
        <section className="mt-8">
          <h3 className="text-sm font-medium text-[#6f675e]">Also in this group</h3>
          <ul className="mt-2 divide-y divide-[#efeae2]">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={href(backHref.split("?")[0] || "/", keepEntry(backHref, item.id))} className="block py-3">
                  <span className="block font-medium">{item.english}</span>
                  <span className="block text-sm text-[#6f675e]">{item.translations[lang]?.term}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function keepEntry(backHref: string, id: number) {
  const url = new URL(backHref, "http://uct.local");
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (key !== "entry") params[key] = value;
  });
  params.entry = String(id);
  return params;
}
