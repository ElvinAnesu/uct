"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const storageKey = "amathuba-tour-seen";

const steps = [
  {
    target: null,
    title: "Welcome to the Amathuba Glossary",
    text: "A short guide to finding, reading and translating engineering terms in English, Afrikaans, IsiXhosa, Sesotho and Swahili.",
  },
  { target: "search", title: "Search a term", text: "Type a word in English or in any supported language. Results update as you type." },
  {
    target: "disciplines",
    title: "Filter by discipline",
    text: "Tap a pill to show only Chemical, Civil, Electrical, Architecture or Cross-Disciplinary terms.",
  },
  { target: "language", title: "Choose your language", text: "Pick the language to translate into. Your choice applies to every card on the page." },
  {
    target: "mode",
    title: "Normal, Flip or Study",
    text: "Normal shows the translation on each card. Flip puts it on the back of the card. Study hides it so you can test yourself.",
  },
  {
    target: "card",
    title: "Open a word",
    text: "Each card shows the English term, its discipline and a short definition. Open it to see every translation and related terms.",
  },
  { target: null, title: "You are all set", text: "You can take this tour again from the Guided tour button on the home page." },
];

type Rect = { top: number; left: number; width: number; height: number };

export function SpotlightTour({ start }: { start: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const current = steps[step];
  const last = step === steps.length - 1;

  useEffect(() => {
    if (!start && window.localStorage.getItem(storageKey)) return;
    const id = window.setTimeout(() => {
      setStep(0);
      setOpen(true);
    }, 400);
    return () => window.clearTimeout(id);
  }, [start]);

  const close = useCallback(() => {
    setOpen(false);
    window.localStorage.setItem(storageKey, "1");
    const url = new URL(window.location.href);
    if (url.searchParams.has("tour")) {
      url.searchParams.delete("tour");
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    if (!open) return;
    const element = current.target ? document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`) : null;
    if (!element || !element.getClientRects().length) {
      setRect(null);
      return;
    }
    const box = element.getBoundingClientRect();
    if (box.top < 80 || box.bottom > window.innerHeight - 24) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    let frame = 0;
    const track = () => {
      const next = element.getBoundingClientRect();
      setRect((prev) =>
        prev && prev.top === next.top && prev.left === next.left && prev.width === next.width && prev.height === next.height
          ? prev
          : { top: next.top, left: next.left, width: next.width, height: next.height },
      );
      frame = window.requestAnimationFrame(track);
    };
    track();
    return () => window.cancelAnimationFrame(frame);
  }, [open, current.target]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setStep((value) => Math.min(value + 1, steps.length - 1));
      if (event.key === "ArrowLeft") setStep((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const pad = 8;
  const spot = rect ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;
  const width = Math.min(340, window.innerWidth - 32);
  const below = spot ? spot.top + spot.height + 230 < window.innerHeight : true;
  const center = spot ? spot.left + spot.width / 2 : 0;
  const left = Math.min(Math.max(center - width / 2, 16), window.innerWidth - width - 16);
  const arrowLeft = Math.min(Math.max(center - left - 8, 16), width - 32);

  const bubble = (
    <div
      key={step}
      className="relative rounded-2xl bg-white p-5 text-[#1c1915] shadow-2xl"
      style={{ width, animation: "am-fade-in 0.25s ease" }}
    >
      {spot ? (
        <span
          className={`absolute h-4 w-4 rotate-45 bg-white ${below ? "-top-2" : "-bottom-2"}`}
          style={{ left: arrowLeft }}
          aria-hidden="true"
        />
      ) : null}
      <button
        type="button"
        onClick={close}
        aria-label="Close tour"
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-[#8a8176] transition hover:bg-[#f6f5f3] hover:text-[#10233f]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <p className="text-[11px] font-semibold tracking-wider text-[#8a8176] uppercase">
        {step === 0 ? "Guided tour" : last ? "Finished" : `Step ${step} of ${steps.length - 2}`}
      </p>
      <h2 id="tour-title" className="mt-1 pr-6 text-lg font-semibold text-[#10233f]">
        {current.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#3f3832]">{current.text}</p>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {steps.map((item, index) => (
          <span
            key={item.title}
            className={`h-1.5 rounded-full transition-all ${index === step ? "w-5 bg-[#10233f]" : "w-1.5 bg-[#d9d0c4]"}`}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        {last ? (
          <span />
        ) : (
          <button type="button" onClick={close} className="text-sm font-medium text-[#6f675e] transition hover:text-[#10233f]">
            Skip tour
          </button>
        )}
        <div className="flex items-center gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#10233f] transition hover:bg-[#f6f5f3]"
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => (last ? close() : setStep(step + 1))}
            className="rounded-lg bg-[#10233f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3a66]"
          >
            {last ? "Finish" : step === 0 ? "Start tour" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {spot ? (
        <>
          <div
            className="pointer-events-none fixed rounded-2xl ring-2 ring-white/90 transition-all duration-300 ease-out"
            style={{ ...spot, boxShadow: "0 0 0 9999px rgba(12, 28, 51, 0.6)" }}
          />
          <div
            className="fixed"
            style={below ? { top: spot.top + spot.height + 14, left } : { bottom: window.innerHeight - spot.top + 14, left }}
          >
            {bubble}
          </div>
        </>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0c1c33]/60 p-4">{bubble}</div>
      )}
    </div>
  );
}
