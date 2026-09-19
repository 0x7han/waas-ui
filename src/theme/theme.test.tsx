import { cleanup, render, within } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "./index";

function ThemeProbe() {
  const theme = useTheme();
  return createElement("output", { "aria-label": "theme" }, theme.theme);
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-brand");
  document.documentElement.classList.remove("dark");
});

describe("ThemeProvider", () => {
  it("defaults to light and exposes the theme value", () => {
    const { container } = render(createElement(ThemeProvider, null, createElement(ThemeProbe)));
    expect(within(container).getByLabelText("theme").textContent).toBe("light");
  });

  it("switches data-theme to dark and back", () => {
    const { container, rerender } = render(
      createElement(ThemeProvider, { theme: "light" }, createElement(ThemeProbe)),
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    rerender(createElement(ThemeProvider, { theme: "dark" }, createElement(ThemeProbe)));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(within(container).getByLabelText("theme").textContent).toBe("dark");
  });

  it("supports brand themes composed with dark mode", () => {
    render(
      createElement(
        ThemeProvider,
        { theme: "dark", brand: "acme" },
        createElement(ThemeProbe),
      ),
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-brand")).toBe("acme");
  });

  it("keeps .dark alias in sync for Radix/shadcn interop", () => {
    const { unmount } = render(
      createElement(ThemeProvider, { theme: "dark" }, createElement(ThemeProbe)),
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    unmount();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
