import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Checkbox } from "./Checkbox";
import { RadioGroup, RadioItem } from "./Radio";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Switch } from "./Switch";

// jsdom lacks browser APIs Radix relies on for measurement and scrolling.
if (typeof Element !== "undefined") {
  if (Element.prototype.scrollIntoView === undefined) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (Element.prototype.hasPointerCapture === undefined) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
}

afterEach(() => {
  cleanup();
  document.body.style.pointerEvents = "";
});

/** jsdom dispatches PointerEvents with an empty pointerType; Radix Select only
 * opens on pointerdown when pointerType is "mouse", so open with an explicit
 * fireEvent instead of userEvent.click. */
function openSelect(trigger: HTMLElement): void {
  fireEvent.pointerDown(trigger, { pointerType: "mouse", button: 0 });
}

interface FruitSelectProps {
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function FruitSelect({ onValueChange, disabled, error }: FruitSelectProps) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger aria-label="Fruit" disabled={disabled} error={error}>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry" disabled>
          Cherry
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders a labelled trigger with placeholder text", () => {
    render(<FruitSelect />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveTextContent("Pick a fruit");
    expect(trigger.className).toContain("waas-select-trigger");
    // Consumer icon lands in the icon slot by default.
    expect(trigger.querySelector("[data-waas-icon-slot]")).not.toBeNull();
  });

  it("opens and lists options with disabled state", async () => {
    render(<FruitSelect />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    await openSelect(trigger);
    await screen.findByRole("listbox");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("option", { name: "Banana" })).toBeDefined();
    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("selects an option, reports the value, and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    // Typeahead moves focus to the matching option; Enter commits it.
    await user.keyboard("a");
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("apple");
    expect(trigger).toHaveTextContent("Apple");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports keyboard open, typeahead select, and escape without selecting", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await user.keyboard("b");
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(trigger).toHaveTextContent("Banana");
  });

  it("marks the trigger invalid when error is set", () => {
    render(<FruitSelect error />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("data-error", "true");
  });

  it("disables the trigger and blocks opening", async () => {
    const user = userEvent.setup();
    render(<FruitSelect disabled />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("forwards refs to trigger, content, and items", async () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <Select>
        <SelectTrigger ref={triggerRef} aria-label="Fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent ref={contentRef}>
          <SelectItem ref={itemRef} value="apple">
            Apple
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(triggerRef.current?.tagName).toBe("BUTTON");
    openSelect(screen.getByRole("combobox", { name: "Fruit" }));
    await screen.findByRole("option", { name: "Apple" });
    expect(contentRef.current?.tagName).toBe("DIV");
    expect(contentRef.current?.className).toContain("waas-select-content");
    expect(itemRef.current?.tagName).toBe("DIV");
    expect(itemRef.current?.className).toContain("waas-select-item");
  });

  it("composes the trigger via asChild without wrapper elements", async () => {
    render(
      <Select>
        <SelectTrigger asChild>
          <button type="button" data-testid="custom-trigger">
            <SelectValue placeholder="Pick" />
          </button>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByTestId("custom-trigger");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.className).toContain("waas-select-trigger");
    expect(trigger).toHaveAttribute("role", "combobox");
    openSelect(trigger);
    await screen.findByRole("option", { name: "Apple" });
  });

  it("renders grouped options with labels", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="City">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>West</SelectLabel>
            <SelectItem value="sf">San Francisco</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "City" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    await screen.findByRole("option", { name: "San Francisco" });
    expect(within(listbox).getByText("West")).toHaveClass("waas-select-label");
  });
});

describe("Checkbox", () => {
  it("renders unchecked with an accessible label", () => {
    render(<Checkbox label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(box.className).toContain("waas-checkbox");
  });

  it("toggles on click and reports checked state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("toggles with Space", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    box.focus();
    await user.keyboard("[Space]");
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("announces indeterminate state as mixed", () => {
    render(<Checkbox defaultChecked="indeterminate" label="Select all" />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("exposes error and disabled states and blocks toggling when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Accept terms" error disabled onCheckedChange={onCheckedChange} />,
    );
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAttribute("data-error", "true");
    expect(box).toBeDisabled();
    await user.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("renders consumer icons in the icon slot", () => {
    render(<Checkbox label="Accept" defaultChecked icon={<em>custom</em>} />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    const slot = box.querySelector("[data-waas-icon-slot]");
    expect(slot).not.toBeNull();
    expect(slot).toHaveTextContent("custom");
  });

  it("forwards refs to the underlying button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} label="Accept" />);
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("composes via asChild without wrapper elements", () => {
    render(
      <Checkbox asChild defaultChecked>
        <button type="button">Custom box</button>
      </Checkbox>,
    );
    const box = screen.getByRole("checkbox", { name: "Custom box" });
    expect(box.tagName).toBe("BUTTON");
    expect(box.className).toContain("waas-checkbox");
    expect(box).toHaveAttribute("aria-checked", "true");
  });
});

describe("RadioGroup", () => {
  function ColorGroup({
    onValueChange,
    error,
  }: {
    onValueChange?: (value: string) => void;
    error?: boolean;
  }) {
    return (
      <RadioGroup
        defaultValue="red"
        onValueChange={onValueChange}
        label="Color"
        error={error}
      >
        <RadioItem value="red" label="Red" />
        <RadioItem value="blue" label="Blue" />
      </RadioGroup>
    );
  }

  it("renders a labelled group with accessible options", () => {
    render(<ColorGroup />);
    const group = screen.getByRole("radiogroup", { name: "Color" });
    expect(group.className).toContain("waas-radio-group");
    expect(screen.getByText("Color")).toHaveAttribute("data-waas-label", "");
    expect(screen.getByRole("radio", { name: "Red" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("selects an option on click and reports the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorGroup onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Blue" }));
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("blue");
  });

  it("moves selection with arrow keys", async () => {
    const onValueChange = vi.fn();
    render(<ColorGroup onValueChange={onValueChange} />);
    const red = screen.getByRole("radio", { name: "Red" });
    const blue = screen.getByRole("radio", { name: "Blue" });
    red.focus();
    // Radix commits arrow-key selection on focus (tracking a document-level
    // keydown listener), which user-event dispatches on the wrong target in
    // jsdom — drive the same handler path with fireEvent instead.
    fireEvent.keyDown(red, { key: "ArrowDown" });
    await screen.findByRole("radio", { name: "Blue" });
    expect(blue).toHaveAttribute("aria-checked", "true");
    expect(red).toHaveAttribute("aria-checked", "false");
    expect(onValueChange).toHaveBeenCalledWith("blue");
  });

  it("skips disabled items", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="red" onValueChange={onValueChange} aria-label="Color">
        <RadioItem value="red" label="Red" />
        <RadioItem value="green" label="Green" disabled />
      </RadioGroup>,
    );
    const green = screen.getByRole("radio", { name: "Green" });
    expect(green).toBeDisabled();
    await user.click(green);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(green).toHaveAttribute("aria-checked", "false");
  });

  it("marks the group invalid when error is set", () => {
    render(<ColorGroup error />);
    const group = screen.getByRole("radiogroup", { name: "Color" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("data-error", "true");
  });

  it("forwards refs to the group and items", () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <RadioGroup ref={groupRef} defaultValue="red" aria-label="Color">
        <RadioItem ref={itemRef} value="red" label="Red" />
      </RadioGroup>,
    );
    expect(groupRef.current?.tagName).toBe("DIV");
    expect(itemRef.current?.tagName).toBe("BUTTON");
    expect(itemRef.current?.className).toContain("waas-radio-item");
  });

  it("composes items via asChild without wrapper elements", () => {
    render(
      <RadioGroup defaultValue="a" aria-label="Letters">
        <RadioItem value="a" asChild>
          <button type="button">A</button>
        </RadioItem>
        <RadioItem value="b" label="B" />
      </RadioGroup>,
    );
    const custom = screen.getByRole("radio", { name: "A" });
    expect(custom.tagName).toBe("BUTTON");
    expect(custom.className).toContain("waas-radio-item");
    expect(custom).toHaveAttribute("aria-checked", "true");
  });
});

describe("Switch", () => {
  it("renders off with an accessible label", () => {
    render(<Switch label="Enable notifications" />);
    const control = screen.getByRole("switch", { name: "Enable notifications" });
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control.className).toContain("waas-switch");
  });

  it("toggles on click and reports checked state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Enable notifications" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Enable notifications" });
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("toggles with Space", async () => {
    const user = userEvent.setup();
    render(<Switch label="Enable notifications" />);
    const control = screen.getByRole("switch", { name: "Enable notifications" });
    control.focus();
    await user.keyboard("[Space]");
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("exposes error and disabled states and blocks toggling when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch label="Enable notifications" error disabled onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByRole("switch", { name: "Enable notifications" });
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("data-error", "true");
    expect(control).toBeDisabled();
    await user.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("forwards refs to the underlying button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} label="Enable notifications" />);
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("composes via asChild without wrapper elements", () => {
    render(
      <Switch asChild defaultChecked>
        <button type="button">Custom switch</button>
      </Switch>,
    );
    const control = screen.getByRole("switch", { name: "Custom switch" });
    expect(control.tagName).toBe("BUTTON");
    expect(control.className).toContain("waas-switch");
    expect(control).toHaveAttribute("aria-checked", "true");
  });
});
