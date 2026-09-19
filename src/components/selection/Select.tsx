import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef, type ComponentProps, type ReactNode } from "react";

export type SelectProps = ComponentProps<typeof SelectPrimitive.Root>;

/** Single-value select root. Non-DOM provider — value state lives here. */
export const Select = SelectPrimitive.Root;

export interface SelectTriggerProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Trigger>, "asChild"> {
  /** Marks the trigger invalid and exposes aria-invalid. */
  error?: boolean;
  /** Trailing affordance in the icon slot. Defaults to a chevron. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ error = false, icon, asChild = false, className, ...rest }, ref) {
    const cls = `waas-select-trigger${className ? ` ${className}` : ""}`;
    if (asChild) {
      return (
        <SelectPrimitive.Trigger
          ref={ref}
          asChild
          aria-invalid={error ? "true" : undefined}
          data-error={error ? "true" : undefined}
          data-disabled={rest.disabled === true ? "true" : undefined}
          className={cls}
          {...rest}
        />
      );
    }
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        {rest.children}
        <SelectPrimitive.Icon asChild>
          <span data-waas-icon-slot="" aria-hidden="true">
            {icon ?? <ChevronDownIcon />}
          </span>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);

export type SelectValueProps = ComponentProps<typeof SelectPrimitive.Value>;

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ className, ...rest }, ref) {
    return (
      <SelectPrimitive.Value
        ref={ref}
        className={`waas-select-value${className ? ` ${className}` : ""}`}
        {...rest}
      />
    );
  },
);

export interface SelectContentProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Content>, "asChild"> {
  /** Render inside a Portal. Defaults to true so the listbox escapes overflow. */
  portal?: boolean;
  /** Portal container. Only used when portal is true. */
  container?: ComponentProps<typeof SelectPrimitive.Portal>["container"];
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(
    { portal = true, container, position = "popper", sideOffset = 4, className, children, ...rest },
    ref,
  ) {
    const content = (
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        className={`waas-select-content${className ? ` ${className}` : ""}`}
        {...rest}
      >
        <SelectPrimitive.Viewport className="waas-select-viewport">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    );
    if (!portal) {
      return content;
    }
    return <SelectPrimitive.Portal container={container}>{content}</SelectPrimitive.Portal>;
  },
);

export interface SelectItemProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Item>, "asChild"> {
  /** Merges props onto the child via Radix Slot instead of rendering an option div. */
  asChild?: boolean;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const cls = `waas-select-item${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <SelectPrimitive.Item ref={ref} asChild className={cls} {...rest}>
        {children}
      </SelectPrimitive.Item>
    );
  }
  return (
    <SelectPrimitive.Item ref={ref} className={cls} {...rest}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="waas-select-item-indicator">
        <span data-waas-icon-slot="" aria-hidden="true">
          <CheckIcon />
        </span>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export type SelectGroupProps = ComponentProps<typeof SelectPrimitive.Group>;

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Group
      ref={ref}
      className={`waas-select-group${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type SelectLabelProps = ComponentProps<typeof SelectPrimitive.Label>;

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(function SelectLabel(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={`waas-select-label${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
