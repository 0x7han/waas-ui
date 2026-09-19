import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export type DrawerSide = "left" | "right";

export type DrawerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

/** Side drawer built on the Dialog root: same focus trap, Escape, portal, and scroll lock. No gestures. */
export function Drawer(props: DrawerProps) {
  return <DialogPrimitive.Root {...props} />;
}

export interface DrawerTriggerProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const DrawerTrigger = forwardRef<
  ElementRef<typeof DialogPrimitive.Trigger>,
  DrawerTriggerProps
>(function DrawerTrigger({ asChild = false, className, ...rest }, ref) {
  return (
    <DialogPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={`waas-drawer-trigger${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export interface DrawerContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Which edge the drawer slides from. Defaults to "right". */
  side?: DrawerSide;
  /** Class applied to the overlay element behind the drawer. */
  overlayClassName?: string;
}

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent(
  { side = "right", overlayClassName, className, children, ...rest },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={`waas-drawer-overlay${overlayClassName ? ` ${overlayClassName}` : ""}`}
      />
      <DialogPrimitive.Content
        ref={ref}
        data-side={side}
        className={`waas-drawer-content${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(function DrawerTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={`waas-drawer-title${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type DrawerDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(function DrawerDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`waas-drawer-description${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export interface DrawerCloseProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const DrawerClose = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DrawerCloseProps
>(function DrawerClose({ asChild = false, className, ...rest }, ref) {
  return (
    <DialogPrimitive.Close
      ref={ref}
      asChild={asChild}
      className={`waas-drawer-close${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
