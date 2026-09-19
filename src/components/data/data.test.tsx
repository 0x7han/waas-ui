import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {} from "@testing-library/jest-dom/vitest";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  Separator,
  Skeleton,
  StatCard,
  Table,
} from "./index";

function StarIcon() {
  return createElement("svg", { "aria-label": "star", role: "img" });
}

afterEach(() => {
  cleanup();
});

function OrdersTable() {
  return createElement(
    Table.Root,
    { mobileStrategy: "cards", id: "orders-root" },
    createElement(
      Table.Toolbar,
      null,
      createElement(Table.Search, { "aria-label": "Search orders", placeholder: "Search…" }),
      createElement(
        Table.Filters,
        { "aria-label": "Status filters" },
        createElement("button", { type: "button" }, "All"),
        createElement("button", { type: "button" }, "Paid"),
      ),
    ),
    createElement(
      Table,
      { "aria-label": "Orders", scrollLabel: "Orders scroll region" },
      createElement(Table.Caption, null, "Recent orders"),
      createElement(
        Table.Head,
        null,
        createElement(
          Table.Row,
          null,
          createElement(Table.HeaderCell, { priority: 1 }, "Order"),
          createElement(Table.HeaderCell, { priority: 2 }, "Customer"),
          createElement(Table.HeaderCell, { priority: 3 }, "Notes"),
        ),
      ),
      createElement(
        Table.Body,
        null,
        createElement(
          Table.Row,
          null,
          createElement(Table.Cell, { priority: 1 }, "#1001"),
          createElement(Table.Cell, { priority: 2 }, "Ada"),
          createElement(Table.Cell, { priority: 3 }, "Express"),
        ),
      ),
    ),
    createElement(
      Table.Pagination,
      { compact: true },
      createElement("button", { type: "button" }, "Previous"),
      createElement("button", { type: "button" }, "Next"),
    ),
  );
}

describe("Table composition", () => {
  it("renders table, caption, headers, and cells with accessible roles", () => {
    render(createElement(OrdersTable));
    const table = screen.getByRole("table", { name: "Orders" });
    expect(table.tagName).toBe("TABLE");
    expect(within(table).getByText("Recent orders").tagName).toBe("CAPTION");
    expect(within(table).getAllByRole("columnheader").map((c) => c.textContent)).toEqual([
      "Order",
      "Customer",
      "Notes",
    ]);
    expect(within(table).getByRole("cell", { name: "#1001" })).toBeDefined();
    expect(within(table).getByRole("cell", { name: "Ada" })).toBeDefined();
  });

  it("renders toolbar parts: searchbox and filter group", () => {
    render(createElement(OrdersTable));
    expect(screen.getByRole("searchbox", { name: "Search orders" })).toHaveAttribute(
      "data-waas-table-search",
      "true",
    );
    const filters = screen.getByRole("group", { name: "Status filters" });
    expect(filters).toHaveAttribute("data-waas-table-filters", "true");
    expect(within(filters).getByRole("button", { name: "Paid" })).toBeDefined();
  });

  it("renders pagination as navigation with compact hook", () => {
    render(createElement(OrdersTable));
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toHaveAttribute("data-compact", "true");
    expect(within(nav).getByRole("button", { name: "Previous" })).toBeDefined();
  });

  it("exposes mobile strategy hooks: strategy, scroll region, priority columns", () => {
    const { container } = render(createElement(OrdersTable));
    const root = container.querySelector("#orders-root");
    expect(root?.getAttribute("data-mobile-strategy")).toBe("cards");
    const region = screen.getByRole("region", { name: "Orders scroll region" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("data-waas-table-scroll", "true");
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]?.getAttribute("data-priority")).toBe("1");
    expect(headers[1]?.getAttribute("data-priority")).toBe("2");
    expect(headers[2]?.getAttribute("data-priority")).toBe("3");
    expect(screen.getByRole("cell", { name: "Express" }).getAttribute("data-priority")).toBe("3");
  });

  it("defaults the mobile strategy to scroll", () => {
    const { container } = render(createElement(Table.Root, null, "x"));
    expect(container.firstElementChild?.getAttribute("data-mobile-strategy")).toBe("scroll");
  });

  it("forwards refs to the table element", () => {
    const ref = createRef<HTMLTableElement>();
    render(createElement(Table, { ref, "aria-label": "Ref table" }));
    expect(ref.current?.tagName).toBe("TABLE");
  });
});

