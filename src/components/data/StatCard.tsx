import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface StatCardRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const StatCardRoot = forwardRef<HTMLDivElement, StatCardRootProps>(function StatCardRoot(
  { icon, asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-waas-stat-card="true"
        className={`waas-stat-card${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      data-waas-stat-card="true"
      className={`waas-stat-card${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      {rest.children}
    </div>
  );
});

export type StatCardLabelProps = HTMLAttributes<HTMLDivElement> 

export const StatCardLabel = forwardRef<HTMLDivElement, StatCardLabelProps>(function StatCardLabel(
  props,
  ref,
) {
  return (
    <div
      ref={ref}
      className={`waas-stat-card-label${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export type StatCardValueProps = HTMLAttributes<HTMLDivElement> 

export const StatCardValue = forwardRef<HTMLDivElement, StatCardValueProps>(function StatCardValue(
  props,
  ref,
) {
  return (
    <div
      ref={ref}
      className={`waas-stat-card-value${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export type StatCardDeltaTrend = "up" | "down" | "flat";

export interface StatCardDeltaProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction hook for styling and screen-reader-friendly data attribute. Defaults to "flat". */
  trend?: StatCardDeltaTrend;
}

export const StatCardDelta = forwardRef<HTMLDivElement, StatCardDeltaProps>(function StatCardDelta(
  { trend = "flat", ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-trend={trend}
      className={`waas-stat-card-delta${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export type StatCardHintProps = HTMLAttributes<HTMLDivElement> 

export const StatCardHint = forwardRef<HTMLDivElement, StatCardHintProps>(function StatCardHint(
  props,
  ref,
) {
  return (
    <div
      ref={ref}
      className={`waas-stat-card-hint${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});
