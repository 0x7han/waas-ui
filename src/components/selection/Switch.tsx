import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";

export interface SwitchProps
  extends Omit<
    ComponentProps<typeof SwitchPrimitive.Root>,
    "asChild" | "children" | "defaultChecked" | "checked" | "onCheckedChange"
  > {
  /** Accessible name rendered beside the switch. Mutually exclusive with asChild content. */
  label?: ReactNode;
  /** Marks the control invalid and exposes aria-invalid. */
  error?: boolean;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, error = false, asChild = false, id, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const cls = `waas-switch${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        asChild
        id={controlId}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        {children}
      </SwitchPrimitive.Root>
    );
  }
  return (
    <span className="waas-switch-wrap">
      <SwitchPrimitive.Root
        ref={ref}
        id={controlId}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        <SwitchPrimitive.Thumb className="waas-switch-thumb" />
      </SwitchPrimitive.Root>
      {label !== undefined ? (
        <label className="waas-switch-label" htmlFor={controlId}>
          {label}
        </label>
      ) : null}
    </span>
  );
});
