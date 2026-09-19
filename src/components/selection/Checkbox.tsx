import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";

export interface CheckboxProps
  extends Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "asChild" | "children" | "defaultChecked" | "checked" | "onCheckedChange"> {
  /** Accessible name rendered beside the box. Mutually exclusive with asChild content. */
  label?: ReactNode;
  /** Marks the control invalid and exposes aria-invalid. */
  error?: boolean;
  /** Indicator in the icon slot. Defaults to a check mark. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
  checked?: CheckboxPrimitive.CheckedState;
  defaultChecked?: CheckboxPrimitive.CheckedState;
  onCheckedChange?: (checked: CheckboxPrimitive.CheckedState) => void;
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    label,
    error = false,
    icon,
    asChild = false,
    id,
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const cls = `waas-checkbox${className ? ` ${className}` : ""}`;
  const indicator = (
    <CheckboxPrimitive.Indicator asChild>
      <span data-waas-icon-slot="" aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
            <path
              d="M3 8.5l3.2 3.2L13 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </CheckboxPrimitive.Indicator>
  );
  if (asChild) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        asChild
        id={id}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        {children}
      </CheckboxPrimitive.Root>
    );
  }
  return (
    <span className="waas-checkbox-wrap">
      <CheckboxPrimitive.Root
        ref={ref}
        id={controlId}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        {indicator}
      </CheckboxPrimitive.Root>
      {label !== undefined ? (
        <label className="waas-checkbox-label" htmlFor={controlId}>
          {label}
        </label>
      ) : null}
    </span>
  );
});
