import { forwardRef, type SVGProps } from "react";

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  /** Accessible label for the loading status. Defaults to "Loading". */
  "aria-label"?: string;
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { "aria-label": ariaLabel = "Loading", ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      viewBox="0 0 16 16"
      fill="none"
      className={`waas-spinner${rest.className ? ` ${rest.className}` : ""}`}
      aria-hidden={ariaLabel === undefined ? true : undefined}
      {...rest}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});
