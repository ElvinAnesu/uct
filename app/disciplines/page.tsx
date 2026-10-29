import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import {
  categoriesFor,
  disciplines,
  faintLabel,
  getCategory,
  getDiscipline,
  getTerm,
  href,
  looseTerms,
  one,
  parseLang,
  termsInCategory,
} from "@/lib/glossary";

type Search = Record<string, string | string[] | undefined>;

export default async function DisciplinesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const lang = parseLang(one(params.lang));
  const discipline = getDiscipline(one(params.discipline));
  const category = getCategory(one(params.category));
  const entry = getTerm(Number(one(params.entry)));
  const activeCategory = category && discipline && category.disciplineId === discipline.id ? category : undefined;
  if (entry) {
    redirect(href(`/terms/${entry.id}`, { lang, from: "disciplines", discipline: discipline?.id, category: activeCategory?.id }));
  }

  return (
    <Shell lang={lang} active="disciplines">
      <Browser lang={lang} disciplineId={discipline?.id} categoryId={activeCategory?.id} />
    </Shell>
  );
}

function Browser({
  lang,
  disciplineId,
  categoryId,
}: {
  lang: ReturnType<typeof parseLang>;
  disciplineId?: string;
  categoryId?: string;
}) {
  const discipline = getDiscipline(disciplineId);
  if (!discipline) {
    return (
      <ul className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {disciplines.map((item) => {
          const faint = faintLabel(item, lang);
          return (
            <li key={item.id} className="border-b border-[#efeae2] last:border-b-0">
              <Link href={href("/disciplines", { lang, discipline: item.id })} className="block px-4 py-4">
                <span className="block text-lg font-medium">{item.english}</span>
                {faint ? <span className="mt-0.5 block text-sm text-[#a3988c]">{faint}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  const category = getCategory(categoryId);
  const disciplineFaint = faintLabel(discipline, lang);

  if (!category) {
    const groups = categoriesFor(discipline.id);
    const loose = looseTerms(discipline.id);
    return (
      <div>
        <Link href={href("/disciplines", { lang })} className="text-sm font-medium text-[#10233f]">
          Back
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{discipline.english}</h1>
        {disciplineFaint ? <p className="mt-1 text-sm text-[#a3988c]">{disciplineFaint}</p> : null}
        {loose.length ? (
          <ul className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
            {loose.map((term) => (
              <li key={term.id} className="border-b border-[#efeae2] last:border-b-0">
                <Link href={href(`/terms/${term.id}`, { lang, from: "disciplines", discipline: discipline.id })} className="block px-4 py-3">
                  <span className="block font-medium">{term.english}</span>
                  <span className="block text-sm text-[#6f675e]">{term.translations[lang]?.term}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          {groups.map((item) => {
            const faint = faintLabel(item, lang);
            return (
              <li key={item.id} className="border-b border-[#efeae2] last:border-b-0">
                <Link href={href("/disciplines", { lang, discipline: discipline.id, category: item.id })} className="block px-4 py-4">
                  <span className="block font-medium">{item.english}</span>
                  {faint ? <span className="mt-0.5 block text-sm text-[#a3988c]">{faint}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const categoryFaint = faintLabel(category, lang);
  const rows = termsInCategory(category.id);

  return (
    <div>
      <Link href={href("/disciplines", { lang, discipline: discipline.id })} className="text-sm font-medium text-[#10233f]">
        Back
      </Link>
      <p className="mt-3 text-sm text-[#6f675e]">{discipline.english}</p>
      <h1 className="text-2xl font-semibold">{category.english}</h1>
      {categoryFaint ? <p className="mt-1 text-sm text-[#a3988c]">{categoryFaint}</p> : null}
      <ul className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {rows.map((term) => (
          <li key={term.id} className="border-b border-[#efeae2] last:border-b-0">
            <Link
              href={href(`/terms/${term.id}`, { lang, from: "disciplines", discipline: discipline.id, category: category.id })}
              className="block px-4 py-3"
            >
              <span className="block font-medium">{term.english}</span>
              <span className="block text-sm text-[#6f675e]">{term.translations[lang]?.term}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
