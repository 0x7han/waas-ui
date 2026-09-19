import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant. Defaults to "neutral". */
  variant?: BadgeVariant;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a span wrapper. */
  asChild?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", icon, asChild = false, children, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-variant={variant}
        className={`waas-badge${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <span
      ref={ref}
      data-variant={variant}
      className={`waas-badge${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </span>
  );
});
