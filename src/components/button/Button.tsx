import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Shows a Spinner, disables the control, and blocks clicks. */
  loading?: boolean;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading = false, icon, asChild = false, disabled, children, ...rest },
  ref,
) {
  const isDisabled = disabled === true || loading;
  if (asChild) {
    return (
      <Slot
        ref={ref}
        aria-disabled={isDisabled ? "true" : undefined}
        data-variant={variant}
        data-loading={loading ? "true" : undefined}
        data-disabled={isDisabled && !loading ? "true" : undefined}
        className={`waas-button${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled ? "true" : undefined}
      data-variant={variant}
      data-loading={loading ? "true" : undefined}
      data-disabled={isDisabled && !loading ? "true" : undefined}
      className={`waas-button${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {loading ? <Spinner aria-label="Loading" data-waas-icon-slot="" /> : null}
      {icon !== undefined && !loading ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </button>
  );
});
