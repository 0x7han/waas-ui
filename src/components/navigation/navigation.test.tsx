import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {} from "@testing-library/jest-dom/vitest";
import { Breadcrumb, Navbar, Pagination, Sidebar, Tabs } from "./index";

function StarIcon() {
  return createElement("svg", { "aria-label": "star", role: "img" });
}

afterEach(() => {
  cleanup();
});

describe("Sidebar", () => {
  it("renders a labelled nav landmark with header, groups, and footer", () => {
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Header>Acme</Sidebar.Header>
        <Sidebar.Group label="Main">
          <Sidebar.Item icon={<StarIcon />}>Dashboard</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer>Footer content</Sidebar.Footer>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toHaveAttribute("data-preset", "expanded");
    expect(nav).not.toHaveAttribute("data-collapsed");
    expect(within(nav).getByText("Acme")).toBeInTheDocument();
    expect(within(nav).getByRole("group", { name: "Main" })).toBeInTheDocument();
    expect(within(nav).getByText("Footer content")).toBeInTheDocument();
  });

  it("reflects controlled collapsed state and icon-rail preset", () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <Sidebar.Root aria-label="Primary" collapsed={false} preset="icon-rail" onCollapsedChange={onCollapsedChange}>
        <Sidebar.Trigger>Toggle</Sidebar.Trigger>
        <Sidebar.Item icon={<StarIcon />}>Dashboard</Sidebar.Item>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toHaveAttribute("data-preset", "icon-rail");
    expect(nav).not.toHaveAttribute("data-collapsed");
    rerender(
      <Sidebar.Root aria-label="Primary" collapsed={true} preset="icon-rail" onCollapsedChange={onCollapsedChange}>
        <Sidebar.Trigger>Toggle</Sidebar.Trigger>
        <Sidebar.Item icon={<StarIcon />}>Dashboard</Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(nav).toHaveAttribute("data-collapsed", "true");
  });

  it("toggles collapsed state from the trigger", async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(
      <Sidebar.Root aria-label="Primary" defaultCollapsed={false} onCollapsedChange={onCollapsedChange}>
        <Sidebar.Trigger aria-label="Toggle">Toggle</Sidebar.Trigger>
        <Sidebar.Item>Dashboard</Sidebar.Item>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(nav).toHaveAttribute("data-collapsed", "true");
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("supports mobile-drawer preset with controlled open state and Escape to close", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sidebar.Root aria-label="Primary" preset="mobile-drawer" open={true} onOpenChange={onOpenChange}>
        <Sidebar.Item>Dashboard</Sidebar.Item>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toHaveAttribute("data-preset", "mobile-drawer");
    expect(nav).toHaveAttribute("data-open", "true");
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("marks the active item with aria-current and renders icon and badge slots", () => {
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Item icon={<StarIcon />} badge="3">
          Inbox
        </Sidebar.Item>
        <Sidebar.Item active>Sent</Sidebar.Item>
      </Sidebar.Root>,
    );
    const sent = screen.getByRole("button", { name: "Sent" });
    expect(sent).toHaveAttribute("aria-current", "page");
    expect(sent).toHaveAttribute("data-active", "true");
    const inbox = screen.getByRole("button", { name: /Inbox/ });
    expect(inbox.querySelector("[data-waas-icon-slot]")).not.toBeNull();
    expect(within(inbox).getByText("3")).toBeInTheDocument();
  });

  it("moves focus between items with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Item>First</Sidebar.Item>
        <Sidebar.Item>Second</Sidebar.Item>
        <Sidebar.Item>Third</Sidebar.Item>
      </Sidebar.Root>,
    );
    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    const third = screen.getByRole("button", { name: "Third" });
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(second).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(second).toHaveFocus();
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
    await user.keyboard("{End}");
    expect(third).toHaveFocus();
  });

  it("renders workspace and user sections", () => {
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Workspace name="Acme Corp" description="Pro plan" icon={<StarIcon />} />
        <Sidebar.Group label="Main">
          <Sidebar.Item>Dashboard</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.User name="Ada Lovelace" email="ada@acme.co" avatar={<StarIcon />} />
      </Sidebar.Root>,
    );
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Pro plan")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@acme.co")).toBeInTheDocument();
  });

  it("composes items via asChild without wrapper elements and forwards refs", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Item asChild>
          <a href="/dash">Dashboard</a>
        </Sidebar.Item>
        <Sidebar.Group label="Main">
          <Sidebar.Item ref={ref}>Target</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>,
    );
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("href", "/dash");
    expect(link).toHaveAttribute("data-waas-sidebar-item", "true");
    expect(ref.current).toBe(screen.getByRole("button", { name: "Target" }));
  });
});

