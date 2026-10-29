"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CardMode } from "@/lib/types";

const modes: { id: CardMode; label: string; icon: string }[] = [
  { id: "normal", label: "Normal", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { id: "flip", label: "Flip", icon: "M3 12a9 9 0 0115.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 01-15.5 6.2L3 16M3 21v-5h5" },
  {
    id: "study",
    label: "Study",
    icon: "M12 7v14M3 18a1 1 0 01-1-1V4a1 1 0 011-1h5a4 4 0 014 4 4 4 0 014-4h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a3 3 0 00-3 3 3 3 0 00-3-3z",
  },
];

export function ModeSwitch({ mode }: { mode: CardMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div data-tour="mode" role="radiogroup" aria-label="Card mode" className="flex h-10 shrink-0 items-center gap-0.5 rounded-xl bg-white p-1 shadow-sm">
      {modes.map((item) => {
        const selected = item.id === mode;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={selected}
            title={item.label}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (item.id === "normal") params.delete("mode");
              else params.set("mode", item.id);
              router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition lg:px-3 ${
              selected ? "bg-[#10233f] text-white shadow-sm" : "text-[#3f3832] hover:bg-[#f6f5f3]"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
