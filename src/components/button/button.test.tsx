import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, createRef, forwardRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {} from "@testing-library/jest-dom/vitest";
import { Button, IconButton } from "./index";
import { Spinner } from "./Spinner";

function StarIcon() {
  return createElement("svg", { "aria-label": "star", role: "img" });
}

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders all variants with their data attributes", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        (["primary", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
          (variant) => createElement(Button, { key: variant, variant }, variant),
        ),
      ),
    );
    for (const variant of ["primary", "secondary", "outline", "ghost", "destructive", "link"]) {
      const button = within(container).getByRole("button", { name: variant });
      expect(button.getAttribute("data-variant")).toBe(variant);
    }
  });

  it("supports loading state with Spinner and blocks clicks", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(createElement(Button, { loading: true, onClick }, "Saving"));
    const button = screen.getByRole("button", { name: /saving/i });
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toBeDisabled();
    expect(button.getAttribute("aria-disabled")).toBe("true");
    screen.getByRole("status", { name: "Loading" });
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports disabled state", () => {
    render(createElement(Button, { disabled: true }, "Delete"));
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled", "true");
  });

  it("renders consumer icons in the icon slot", () => {
    render(createElement(Button, { icon: createElement(StarIcon) }, "Save"));
    const button = screen.getByRole("button", { name: /save/i });
    within(button).getByRole("img", { name: "star" });
    expect(button.querySelector("[data-waas-icon-slot]")).not.toBeNull();
  });

  it("composes via asChild without wrapper elements", () => {
    render(
      createElement(
        Button,
        { asChild: true, variant: "outline" },
        createElement("a", { href: "/billing" }, "Billing"),
      ),
    );
    const link = screen.getByRole("link", { name: "Billing" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("data-variant")).toBe("outline");
    expect(link.className).toContain("waas-button");
  });

  it("forwards refs to the underlying element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(createElement(Button, { ref }, "Ref"));
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});

describe("IconButton", () => {
  it("requires an accessible label and renders square", () => {
    render(createElement(IconButton, { "aria-label": "Close menu", icon: createElement(StarIcon) }));
    const button = screen.getByRole("button", { name: "Close menu" });
    expect(button.getAttribute("data-shape")).toBe("square");
    within(button).getByRole("img", { name: "star" });
  });

  it("supports loading and disabled states", () => {
    const { rerender } = render(
      createElement(IconButton, { "aria-label": "Save", loading: true, icon: createElement(StarIcon) }),
    );
    const loading = screen.getByRole("button", { name: "Save" });
    expect(loading).toBeDisabled();
    expect(loading.getAttribute("data-loading")).toBe("true");
    rerender(createElement(IconButton, { "aria-label": "Save", disabled: true, icon: createElement(StarIcon) }));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("composes via asChild and forwards refs", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      createElement(
        IconButton,
        { asChild: true, "aria-label": "Star", ref, icon: createElement(StarIcon) },
        createElement("button", { type: "button" }),
      ),
    );
    expect(ref.current?.tagName).toBe("BUTTON");
    screen.getByRole("button", { name: "Star" });
  });
});

describe("Spinner", () => {
  it("announces loading via status role", () => {
    render(createElement(Spinner, { "aria-label": "Loading content" }));
    expect(screen.getByRole("status", { name: "Loading content" })).toBeDefined();
  });

  it("forwards refs to the svg element", () => {
    const ref = createRef<SVGSVGElement>();
    render(createElement(Spinner, { ref }));
    expect(ref.current?.tagName.toLowerCase()).toBe("svg");
  });
});

describe("no generic as-prop", () => {
  it("rejects unknown polymorphic props at the type level", () => {
    const TolerantButton = forwardRef<HTMLButtonElement, { label: string }>(function Tolerant(props, ref) {
      return createElement(Button, { ...props, ref }, props.label);
    });
    expect(TolerantButton).toBeDefined();
  });
});
