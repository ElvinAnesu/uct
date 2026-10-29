import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import os from "os";

const root = path.resolve(import.meta.dirname, "..");
const base = path.join(root, "terminologies", "Validated UCT");

const sources = {
  en: ["EBE Glossary_WIP.docx", ["word/document.xml"], "Glossary document"],
  af: ["(Afrikaans)EBE Glossary_WIP.docx", ["word/document.xml"], "Woordelysdokument"],
  xh: ["(IsiXhosa)EBE Glossary_WIP.docx", ["word/document.xml"], "Uluhlu Lwamagama (Uxwebhu lweGlosari )"],
  stL: ["(Sesotho - Lesotho Orthography) EBE Glossary_WIP.docx", ["word/header1.xml"], "Bukana ea mantsoe"],
  stSA: ["(Sesotho - SA Orthography) EBE Glossary_WIP.docx", ["word/document.xml"], "Bukana ea mantsoe"],
  sw: ["(Swahili)EBE Glossary_WIP.docx", ["word/document.xml"], "Hati ya faharasa"],
};

const DISCIPLINES = [
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical engineering",
  "Architecture",
  "Cross-Disciplinary Terms",
];

function unzip(docx) {
  const dest = path.join(os.tmpdir(), "ebe-" + Math.random().toString(16).slice(2));
  fs.mkdirSync(dest, { recursive: true });
  const zip = path.join(dest, "src.zip");
  fs.copyFileSync(docx, zip);
  const out = path.join(dest, "u");
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${out.replace(/'/g, "''")}' -Force"`,
  );
  return out;
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function squash(s) {
  return s.replace(/\s+/g, " ").trim();
}

function paragraphsFromXml(xml) {
  const paras = [];
  for (const part of xml.split(/<\/w:p>/)) {
    if (!/<w:p[\s>]/.test(part)) continue;
    const runs = [];
    const re = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>|<w:br\b[^>]*\/>/g;
    let m;
    while ((m = re.exec(part))) {
      if (m[0].startsWith("<w:br")) {
        runs.push({ br: true, bold: false, text: "\n" });
        continue;
      }
      const inner = m[1];
      const bold = /<w:b\b/.test(inner) && !/<w:b w:val="0"/.test(inner);
      const text = [...inner.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((x) => decode(x[1])).join("");
      if (!text) continue;
      runs.push({ br: false, bold, text });
    }
    const text = squash(runs.map((r) => r.text).join(""));
    if (!text || /^_+$/.test(text)) continue;
    paras.push({ runs, text });
  }
  return paras;
}

function repairSplit(term, definition) {
  if (!definition) return { term, definition };
  if (!/^[-–—]/.test(definition) && !/^[a-z(]/.test(definition)) return { term, definition };
  const bits = term.split(" ");
  const last = bits.pop() || "";
  const camel = last.match(/^(.*[a-z])([A-Z].*)$/);
  if (!camel) return { term, definition };
  bits.push(camel[1]);
  return {
    term: bits.join(" "),
    definition: squash(camel[2] + definition),
  };
}

function classify(p) {
  const content = p.runs.filter((r) => r.text.trim());
  if (!content.length) return null;
  if (content.every((r) => r.bold)) return { kind: "label", text: squash(p.text) };
  let i = 0;
  while (i < p.runs.length && (p.runs[i].br || !p.runs[i].text.trim() || p.runs[i].bold)) i++;
  const fixed = repairSplit(
    squash(p.runs.slice(0, i).map((r) => r.text).join("")),
    squash(p.runs.slice(i).map((r) => r.text).join("")),
  );
  if (!fixed.term) return { kind: "plain", text: squash(p.text) };
  return { kind: "term", term: fixed.term, definition: fixed.definition };
}

function load(key) {
  const [file, xmls, title] = sources[key];
  const dir = unzip(path.join(base, file));
  let paras = [];
  for (const rel of xmls) {
    const p = path.join(dir, rel);
    if (fs.existsSync(p)) paras = paras.concat(paragraphsFromXml(fs.readFileSync(p, "utf8")));
  }
  return paras
    .map(classify)
    .filter(Boolean)
    .filter((n) => squash(n.text || n.term || "") !== squash(title));
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normKey(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function levenshtein(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1] ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1;
    }
  }
  return m[b.length][a.length];
}

function nearDuplicate(a, b) {
  const x = normKey(a);
  const y = normKey(b);
  if (x.length < 8 || y.length < 8) return false;
  const dist = levenshtein(x, y);
  return dist / Math.max(x.length, y.length) <= 0.28;
}

function englishModel(nodes) {
  const disciplines = [];
  const categories = [];
  const terms = [];
  let discipline = null;
  let category = null;
  for (const n of nodes) {
    if (n.kind === "plain") continue;
    if (n.kind === "label" && DISCIPLINES.includes(n.text)) {
      discipline = {
        id: slug(n.text),
        english: n.text,
        translations: {},
      };
      disciplines.push(discipline);
      category = null;
      continue;
    }
    if (n.kind === "label") {
      category = {
        id: slug(discipline.english + "-" + n.text),
        disciplineId: discipline.id,
        english: n.text,
        translations: {},
      };
      categories.push(category);
      continue;
    }
    terms.push({
      id: terms.length + 1,
      disciplineId: discipline.id,
      categoryId: category ? category.id : null,
      english: n.term,
      englishDefinition: n.definition,
      translations: {},
    });
  }
  return { disciplines, categories, terms };
}

function cleanSequence(nodes) {
  const labels = [];
  const terms = [];
  for (const n of nodes) {
    if (n.kind === "label") labels.push(n.text);
    else if (n.kind === "term") terms.push({ term: n.term, definition: n.definition });
  }
  return { labels, terms };
}

function applyIndexed(model, key, nodes) {
  const { labels, terms } = cleanSequence(nodes);
  if (terms.length !== model.terms.length) {
    throw new Error(`${key} term count ${terms.length} != ${model.terms.length}`);
  }
  model.terms.forEach((term, i) => {
    term.translations[key] = terms[i];
  });
  const enLabels = [];
  for (const d of model.disciplines) {
    enLabels.push({ type: "d", id: d.id });
    for (const c of model.categories.filter((c) => c.disciplineId === d.id)) {
      enLabels.push({ type: "c", id: c.id });
    }
  }
  if (key !== "af") {
    if (labels.length !== enLabels.length) throw new Error(`${key} labels ${labels.length} != ${enLabels.length}`);
    enLabels.forEach((item, i) => {
      const target = item.type === "d" ? model.disciplines.find((d) => d.id === item.id) : model.categories.find((c) => c.id === item.id);
      target.translations[key] = labels[i];
    });
    return;
  }
  // Afrikaans has three headings where English has History & Urbanism.
  const history = model.categories.find((c) => c.english === "History & Urbanism");
  const historyAt = enLabels.findIndex((item) => item.id === history.id);
  const before = labels.slice(0, historyAt);
  const historyLabels = labels.slice(historyAt, historyAt + 3);
  const after = labels.slice(historyAt + 3);
  const afterItems = enLabels.slice(historyAt + 1);
  if (before.length !== historyAt) throw new Error("af before mismatch");
  if (after.length !== afterItems.length) throw new Error(`af after ${after.length} != ${afterItems.length}`);
  enLabels.slice(0, historyAt).forEach((item, i) => {
    const target = item.type === "d" ? model.disciplines.find((d) => d.id === item.id) : model.categories.find((c) => c.id === item.id);
    target.translations.af = before[i];
  });
  history.translations.af = historyLabels.join(" · ");
  afterItems.forEach((item, i) => {
    const target = item.type === "d" ? model.disciplines.find((d) => d.id === item.id) : model.categories.find((c) => c.id === item.id);
    target.translations.af = after[i];
  });
}

const enNodes = load("en");
const model = englishModel(enNodes);
applyIndexed(model, "af", load("af"));
applyIndexed(model, "xh", load("xh"));
applyIndexed(model, "sw", load("sw"));

function splitBoldEntry(text) {
  const camel = text.match(/^(.*?[a-z)])([A-Z].*)$/);
  if (camel && camel[1].length >= 3 && camel[2].length > 20) {
    return { term: squash(camel[1]), definition: squash(camel[2]) };
  }
  const spaced = text.match(/^(.{1,48}?) ([A-Z].{24,})$/);
  if (spaced && !/[.]/.test(spaced[1])) {
    return { term: squash(spaced[1]), definition: squash(spaced[2]) };
  }
  return null;
}

function alignSesothoLang(model, key) {
  const nodes = load(key);
  const queue = nodes.slice();
  let qi = 0;
  let lastLabel = "";
  const steps = [];
  for (const d of model.disciplines) {
    steps.push({ kind: "d", id: d.id });
    for (const t of model.terms.filter((t) => t.disciplineId === d.id && !t.categoryId)) steps.push({ kind: "t", id: t.id });
    for (const c of model.categories.filter((c) => c.disciplineId === d.id)) {
      steps.push({ kind: "c", id: c.id });
      for (const t of model.terms.filter((t) => t.categoryId === c.id)) steps.push({ kind: "t", id: t.id });
    }
  }
  const peek = () => queue[qi];
  const pull = () => queue[qi++];
  let filled = 0;
  for (const step of steps) {
    if (step.kind === "d" || step.kind === "c") {
      while (peek() && peek().kind === "plain") pull();
      if (peek() && peek().kind === "label" && lastLabel && nearDuplicate(peek().text, lastLabel)) pull();
      const node = peek();
      const headingLike = node && node.kind === "label" && node.text.length <= 70 && !/[.!?]$/.test(node.text);
      if (headingLike) {
        const text = pull().text;
        lastLabel = text;
        const target = step.kind === "d" ? model.disciplines.find((d) => d.id === step.id) : model.categories.find((c) => c.id === step.id);
        target.translations[key] = text;
      }
      continue;
    }
    let term = "";
    let definition = "";
    let node = peek();
    if (!node) continue;
    if (node.kind === "label") {
      const split = splitBoldEntry(node.text);
      if (split) {
        pull();
        term = split.term;
        definition = split.definition;
        node = null;
      } else {
        term = pull().text;
        node = peek();
      }
    }
    if (node && node.kind === "term") {
      const taken = pull();
      term = squash(`${term} ${taken.term}`);
      definition = taken.definition || "";
      if (peek() && peek().kind === "plain") definition = squash(`${definition} ${pull().text}`);
    } else if (node && node.kind === "plain") {
      definition = pull().text;
    } else if (node && node.kind === "label") {
      const next = pull().text;
      if (next.length > 45 || /[.!?]/.test(next)) definition = next;
      else term = squash(`${term} ${next}`);
    }
    let fixed = repairSplit(squash(term), squash(definition));
    fixed.term = fixed.term.replace(/^[\u2026. ]*heading\s+/i, "");
    if (!fixed.definition) {
      const split = splitBoldEntry(fixed.term);
      if (split) fixed = split;
    }
    model.terms.find((t) => t.id === step.id).translations[key] = {
      term: fixed.term,
      definition: fixed.definition,
    };
    if (fixed.term || fixed.definition) filled++;
  }
  console.log(key, "filled", filled, "leftover", queue.length - qi);
}

alignSesothoLang(model, "stL");
alignSesothoLang(model, "stSA");

function repairGluedPair(source, target) {
  if (!source?.term || !target?.term || !source.definition) return target;
  if (!target.term.startsWith(source.term) || target.term.length === source.term.length) return target;
  const extra = target.term.slice(source.term.length).trim();
  if (!extra || !source.definition.startsWith(extra)) return target;
  const rest = (target.definition || "").trim();
  const definition = source.definition.startsWith(extra + rest) ? extra + rest : squash(`${extra} ${rest}`);
  return { term: target.term.slice(0, source.term.length).trim(), definition };
}

function closeParen(entry) {
  if (!entry?.definition?.startsWith(")")) return entry;
  return {
    term: `${entry.term})`,
    definition: entry.definition.slice(1).trim(),
  };
}

for (const term of model.terms) {
  if (term.translations.stL && term.translations.stSA) {
    term.translations.stSA = repairGluedPair(term.translations.stL, term.translations.stSA);
    term.translations.stL = repairGluedPair(term.translations.stSA, term.translations.stL);
  }
  for (const key of ["stL", "stSA"]) {
    if (term.translations[key]) term.translations[key] = closeParen(term.translations[key]);
  }
}

const out = {
  languages: [
    { id: "af", label: "Afrikaans" },
    { id: "xh", label: "IsiXhosa" },
    { id: "stL", label: "Sesotho - Lesotho Orthography" },
    { id: "stSA", label: "Sesotho - SA Orthography" },
    { id: "sw", label: "Swahili" },
  ],
  disciplines: model.disciplines,
  categories: model.categories,
  terms: model.terms,
};

fs.writeFileSync(path.join(root, "data", "glossary.json"), JSON.stringify(out, null, 2), "utf8");

const sampleIds = [1, 10, 14, 40, 80, 160, 309];
for (const id of sampleIds) {
  const t = model.terms.find((t) => t.id === id);
  console.log("\n#" + id, t.english);
  for (const lang of ["af", "xh", "stL", "stSA", "sw"]) {
    const tr = t.translations[lang];
    console.log(" ", lang, tr ? `${tr.term} || ${(tr.definition || "").slice(0, 70)}` : "MISSING");
  }
}
console.log("\nDISCIPLINES");
for (const d of model.disciplines) console.log(d.english, JSON.stringify(d.translations));
console.log("terms", model.terms.length, "categories", model.categories.length);
