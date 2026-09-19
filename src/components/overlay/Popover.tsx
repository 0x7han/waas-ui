import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/** Non-modal popover root. Escape and outside-click dismissal come from Radix. */
export function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root {...props} />;
}

export interface PopoverTriggerProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<
  ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(function PopoverTrigger({ asChild = false, className, ...rest }, ref) {
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={`waas-popover-trigger${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type PopoverContentProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent({ sideOffset = 4, className, children, ...rest }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={`waas-popover-content${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

export interface PopoverCloseProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const PopoverClose = forwardRef<
  ElementRef<typeof PopoverPrimitive.Close>,
  PopoverCloseProps
>(function PopoverClose({ asChild = false, className, ...rest }, ref) {
  return (
    <PopoverPrimitive.Close
      ref={ref}
      asChild={asChild}
      className={`waas-popover-close${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
