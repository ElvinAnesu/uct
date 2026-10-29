"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { href } from "@/lib/glossary";
import type { LangId } from "@/lib/types";

const storageKey = "uct-recent-terms";

type RecentItem = {
  id: number;
  english: string;
  translations: Partial<Record<LangId, string>>;
};

export function RememberTerm({ item }: { item: RecentItem }) {
  const signature = JSON.stringify(item);
  useEffect(() => {
    const saved = JSON.parse(signature) as RecentItem;
    const current = readItems().filter((entry) => entry.id !== saved.id);
    current.unshift(saved);
    window.localStorage.setItem(storageKey, JSON.stringify(current.slice(0, 8)));
  }, [signature]);
  return null;
}

export function RecentTerms({ lang }: { lang: LangId }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(readItems());
  }, []);

  if (!items.length) {
    return <p className="px-1 pt-6 text-sm text-[#6f675e]">Search in English or your chosen language.</p>;
  }

  return (
    <section className="pt-6">
      <h2 className="px-1 text-sm font-medium text-[#6f675e]">Recent</h2>
      <ul className="mt-2 overflow-hidden rounded-2xl bg-white shadow-sm">
        {items.map((item) => (
          <li key={item.id} className="border-b border-[#efeae2] last:border-b-0">
            <Link href={href("/", { lang, open: 1, entry: item.id })} className="block px-4 py-3">
              <span className="block font-medium">{item.english}</span>
              <span className="block text-sm text-[#6f675e]">{item.translations[lang]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function readItems() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentItem);
  } catch {
    return [];
  }
}

function isRecentItem(value: unknown): value is RecentItem {
  if (!value || typeof value !== "object") return false;
  const item = value as RecentItem;
  return typeof item.id === "number" && typeof item.english === "string" && typeof item.translations === "object";
}
