import type { ReactNode } from "react";

export function Section({ id, title, blurb, children }: { id: string; title: string; blurb: string; children: ReactNode }) {
  return (
    <section className="pg-section" id={id} aria-label={title}>
      <h2>{title}</h2>
      <p>{blurb}</p>
      {children}
    </section>
  );
}

export function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pg-demo">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.8 3.9 4.2.4-3.1 2.9.8 4.1L8 10.7l-3.7 2.1.8-4.1L2 5.8l4.2-.4L8 1.5z" />
    </svg>
  );
}
