export const languageIds = ["af", "xh", "stL", "stSA", "sw"] as const;

export type LangId = (typeof languageIds)[number];

export type CardMode = "normal" | "flip" | "study";

export type Language = {
  id: LangId;
  label: string;
};

export type Translation = {
  term: string;
  definition: string;
};

export type Discipline = {
  id: string;
  english: string;
  translations: Partial<Record<LangId, string>>;
};

export type Category = {
  id: string;
  disciplineId: string;
  english: string;
  translations: Partial<Record<LangId, string>>;
};

export type Term = {
  id: number;
  disciplineId: string;
  categoryId: string | null;
  english: string;
  englishDefinition: string;
  translations: Partial<Record<LangId, Translation>>;
};

export type Glossary = {
  languages: Language[];
  disciplines: Discipline[];
  categories: Category[];
  terms: Term[];
};
