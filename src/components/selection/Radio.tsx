import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";

export interface RadioGroupProps
  extends Omit<ComponentProps<typeof RadioGroupPrimitive.Root>, "asChild" | "children"> {
  /** Visible group label rendered above the options. */
  label?: ReactNode;
  /** Marks the group invalid and exposes aria-invalid. */
  error?: boolean;
  children?: ReactNode;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, error = false, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const labelledBy = label !== undefined ? labelId : rest["aria-labelledby"];
  return (
    <div className="waas-radio-group-wrap">
      {label !== undefined ? (
        <span id={labelId} data-waas-label="" className="waas-radio-group-label">
          {label}
        </span>
      ) : null}
      <RadioGroupPrimitive.Root
        ref={ref}
        aria-labelledby={labelledBy}
        aria-invalid={error ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={`waas-radio-group${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </div>
  );
});

export interface RadioItemProps
  extends Omit<ComponentProps<typeof RadioGroupPrimitive.Item>, "asChild" | "children"> {
  /** Accessible name rendered beside the radio. Mutually exclusive with asChild content. */
  label?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
  children?: ReactNode;
}

export const RadioItem = forwardRef<HTMLButtonElement, RadioItemProps>(function RadioItem(
  { label, asChild = false, id, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const cls = `waas-radio-item${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <RadioGroupPrimitive.Item ref={ref} asChild id={controlId} className={cls} {...rest}>
        {children}
      </RadioGroupPrimitive.Item>
    );
  }
  return (
    <span className="waas-radio-item-wrap">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={controlId}
        data-disabled={rest.disabled === true ? "true" : undefined}
        className={cls}
        {...rest}
      >
        <RadioGroupPrimitive.Indicator className="waas-radio-indicator" />
      </RadioGroupPrimitive.Item>
      {label !== undefined ? (
        <label className="waas-radio-label" htmlFor={controlId}>
          {label}
        </label>
      ) : null}
    </span>
  );
});

/** Convenience alias matching the ticket naming (Group + Item). */
export const RadioGroupItem = RadioItem;
