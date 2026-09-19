import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
} from "cmdk";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

export type CommandProps = ComponentPropsWithoutRef<typeof CommandPrimitive>;

/** Filterable command palette root. Filtering, sorting, and arrow-key navigation come from cmdk. */
export const Command = forwardRef<ElementRef<typeof CommandPrimitive>, CommandProps>(
  function Command({ className, ...rest }, ref) {
    return (
      <CommandPrimitive
        ref={ref}
        className={`waas-command${className ? ` ${className}` : ""}`}
        {...rest}
      />
    );
  },
);

export type CommandInputProps = ComponentPropsWithoutRef<typeof CommandInputPrimitive>;

/** Search field. Renders the combobox that drives filtering. */
export const CommandInput = forwardRef<
  ElementRef<typeof CommandInputPrimitive>,
  CommandInputProps
>(function CommandInput({ className, ...rest }, ref) {
  return (
    <CommandInputPrimitive
      ref={ref}
      className={`waas-command-input${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type CommandListProps = ComponentPropsWithoutRef<typeof CommandListPrimitive>;

/** Scrollable listbox of options. */
export const CommandList = forwardRef<
  ElementRef<typeof CommandListPrimitive>,
  CommandListProps
>(function CommandList({ className, ...rest }, ref) {
  return (
    <CommandListPrimitive
      ref={ref}
      className={`waas-command-list${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type CommandEmptyProps = ComponentPropsWithoutRef<typeof CommandEmptyPrimitive>;

/** Shown automatically when the search matches no options. */
export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandEmptyPrimitive>,
  CommandEmptyProps
>(function CommandEmpty({ className, ...rest }, ref) {
  return (
    <CommandEmptyPrimitive
      ref={ref}
      className={`waas-command-empty${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type CommandGroupProps = ComponentPropsWithoutRef<typeof CommandGroupPrimitive>;

/** Groups options under an optional heading. */
export const CommandGroup = forwardRef<
  ElementRef<typeof CommandGroupPrimitive>,
  CommandGroupProps
>(function CommandGroup({ className, ...rest }, ref) {
  return (
    <CommandGroupPrimitive
      ref={ref}
      className={`waas-command-group${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export interface CommandItemProps
  extends ComponentPropsWithoutRef<typeof CommandItemPrimitive> {
  /** Merges props onto the child instead of rendering an option wrapper. */
  asChild?: boolean;
}

/** Selectable option. Active on pointer enter or arrow-key navigation, chosen on click or Enter. */
export const CommandItem = forwardRef<
  ElementRef<typeof CommandItemPrimitive>,
  CommandItemProps
>(function CommandItem({ asChild = false, className, ...rest }, ref) {
  return (
    <CommandItemPrimitive
      ref={ref}
      asChild={asChild}
      className={`waas-command-item${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

// (No CommandDialog wrapper: full CommandMenu stays out of this family by design.)
