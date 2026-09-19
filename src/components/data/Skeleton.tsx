import { forwardRef, type HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible label. When set, the skeleton announces via a status role; otherwise it is hidden from assistive tech. */
  "aria-label"?: string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { "aria-label": ariaLabel, ...rest },
  ref,
) {
  if (ariaLabel !== undefined) {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        data-loading="true"
        className={`waas-skeleton${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  }
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-loading="true"
      className={`waas-skeleton${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});
