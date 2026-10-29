"use client";

import { useState } from "react";

const steps = [
  "Choose the language you need.",
  "Search a term, or open Disciplines.",
  "Read the English term and the validated translation on the same screen.",
];

export function GuidedTour({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const last = step === steps.length - 1;

  function close() {
    setOpen(false);
    setStep(0);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className={`shrink-0 border text-sm ${
          tone === "light"
            ? "rounded-md border-[#10233f] bg-[#10233f] px-3 py-1.5 text-white"
            : "h-10 rounded-xl border-white/25 bg-white/10 px-4 font-medium text-white transition hover:bg-white/20"
        }`}
      >
        Guided tour
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#10233f]/40 p-4 sm:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="tour-title" className="w-full max-w-md rounded-3xl bg-white p-6 text-[#1c1915] shadow-xl">
            <p id="tour-title" className="text-sm font-medium text-[#6f675e]">
              {step + 1} of {steps.length}
            </p>
            <p className="mt-3 text-xl font-semibold leading-snug">{steps[step]}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button type="button" onClick={close} className="text-sm font-medium text-[#6f675e]">
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  if (last) close();
                  else setStep((current) => current + 1);
                }}
                className="rounded-full bg-[#10233f] px-5 py-2.5 text-sm font-medium text-white"
              >
                {last ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
