"use client";

export function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      aria-label="Hear term"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9d0c4] bg-white text-[#10233f]"
      onClick={() => {
        if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-ZA";
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10v4h3l4 3V7L7 10H4z" />
        <path d="M16 9a4 4 0 010 6" />
        <path d="M18.5 7a7 7 0 010 10" />
      </svg>
    </button>
  );
}
