import Link from "next/link";
import { href } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

export function BottomNav({ lang, active }: { lang: LangId; active: "lookup" | "disciplines" }) {
  const items = [
    { id: "lookup", label: "Lookup", href: href("/", { lang, open: 1 }) },
    { id: "disciplines", label: "Disciplines", href: href("/disciplines", { lang }) },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e4dcd2] bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex h-16 items-center justify-center text-sm font-medium ${selected ? "text-[#10233f]" : "text-[#8a8176]"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
