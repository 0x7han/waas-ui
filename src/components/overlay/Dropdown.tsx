import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export type DropdownProps = ComponentPropsWithoutRef<typeof DropdownPrimitive.Root>;

/** Dropdown menu root. Keyboard navigation and typeahead come from Radix. */
export function Dropdown(props: DropdownProps) {
  return <DropdownPrimitive.Root {...props} />;
}

export interface DropdownTriggerProps
  extends ComponentPropsWithoutRef<typeof DropdownPrimitive.Trigger> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const DropdownTrigger = forwardRef<
  ElementRef<typeof DropdownPrimitive.Trigger>,
  DropdownTriggerProps
>(function DropdownTrigger({ asChild = false, className, ...rest }, ref) {
  return (
    <DropdownPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={`waas-dropdown-trigger${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type DropdownContentProps = ComponentPropsWithoutRef<
  typeof DropdownPrimitive.Content
>;

export const DropdownContent = forwardRef<
  ElementRef<typeof DropdownPrimitive.Content>,
  DropdownContentProps
>(function DropdownContent({ sideOffset = 4, className, ...rest }, ref) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={`waas-dropdown-content${className ? ` ${className}` : ""}`}
        {...rest}
      />
    </DropdownPrimitive.Portal>
  );
});

export interface DropdownItemProps
  extends ComponentPropsWithoutRef<typeof DropdownPrimitive.Item> {
  /** Merges props onto the child instead of rendering a menuitem wrapper. */
  asChild?: boolean;
}

export const DropdownItem = forwardRef<
  ElementRef<typeof DropdownPrimitive.Item>,
  DropdownItemProps
>(function DropdownItem({ asChild = false, className, ...rest }, ref) {
  return (
    <DropdownPrimitive.Item
      ref={ref}
      asChild={asChild}
      className={`waas-dropdown-item${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type DropdownSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownPrimitive.Separator
>;

export const DropdownSeparator = forwardRef<
  ElementRef<typeof DropdownPrimitive.Separator>,
  DropdownSeparatorProps
>(function DropdownSeparator({ className, ...rest }, ref) {
  return (
    <DropdownPrimitive.Separator
      ref={ref}
      className={`waas-dropdown-separator${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
