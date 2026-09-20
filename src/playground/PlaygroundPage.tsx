import { useState } from "react";
import { ThemeProvider } from "../theme";
import type { WaasBrandName, WaasThemeName } from "../tokens";
import "../tokens/tokens.css";
import "../tokens/theme.css";
import "../components/button/button.css";
import "../components/form/form.css";
import "../components/selection/selection.css";
import "../components/navigation/navigation.css";
import "../components/overlay/overlay.css";
import "../components/data/data.css";
import "./playground.css";
import { ButtonSection } from "./ButtonSection";
import { DataSection } from "./DataSection";
import { FormSection } from "./FormSection";
import { NavigationSection } from "./NavigationSection";
import { OverlaySection } from "./OverlaySection";
import { SelectionSection } from "./SelectionSection";
import { TokenSection } from "./TokenSection";

const SECTIONS = [
  { id: "tokens", label: "Tokens" },
  { id: "button", label: "Button" },
  { id: "form", label: "Form" },
  { id: "selection", label: "Selection" },
  { id: "navigation", label: "Navigation" },
  { id: "overlay", label: "Overlay" },
  { id: "data", label: "Data" },
] as const;

export function PlaygroundPage() {
  const [theme, setTheme] = useState<WaasThemeName>("light");
  const [brand, setBrand] = useState<WaasBrandName | undefined>(undefined);

  return (
    <ThemeProvider theme={theme} brand={brand}>
      <div className="pg-root">
        <header className="pg-topbar">
          <h1 className="pg-brand">
            waas-ui playground
            <small>Dev-only gallery. Not published to NPM.</small>
          </h1>
          <div className="pg-topbar-spacer" />
          <div className="pg-theme-toggle" role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
              Light
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
              Dark
            </button>
          </div>
          <div className="pg-theme-toggle" role="group" aria-label="Brand">
            <button type="button" aria-pressed={brand === undefined} onClick={() => setBrand(undefined)}>
              Default
            </button>
            <button type="button" aria-pressed={brand === "acme"} onClick={() => setBrand("acme")}>
              Acme
            </button>
          </div>
        </header>
        <div className="pg-layout">
          <nav className="pg-nav" aria-label="Sections">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
          <main className="pg-main">
            <TokenSection />
            <ButtonSection />
            <FormSection />
            <SelectionSection />
            <NavigationSection />
            <OverlaySection />
            <DataSection />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
