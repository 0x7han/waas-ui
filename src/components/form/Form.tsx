import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type FormHTMLAttributes } from "react";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a form wrapper. */
  asChild?: boolean;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const mergedClassName = `waas-form${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <Slot ref={ref} className={mergedClassName} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <form ref={ref} className={mergedClassName} {...rest}>
      {children}
    </form>
  );
});
