import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");

function css(name: string): string {
  return readFileSync(join(root, "src", "tokens", name), "utf8");
}

describe("token contract", () => {
  it("declares defaults at zero specificity inside ordered layers", () => {
    const tokens = css("tokens.css");
    expect(tokens).toContain(":where(:root)");
    expect(tokens).toContain("@layer waas.tokens");
  });

  it("ships the full semantic inventory with the waas prefix", () => {
    const tokens = css("tokens.css");
    for (const token of [
      "--waas-bg",
      "--waas-text",
      "--waas-border",
      "--waas-input",
      "--waas-ring",
      "--waas-on-accent",
      "--waas-font-body",
      "--waas-space-md",
      "--waas-radius",
      "--waas-radius-lg",
      "--waas-elevation-md",
      "--waas-duration-base",
      "--waas-ease-standard",
      "--waas-bp-tablet",
    ]) {
      expect(tokens, token).toContain(token);
    }
    expect(tokens).not.toContain("--waas-button-bg");
    expect(tokens).not.toContain("--waas-card-bg");
  });

  it("remaps themes via data-theme with a dark alias and OS fallback", () => {
    const themes = css("theme.css");
    expect(themes).toContain('[data-theme="dark"]');
    expect(themes).toContain(".dark");
    expect(themes).toContain("prefers-color-scheme");
    expect(themes).toContain(":root:not([data-theme])");
  });

  it("collapses motion under prefers-reduced-motion", () => {
    const bundle = `${css("tokens.css")}\n${css("theme.css")}`;
    expect(bundle).toContain("prefers-reduced-motion");
    expect(bundle).toContain("--waas-duration-instant");
  });

  it("derives radius from a single base and adapts shadows per theme", () => {
    const tokens = css("tokens.css");
    expect(tokens).toContain("var(--waas-radius)");
    expect(tokens).toContain("--waas-shadow-color");
    expect(tokens).toContain("--waas-shadow-strength");
  });
});
