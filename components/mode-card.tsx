"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { CardTop, type CardData } from "@/components/card-top";

export function ModeCard({ mode, card }: { mode: "flip" | "study"; card: CardData }) {
  return mode === "flip" ? <FlipCard card={card} /> : <StudyCard card={card} />;
}

function FlipCard({ card }: { card: CardData }) {
  const [flipped, setFlipped] = useState(false);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlipped((value) => !value);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${card.english}: ${flipped ? "show English" : "show translation"}`}
      onClick={() => setFlipped((value) => !value)}
      onKeyDown={onKeyDown}
      className="group h-full cursor-pointer rounded-2xl outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-[#10233f]/30"
    >
      <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6e1da] bg-white p-5 shadow-sm transition-shadow group-hover:shadow-lg [backface-visibility:hidden]">
          <span className={`absolute inset-x-0 top-0 h-1 ${card.bar}`} aria-hidden="true" />
          <CardTop {...card} />
          <p className="mt-auto flex items-center justify-end gap-1.5 pt-5 text-xs font-medium text-[#10233f] opacity-70 transition group-hover:opacity-100">
            <FlipIcon />
            Click to translate
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-[#10233f] to-[#1a3a66] p-5 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">{card.language}</p>
          <p className="mt-2 text-xl leading-snug font-semibold">{card.translation || "Not yet translated"}</p>
          {card.translationDefinition ? (
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-white/80">{card.translationDefinition}</p>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-white/60">
              <FlipIcon />
              Flip back
            </span>
            <Link
              href={card.link}
              tabIndex={flipped ? 0 : -1}
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-white transition hover:bg-white/20"
            >
              View details
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyCard({ card }: { card: CardData }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6e1da] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <span className={`absolute inset-x-0 top-0 h-1 ${card.bar}`} aria-hidden="true" />
      <CardTop {...card} />
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          aria-expanded={revealed}
          className="block w-full rounded-xl bg-[#f6f5f3] px-3.5 py-3 text-left transition hover:bg-[#eef2f7]"
        >
          <span className="block text-[10px] font-semibold tracking-wider text-[#8a8176] uppercase">{card.language}</span>
          <span
            aria-hidden={!revealed}
            className={`mt-1 block leading-snug font-semibold text-[#10233f] transition duration-300 ${revealed ? "" : "blur-sm select-none"}`}
          >
            {card.translation || "Not yet translated"}
          </span>
          <span className="mt-1.5 block text-[11px] font-medium text-[#6f675e]">{revealed ? "Tap to hide" : "Tap to reveal"}</span>
        </button>
        <Link
          href={card.link}
          className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-[#10233f] opacity-70 transition hover:opacity-100"
        >
          View details
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

function FlipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12a9 9 0 0115.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 01-15.5 6.2L3 16M3 21v-5h5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