describe("EmptyState and loading", () => {
  it("renders icon slot, title, description, and actions", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      createElement(
        EmptyState.Root,
        { icon: createElement(StarIcon) },
        createElement(EmptyState.Title, null, "No orders yet"),
        createElement(EmptyState.Description, null, "Orders will show up here."),
        createElement(
          EmptyState.Actions,
          null,
          createElement("button", { type: "button", onClick }, "Create order"),
        ),
      ),
    );
    expect(screen.getByRole("heading", { name: "No orders yet" })).toBeDefined();
    expect(screen.getByText("Orders will show up here.")).toBeDefined();
    expect(screen.getByRole("img", { name: "star" })).toBeDefined();
    const action = screen.getByRole("button", { name: "Create order" });
    await user.click(action);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders Skeleton placeholders with loading hooks", () => {
    render(
      createElement(
        "div",
        null,
        createElement(Skeleton, { "aria-label": "Loading orders", id: "sk-live" }),
        createElement(Skeleton, { id: "sk-hidden" }),
      ),
    );
    expect(screen.getByRole("status", { name: "Loading orders" })).toHaveAttribute(
      "data-loading",
      "true",
    );
    const hidden = document.getElementById("sk-hidden");
    expect(hidden).not.toBeNull();
    expect(hidden?.getAttribute("aria-hidden")).toBe("true");
    expect(hidden?.getAttribute("data-loading")).toBe("true");
  });

  it("marks a busy table region while loading", () => {
    render(
      createElement(
        Table.Root,
        null,
        createElement(
          Table,
          { "aria-label": "Orders", "aria-busy": true },
          createElement(
            Table.Body,
            null,
            createElement(
              Table.Row,
              null,
              createElement(Table.Cell, null, createElement(Skeleton, { "aria-label": "Loading row" })),
            ),
          ),
        ),
      ),
    );
    expect(screen.getByRole("table", { name: "Orders" }).getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status", { name: "Loading row" })).toBeDefined();
  });
});

describe("display components", () => {
  it("renders StatCard label, value, and trended delta", () => {
    render(
      createElement(
        StatCard.Root,
        { icon: createElement(StarIcon) },
        createElement(StatCard.Label, null, "Revenue"),
        createElement(StatCard.Value, null, "$12,400"),
        createElement(StatCard.Delta, { trend: "up" }, "+8%"),
        createElement(StatCard.Hint, null, "vs last month"),
      ),
    );
    expect(screen.getByText("Revenue")).toBeDefined();
    expect(screen.getByText("$12,400")).toBeDefined();
    const delta = screen.getByText("+8%");
    expect(delta.getAttribute("data-trend")).toBe("up");
    expect(screen.getByText("vs last month")).toBeDefined();
  });

  it("renders Badge variants with icon slot and asChild", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        (["neutral", "info", "success", "warning", "danger"] as const).map((variant) =>
          createElement(Badge, { key: variant, variant }, variant),
        ),
      ),
    );
    for (const variant of ["neutral", "info", "success", "warning", "danger"]) {
      expect(container.querySelector(`[data-variant='${variant}']`)?.textContent).toBe(variant);
    }
    render(createElement(Badge, { variant: "success", icon: createElement(StarIcon) }, "Paid"));
    const badge = screen.getByText("Paid");
    expect(badge.querySelector("[data-waas-icon-slot]")).not.toBeNull();
    render(
      createElement(
        Badge,
        { asChild: true, variant: "info" },
        createElement("a", { href: "/orders" }, "Orders link"),
      ),
    );
    const link = screen.getByRole("link", { name: "Orders link" });
    expect(link.getAttribute("data-variant")).toBe("info");
    expect(link.className).toContain("waas-badge");
  });

  it("renders Avatar image and fallback with size hook", () => {
    render(
      createElement(
        Avatar.Root,
        { size: "lg" },
        createElement(Avatar.Image, { src: "ada.png", alt: "Ada Lovelace" }),
        createElement(Avatar.Fallback, null, "AL"),
      ),
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).getAttribute("src")).toBe("ada.png");
    expect(screen.getByText("AL").getAttribute("data-waas-avatar-fallback")).toBe("true");
    expect(screen.getByText("AL").parentElement?.getAttribute("data-size")).toBe("lg");
  });

  it("renders Card compound parts", () => {
    render(
      createElement(
        Card.Root,
        null,
        createElement(
          Card.Header,
          null,
          createElement(Card.Title, null, "Plan"),
          createElement(Card.Description, null, "Current subscription"),
        ),
        createElement(Card.Content, null, "Pro — $20/mo"),
        createElement(
          Card.Footer,
          null,
          createElement("button", { type: "button" }, "Manage"),
        ),
      ),
    );
    expect(screen.getByRole("heading", { name: "Plan" })).toBeDefined();
    expect(screen.getByText("Current subscription")).toBeDefined();
    expect(screen.getByText("Pro — $20/mo")).toBeDefined();
    expect(screen.getByRole("button", { name: "Manage" })).toBeDefined();
  });

  it("renders Separator with orientation and decorative hooks", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        createElement(Separator, { id: "sep-plain" }),
        createElement(Separator, { orientation: "vertical", decorative: false, id: "sep-vert" }),
      ),
    );
    const plain = document.getElementById("sep-plain");
    expect(plain?.getAttribute("role")).toBe("none");
    expect(plain?.getAttribute("data-orientation")).toBe("horizontal");
    const vert = screen.getByRole("separator");
    expect(vert.getAttribute("data-orientation")).toBe("vertical");
    expect(vert.getAttribute("aria-orientation")).toBe("vertical");
    expect(container.querySelectorAll(".waas-separator").length).toBe(2);
  });

  it("forwards refs on display roots", () => {
    const cardRef = createRef<HTMLDivElement>();
    const badgeRef = createRef<HTMLSpanElement>();
    render(
      createElement(
        "div",
        null,
        createElement(Card.Root, { ref: cardRef }, "body"),
        createElement(Badge, { ref: badgeRef }, "New"),
      ),
    );
    expect(cardRef.current?.tagName).toBe("DIV");
    expect(badgeRef.current?.tagName).toBe("SPAN");
  });
});
