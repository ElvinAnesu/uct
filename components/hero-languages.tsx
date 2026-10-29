"use client";

import { useEffect, useState } from "react";
import { languages } from "@/lib/glossary";

const spots = [
  { left: "18%", top: "9%" },
  { left: "4%", top: "61%" },
  { left: "2%", top: "18%" },
  { left: "19%", top: "83%" },
  { left: "13%", top: "34%" },
  { left: "6%", top: "84%" },
  { left: "13%", top: "57%" },
  { left: "30%", top: "85%" },
];

export function HeroLanguages() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((value) => value + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const spot = spots[step % spots.length];
  const language = languages[step % languages.length];

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      <span
        key={step}
        className="absolute text-xs font-semibold whitespace-nowrap text-[#10233f] uppercase"
        style={{ ...spot, animation: "am-word 2.6s ease-in-out forwards" }}
      >
        {language.label}
        <span
          className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left bg-[#10233f]/40"
          style={{ animation: "am-underline 2.6s ease-in-out forwards" }}
        />
      </span>
    </div>
  );
}
