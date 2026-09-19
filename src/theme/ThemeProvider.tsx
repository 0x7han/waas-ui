import { useEffect, useMemo, type ReactNode } from "react";
import type { WaasBrandName, WaasThemeName } from "../tokens";
import { ThemeContext } from "./ThemeContext";

export interface ThemeProviderProps {
  /** Active theme, applied as `data-theme` on `<html>`. Defaults to `"light"`. */
  theme?: WaasThemeName;
  /** Optional brand key, applied as `data-brand` on `<html>`. Composes with the theme. */
  brand?: WaasBrandName;
  children?: ReactNode;
}

export function ThemeProvider({ theme = "light", brand, children }: ThemeProviderProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const prevTheme = el.getAttribute("data-theme");
    const prevBrand = el.getAttribute("data-brand");
    const hadDark = el.classList.contains("dark");

    el.setAttribute("data-theme", theme);
    if (brand === undefined) {
      el.removeAttribute("data-brand");
    } else {
      el.setAttribute("data-brand", brand);
    }
    el.classList.toggle("dark", theme === "dark");

    return () => {
      if (prevTheme === null) {
        el.removeAttribute("data-theme");
      } else {
        el.setAttribute("data-theme", prevTheme);
      }
      if (prevBrand === null) {
        el.removeAttribute("data-brand");
      } else {
        el.setAttribute("data-brand", prevBrand);
      }
      el.classList.toggle("dark", hadDark);
    };
  }, [theme, brand]);

  const value = useMemo(() => ({ theme, brand }), [theme, brand]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
