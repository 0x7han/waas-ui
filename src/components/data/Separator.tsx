import { forwardRef, type HTMLAttributes } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation hook for layout. Defaults to "horizontal". */
  orientation?: SeparatorOrientation;
  /** When true (default) the separator is decorative and hidden from assistive tech. */
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = true, ...rest },
  ref,
) {
  if (decorative) {
    return (
      <div
        ref={ref}
        role="none"
        data-orientation={orientation}
        className={`waas-separator${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  }
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={`waas-separator${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});