describe("Navbar", () => {
  it("composes brand, links, and actions inside a banner", () => {
    render(
      <Navbar.Root>
        <Navbar.Brand icon={<StarIcon />}>Acme</Navbar.Brand>
        <Navbar.Nav aria-label="Top">
          <Navbar.Link href="/docs" active>
            Docs
          </Navbar.Link>
          <Navbar.Link href="/pricing">Pricing</Navbar.Link>
        </Navbar.Nav>
        <Navbar.Actions>
          <button type="button">Sign in</button>
        </Navbar.Actions>
      </Navbar.Root>,
    );
    const header = screen.getByRole("banner");
    expect(within(header).getByText("Acme")).toBeInTheDocument();
    const docs = within(header).getByRole("link", { name: "Docs" });
    expect(docs).toHaveAttribute("aria-current", "page");
    expect(docs).toHaveAttribute("data-active", "true");
    expect(within(header).getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("composes brand links via asChild without wrapper elements", () => {
    render(
      <Navbar.Root>
        <Navbar.Brand asChild>
          <a href="/">Acme</a>
        </Navbar.Brand>
      </Navbar.Root>,
    );
    expect(screen.getByRole("link", { name: "Acme" })).toHaveAttribute("href", "/");
  });
});

describe("Breadcrumb", () => {
  it("renders an ordered trail with separators and current page", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Current>Billing</Breadcrumb.Current>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const list = within(nav).getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    const current = within(nav).getByText("Billing");
    expect(current).toHaveAttribute("aria-current", "page");
    const separators = nav.querySelectorAll("[data-waas-breadcrumb-separator]");
    expect(separators.length).toBe(2);
    for (const separator of Array.from(separators)) {
      expect(separator).toHaveAttribute("aria-hidden", "true");
    }
  });
});

describe("Tabs", () => {
  function BasicTabs() {
    return (
      <Tabs.Root defaultValue="overview">
        <Tabs.List aria-label="Project">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="billing" icon={<StarIcon />}>
            Billing
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Overview panel</Tabs.Content>
        <Tabs.Content value="billing">Billing panel</Tabs.Content>
      </Tabs.Root>
    );
  }

  it("shows the selected panel and switches on trigger click", async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    expect(screen.getByText("Overview panel")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /Billing/ }));
    expect(screen.getByText("Billing panel")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Billing/ })).toHaveAttribute("data-state", "active");
  });

  it("supports arrow-key navigation between tabs", async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    const billing = screen.getByRole("tab", { name: /Billing/ });
    billing.focus();
    await user.keyboard("{ArrowLeft}");
    expect(overview).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(billing).toHaveFocus();
  });

  it("supports controlled value", () => {
    const onValueChange = vi.fn();
    render(
      <Tabs.Root value="billing" onValueChange={onValueChange}>
        <Tabs.List aria-label="Project">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Overview panel</Tabs.Content>
        <Tabs.Content value="billing">Billing panel</Tabs.Content>
      </Tabs.Root>,
    );
    expect(screen.getByText("Billing panel")).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("Pagination", () => {
  function BasicPagination(props: { page?: number; defaultPage?: number; onPageChange?: (page: number) => void }) {
    return (
      <Pagination.Root pageCount={10} aria-label="Pages" {...props}>
        <Pagination.Prev />
        <Pagination.Pages />
        <Pagination.Next />
      </Pagination.Root>
    );
  }

  it("renders page buttons with the current page marked", () => {
    render(<BasicPagination defaultPage={3} />);
    const nav = screen.getByRole("navigation", { name: "Pages" });
    const current = within(nav).getByRole("button", { name: "Page 3" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("data-current", "true");
  });

  it("notifies on page change and disables prev on the first page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination defaultPage={1} onPageChange={onPageChange} />);
    const nav = screen.getByRole("navigation", { name: "Pages" });
    expect(within(nav).getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(within(nav).getByRole("button", { name: "Page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("advances one page from next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination defaultPage={1} onPageChange={onPageChange} />);
    const nav = screen.getByRole("navigation", { name: "Pages" });
    await user.click(within(nav).getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables next on the last page and collapses ranges with ellipsis", () => {
    render(<BasicPagination defaultPage={10} />);
    const nav = screen.getByRole("navigation", { name: "Pages" });
    expect(within(nav).getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(nav.querySelectorAll("[data-waas-pagination-ellipsis]").length).toBeGreaterThan(0);
  });

  it("supports controlled page", () => {
    render(<BasicPagination page={5} />);
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
  });
});

describe("no generic as-prop", () => {
  it("exposes asChild instead of as", () => {
    render(
      <Sidebar.Root aria-label="Primary">
        <Sidebar.Item>Dashboard</Sidebar.Item>
      </Sidebar.Root>,
    );
    const item = screen.getByRole("button", { name: "Dashboard" });
    expect(item).not.toHaveAttribute("as");
  });
});
