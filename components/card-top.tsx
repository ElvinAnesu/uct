export type CardData = {
  discipline?: string;
  category?: string;
  badge: string;
  bar: string;
  english: string;
  definition: string;
  language: string;
  translation: string;
  translationDefinition: string;
  link: string;
};

export function CardTop({ discipline, category, badge, english, definition }: CardData) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        {discipline ? <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge}`}>{discipline}</span> : null}
        {category ? <span className="line-clamp-2 text-right text-[11px] leading-tight text-[#8a8176]">{category}</span> : null}
      </div>
      <h3 className="mt-4 text-lg leading-snug font-semibold text-[#10233f]">{english}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#6f675e]">{definition}</p>
    </>
  );
}
