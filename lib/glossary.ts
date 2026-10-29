import raw from "@/data/glossary.json";
import type { CardMode, Category, Discipline, Glossary, LangId, Term } from "@/lib/types";
import { languageIds } from "@/lib/types";

const glossary = raw as Glossary;

export const languages = glossary.languages;
export const disciplines = glossary.disciplines;
export const categories = glossary.categories;
export const terms = glossary.terms;

export function parseLang(value: string | undefined): LangId {
  if (value && languageIds.includes(value as LangId)) return value as LangId;
  return "af";
}

export function parseMode(value: string | undefined): CardMode {
  return value === "flip" || value === "study" ? value : "normal";
}

export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function href(path: string, params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function getDiscipline(id: string | undefined) {
  return disciplines.find((item) => item.id === id);
}

export function getCategory(id: string | undefined) {
  return categories.find((item) => item.id === id);
}

export function getTerm(id: number) {
  return terms.find((item) => item.id === id);
}

export function categoriesFor(disciplineId: string) {
  return categories.filter((item) => item.disciplineId === disciplineId);
}

export function looseTerms(disciplineId: string) {
  return terms.filter((item) => item.disciplineId === disciplineId && !item.categoryId);
}

export function termsInCategory(categoryId: string) {
  return terms.filter((item) => item.categoryId === categoryId);
}

export function relatedTerms(term: Term) {
  const group = term.categoryId
    ? terms.filter((item) => item.categoryId === term.categoryId)
    : terms.filter((item) => item.disciplineId === term.disciplineId && !item.categoryId);
  return group.filter((item) => item.id !== term.id);
}

export function topRelated(term: Term, count = 5) {
  const group = relatedTerms(term);
  const fill = terms.filter((item) => item.disciplineId === term.disciplineId && item.id !== term.id && !group.includes(item));
  return [...group, ...fill].slice(0, count);
}

export function searchTerms(query: string, lang: LangId) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const phrase = words.join(" ");

  return terms
    .map((term) => ({ term, score: scoreTerm(term, words, phrase, lang) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.term.english.localeCompare(b.term.english))
    .map((item) => item.term);
}

function scoreTerm(term: Term, words: string[], phrase: string, lang: LangId) {
  const translated = term.translations[lang];
  const fields = [term.english, term.englishDefinition, translated?.term ?? "", translated?.definition ?? ""].map((field) =>
    field.toLowerCase(),
  );
  if (!words.every((word) => fields.some((field) => field.includes(word)))) return 0;

  const english = term.english.toLowerCase();
  const headword = (translated?.term ?? "").toLowerCase();
  if (english === phrase || headword === phrase) return 100;
  if (english.startsWith(phrase) || headword.startsWith(phrase)) return 80;
  if (english.includes(phrase) || headword.includes(phrase)) return 50;
  return 10;
}

export function faintLabel(item: Discipline | Category, lang: LangId) {
  const value = item.translations[lang];
  if (!value) return null;
  if (value.trim().toLowerCase() === item.english.trim().toLowerCase()) return null;
  return value;
}
