type Tone = { chip: string; active: string; badge: string; bar: string };

const tones: Record<string, Tone> = {
  "chemical-engineering": {
    chip: "border-orange-200 bg-orange-50 text-orange-800 hover:border-orange-400",
    active: "border-orange-600 bg-orange-600 text-white",
    badge: "border-orange-200 bg-orange-50 text-orange-800",
    bar: "bg-orange-400",
  },
  "civil-engineering": {
    chip: "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400",
    active: "border-blue-600 bg-blue-600 text-white",
    badge: "border-blue-200 bg-blue-50 text-blue-800",
    bar: "bg-blue-400",
  },
  "electrical-engineering": {
    chip: "border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-400",
    active: "border-violet-600 bg-violet-600 text-white",
    badge: "border-violet-200 bg-violet-50 text-violet-800",
    bar: "bg-violet-400",
  },
  architecture: {
    chip: "border-teal-200 bg-teal-50 text-teal-800 hover:border-teal-400",
    active: "border-teal-600 bg-teal-600 text-white",
    badge: "border-teal-200 bg-teal-50 text-teal-800",
    bar: "bg-teal-400",
  },
  "cross-disciplinary-terms": {
    chip: "border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-500",
    active: "border-slate-700 bg-slate-700 text-white",
    badge: "border-slate-300 bg-slate-50 text-slate-700",
    bar: "bg-slate-400",
  },
};

export function disciplineTone(id: string | undefined) {
  return (id && tones[id]) || tones["cross-disciplinary-terms"];
}
