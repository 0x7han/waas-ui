import { useEffect } from "react";

export const VARIANTS = [
  { key: "A", name: "Compound components" },
  { key: "B", name: "Flat boolean props" },
  { key: "C", name: "Render props / slots" },
] as const;

export type VariantKey = (typeof VARIANTS)[number]["key"];

export function getVariant(): VariantKey {
  const v = new URLSearchParams(window.location.search).get("variant");
  return v === "B" || v === "C" ? v : "A";
}

export function setVariant(next: VariantKey): void {
  const url = new URL(window.location.href);
  url.searchParams.set("prototype", "compound-api");
  url.searchParams.set("variant", next);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function step(current: VariantKey, delta: number): VariantKey {
  const idx = VARIANTS.findIndex((v) => v.key === current);
  const len = VARIANTS.length;
  const next = VARIANTS[(idx + delta + len) % len];
  return next ? next.key : "A";
}

export function PrototypeSwitcher({ current }: { current: VariantKey }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") setVariant(step(current, 1));
      if (e.key === "ArrowLeft") setVariant(step(current, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  if (!import.meta.env.DEV) return null;
  const label = VARIANTS.find((v) => v.key === current) ?? VARIANTS[0];
  return (
    <div className="proto-switcher" role="toolbar" aria-label="Prototype variant switcher">
      <button type="button" onClick={() => setVariant(step(current, -1))} aria-label="Previous variant">
        ‹
      </button>
      <span>
        {label?.key} — {label?.name}
      </span>
      <button type="button" onClick={() => setVariant(step(current, 1))} aria-label="Next variant">
        ›
      </button>
    </div>
  );
}
