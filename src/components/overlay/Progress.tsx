import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes } from "react";

export type ProgressState = "loading" | "complete" | "indeterminate";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Determinate value. Omit for an indeterminate bar. */
  value?: number;
  /** Range minimum. Defaults to 0. */
  min?: number;
  /** Range maximum. Defaults to 100. */
  max?: number;
  /** Accessible label for the progressbar. */
  label?: string;
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

/** Determinate or indeterminate progress bar with progressbar semantics. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, min = 0, max = 100, label, asChild = false, className, ...rest },
  ref,
) {
  const cls = `waas-progress${className ? ` ${className}` : ""}`;
  if (value === undefined) {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          role="progressbar"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          data-state="indeterminate"
          className={cls}
          {...rest}
        />
      );
    }
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        data-state="indeterminate"
        className={cls}
        {...rest}
      >
        <div className="waas-progress-indicator" />
      </div>
    );
  }
  const clamped = value < min ? min : value > max ? max : value;
  const state: ProgressState = clamped >= max ? "complete" : "loading";
  const range = max - min;
  const percent = range <= 0 ? 100 : ((clamped - min) / range) * 100;
  if (asChild) {
    return (
      <Slot
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(clamped)}
        data-state={state}
        data-value={Math.round(clamped)}
        className={cls}
        {...rest}
      />
    );
  }
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(clamped)}
      data-state={state}
      data-value={Math.round(clamped)}
      className={cls}
      {...rest}
    >
      <div className="waas-progress-indicator" style={{ width: `${percent}%` }} />
    </div>
  );
});
