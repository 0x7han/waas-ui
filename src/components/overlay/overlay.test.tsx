/* Overlay + feedback family tests (ticket #17, RED first).
 * Public behavior only: roles, keyboard, ARIA, data-* attributes. */

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

/* jsdom lacks several browser APIs that Radix / cmdk touch at runtime. */
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    public pointerId = 1;
    public pointerType = "mouse";
    public isPrimary = true;
    constructor(type: string, init?: MouseEventInit) {
      super(type, init);
    }
  }
  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}
if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserverPolyfill {
    public observe(): void {}
    public unobserve(): void {}
    public disconnect(): void {}
  }
  window.ResizeObserver =
    ResizeObserverPolyfill as unknown as typeof ResizeObserver;
}
if (typeof window.matchMedia === "undefined") {
  window.matchMedia = (() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
if (typeof Element !== "undefined") {
  const elementProto = Element.prototype as unknown as Record<string, unknown>;
  if (typeof elementProto["scrollIntoView"] !== "function") {
    elementProto["scrollIntoView"] = () => {};
  }
  const proto = Element.prototype as unknown as Record<string, unknown>;
  if (typeof proto["hasPointerCapture"] !== "function") {
    proto["hasPointerCapture"] = () => false;
    proto["setPointerCapture"] = () => {};
    proto["releasePointerCapture"] = () => {};
  }
}

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ToastProvider,
  createToastStore,
} from "./index";

afterEach(() => {
  cleanup();
  document.body.style.pointerEvents = "";
});

describe("Dialog", () => {
  it("opens on trigger and exposes title and description as the accessible name", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Change your settings here.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("Change your settings here."),
    ).toBeInTheDocument();
  });

  it("renders content in a portal outside the host container", async () => {
    const user = userEvent.setup();
    render(
      <div data-testid="host">
        <Dialog>
          <DialogTrigger>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Portal check</DialogTitle>
            <DialogDescription>Portalled content.</DialogDescription>
          </DialogContent>
        </Dialog>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog", { name: "Portal check" });
    const host = screen.getByTestId("host");
    expect(
      within(host).queryByRole("dialog", { name: "Portal check" }),
    ).not.toBeInTheDocument();
    expect(document.body.textContent).toContain("Portalled content.");
  });

  it("moves focus inside the dialog when opened (focus trap entry)", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Focus check</DialogTitle>
          <DialogDescription>Focus lands here.</DialogDescription>
          <button type="button">Inner action</button>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog", { name: "Focus check" });
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it("closes on Escape and reports the change", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Escape check</DialogTitle>
          <DialogDescription>Press Escape.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog", { name: "Escape check" });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on outside pointer down", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Outside check</DialogTitle>
          <DialogDescription>Click outside.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog", { name: "Outside check" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    fireEvent.pointerDown(document.body);
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("locks scroll interaction on the body while modal", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Lock check</DialogTitle>
          <DialogDescription>Body is locked.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog", { name: "Lock check" });
    expect(document.body.style.pointerEvents).toBe("none");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(document.body.style.pointerEvents).not.toBe("none");
    });
  });

  it("closes via DialogClose and composes triggers via asChild", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <a href="#open">Open as link</a>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Close check</DialogTitle>
          <DialogDescription>Close me.</DialogDescription>
          <DialogClose>Dismiss</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("link", { name: "Open as link" }));
    await screen.findByRole("dialog", { name: "Close check" });
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("forwards refs to trigger and content", () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <Dialog open>
        <DialogTrigger ref={triggerRef}>Open dialog</DialogTrigger>
        <DialogContent ref={contentRef} forceMount>
          <DialogTitle>Ref check</DialogTitle>
          <DialogDescription>Refs land.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Drawer", () => {
  it("opens on the right side by default and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Cart</DrawerTitle>
          <DrawerDescription>Your items.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const drawer = await screen.findByRole("dialog", { name: "Cart" });
    expect(drawer).toHaveAttribute("data-side", "right");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("supports the left side and closes via DrawerClose", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent side="left">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Navigation.</DrawerDescription>
          <DrawerClose>Close menu</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const drawer = await screen.findByRole("dialog", { name: "Menu" });
    expect(drawer).toHaveAttribute("data-side", "left");
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

describe("Dropdown", () => {
  it("opens on trigger and lists menu items", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
          <DropdownItem onSelect={() => {}}>Duplicate</DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => {}}>Archive</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    screen.getByRole("button", { name: "Actions" }).focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(
      within(menu).getAllByRole("menuitem"),
    ).toHaveLength(3);
  });

  it("moves highlight with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
          <DropdownItem onSelect={onSelect}>Duplicate</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    screen.getByRole("button", { name: "Actions" }).focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    screen.getByRole("button", { name: "Actions" }).focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});

describe("Popover", () => {
  it("opens on trigger with dialog semantics", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent>
          Extra information.
          <PopoverClose>Got it</PopoverClose>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Details" }));
    const popover = await screen.findByRole("dialog");
    expect(popover).toBeInTheDocument();
    expect(
      within(popover).getByText("Extra information."),
    ).toBeInTheDocument();
  });

  it("closes on Escape and on outside click", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent>Extra information.</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Details" }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "Details" }));
    await screen.findByRole("dialog");
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

describe("Command", () => {
  function renderPalette(onSelect: (value: string) => void) {
    render(
      <Command label="Actions palette">
        <CommandInput placeholder="Search actions" />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          <CommandGroup heading="File">
            <CommandItem value="new-file" onSelect={onSelect}>
              New file
            </CommandItem>
            <CommandItem value="open-file" onSelect={onSelect}>
              Open file
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
  }

  it("filters options as the search changes and shows the empty state", async () => {
    const user = userEvent.setup();
    renderPalette(() => {});
    expect(
      screen.getByRole("option", { name: "New file" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("zzz-no-match");
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "New file" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("No actions found.")).toBeInTheDocument();
  });

  it("navigates options with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderPalette(onSelect);
    await user.click(screen.getByRole("combobox"));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    await user.keyboard("{ArrowDown}");
    await waitFor(() => {
      const selected = screen
        .getAllByRole("option")
        .filter((option) => option.getAttribute("aria-selected") === "true");
      expect(selected).toHaveLength(1);
    });
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("Alert", () => {
  it("announces with role alert and exposes title and description", () => {
    render(
      <Alert variant="danger">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details.</AlertDescription>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-variant", "danger");
    expect(within(alert).getByText("Payment failed")).toBeInTheDocument();
    expect(
      within(alert).getByText("Check your card details."),
    ).toBeInTheDocument();
  });

  it("renders every variant and the icon slot", () => {
    const { rerender } = render(
      <Alert variant="info" icon={<span data-testid="info-icon">i</span>}>
        <AlertTitle>Heads up</AlertTitle>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(
      alert.querySelector("[data-waas-icon-slot]"),
    ).toBeInTheDocument();
    for (const variant of ["info", "success", "warning", "danger"] as const) {
      rerender(
        <Alert variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
        </Alert>,
      );
      expect(screen.getByRole("alert")).toHaveAttribute(
        "data-variant",
        variant,
      );
    }
  });
});

describe("Toast store", () => {
  it("publishes, dismisses, and clears toasts", () => {
    const store = createToastStore();
    const seen: Array<unknown> = [];
    const unsubscribe = store.subscribe(() => {
      seen.push(store.getToasts().length);
    });
    const id = store.toast({ title: "Saved" });
    expect(typeof id).toBe("string");
    expect(store.getToasts()).toHaveLength(1);
    expect(store.getToasts()[0]?.title).toBe("Saved");
    store.dismiss(id);
    expect(store.getToasts()).toHaveLength(0);
    store.toast({ title: "One" });
    store.toast({ title: "Two" });
    expect(store.getToasts()).toHaveLength(2);
    store.clear();
    expect(store.getToasts()).toHaveLength(0);
    expect(seen.length).toBeGreaterThan(0);
    unsubscribe();
  });

  it("renders published toasts with status semantics and variants", async () => {
    const store = createToastStore();
    render(<ToastProvider store={store} />);
    store.toast({
      title: "Upload complete",
      description: "3 files uploaded.",
      variant: "success",
    });
    const statuses = await screen.findAllByRole("status");
    const status = statuses.find((el) => el.getAttribute("data-variant") === "success");
    if (status === undefined) {
      throw new Error("Expected a toast with data-variant success");
    }
    expect(within(status).getByText("Upload complete")).toBeInTheDocument();
    expect(within(status).getByText("3 files uploaded.")).toBeInTheDocument();
  });

  it("removes a toast when its close control is activated", async () => {
    const user = userEvent.setup();
    const store = createToastStore();
    render(<ToastProvider store={store} />);
    store.toast({ title: "Dismiss me" });
    await screen.findByText("Dismiss me");
    await user.click(screen.getByRole("button", { name: "Dismiss toast" }));
    await waitFor(() => {
      expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    });
  });
});

describe("Progress", () => {
  it("reports a determinate value with progressbar semantics", () => {
    render(<Progress value={40} label="Upload progress" />);
    const bar = screen.getByRole("progressbar", { name: "Upload progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("data-state", "loading");
  });

  it("clamps out-of-range values and marks completion", () => {
    const { rerender } = render(<Progress value={150} label="Sync" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "complete",
    );
    rerender(<Progress value={-20} label="Sync" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("renders an indeterminate state without a value", () => {
    render(<Progress label="Loading" />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).toHaveAttribute("data-state", "indeterminate");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });
});
