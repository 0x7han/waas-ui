import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const componentsDir = join(root, "src", "components");
const playgroundDir = join(root, "src", "playground");

// Non-visual exports: helpers, hooks, and stores need no gallery demo.
const NON_VISUAL = new Set([
  "useFormField",
  "FormFieldContext",
  "getPaginationItems",
  "createToastStore",
  "getDefaultToastStore",
  "dismissToast",
  "toast",
]);

// Barrel names that are aliases of a showcased compound namespace:
// FormField.* parts render through the FormField namespace object, and
// RadioGroupItem is the same component as RadioItem.
const ALIASED: Record<string, string[]> = {
  FormFieldRoot: ["FormField.Root"],
  FormFieldLabel: ["FormField.Label"],
  FormFieldDescription: ["FormField.Description"],
  FormFieldError: ["FormField.Error"],
  RadioGroupItem: ["RadioItem", "RadioGroupItem"],
};

function publicExports(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const family of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!family.isDirectory()) continue;
    const barrel = join(componentsDir, family.name, "index.ts");
    const text = readFileSync(barrel, "utf8");
    const names = new Set<string>();
    for (const match of text.matchAll(/export\s*\{([^}]+)\}/g)) {
      const group = match[1];
      if (group === undefined) continue;
      for (const part of group.split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name !== undefined && name !== "" && !name.startsWith("type ")) {
          names.add(name);
        }
      }
    }
    out.set(family.name, [...names].sort());
  }
  return out;
}

function playgroundText(): string {
  return readdirSync(playgroundDir)
    .filter((file) => file.endsWith(".tsx") && file !== "coverage.test.ts")
    .map((file) => readFileSync(join(playgroundDir, file), "utf8"))
    .join("\n");
}

describe("playground coverage gate", () => {
  it("showcases every visual public export", () => {
    const text = playgroundText();
    const missing: string[] = [];
    for (const [family, names] of publicExports()) {
      for (const name of names) {
        if (NON_VISUAL.has(name)) continue;
        const candidates = ALIASED[name] ?? [name];
        const shown = candidates.some((candidate) => new RegExp(`\\b${candidate}\\b`).test(text));
        if (!shown) {
          missing.push(`${family}/${name}`);
        }
      }
    }
    expect(missing, `missing playground demos: ${missing.join(", ")}`).toEqual([]);
  });
});
