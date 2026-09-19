import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant. Defaults to "info". */
  variant?: AlertVariant;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

/** Inline feedback banner. Always role="alert" so assistive tech announces it. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "info", icon, asChild = false, className, children, ...rest },
  ref,
) {
  const cls = `waas-alert${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <Slot
        ref={ref}
        role="alert"
        data-variant={variant}
        className={cls}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <div ref={ref} role="alert" data-variant={variant} className={cls} {...rest}>
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </div>
  );
});

export interface AlertTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  function AlertTitle({ asChild = false, className, children, ...rest }, ref) {
    const cls = `waas-alert-title${className ? ` ${className}` : ""}`;
    if (asChild) {
      return (
        <Slot ref={ref} className={cls} {...rest}>
          {children}
        </Slot>
      );
    }
    return (
      <div ref={ref} className={cls} {...rest}>
        {children}
      </div>
    );
  },
);

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ asChild = false, className, children, ...rest }, ref) {
    const cls = `waas-alert-description${className ? ` ${className}` : ""}`;
    if (asChild) {
      return (
        <Slot ref={ref} className={cls} {...rest}>
          {children}
        </Slot>
      );
    }
    return (
      <div ref={ref} className={cls} {...rest}>
        {children}
      </div>
    );
  },
);
