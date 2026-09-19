import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";
import type { ButtonVariant } from "./Button";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Required — icon-only controls expose no visible text. */
  "aria-label": string;
  /** Visual variant. Defaults to "ghost". */
  variant?: ButtonVariant;
  /** Shows a Spinner, disables the control, and blocks clicks. */
  loading?: boolean;
  /** Consumer-owned icon. Required — the only visible content. */
  icon: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", loading = false, icon, asChild = false, disabled, children, ...rest },
  ref,
) {
  const isDisabled = disabled === true || loading;
  if (asChild) {
    return (
      <Slot
        ref={ref}
        aria-disabled={isDisabled ? "true" : undefined}
        data-variant={variant}
        data-shape="square"
        data-loading={loading ? "true" : undefined}
        data-disabled={isDisabled && !loading ? "true" : undefined}
        className={`waas-button waas-icon-button${rest.className ? ` ${rest.className}` : ""}`}
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
      data-shape="square"
      data-loading={loading ? "true" : undefined}
      data-disabled={isDisabled && !loading ? "true" : undefined}
      className={`waas-button waas-icon-button${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {loading ? <Spinner aria-label="Loading" data-waas-icon-slot="" /> : null}
      {!loading ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </button>
  );
});
