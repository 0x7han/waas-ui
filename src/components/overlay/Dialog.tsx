import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

/** Controlled or uncontrolled dialog root. Focus trap, Escape, portal, and scroll lock come from Radix. */
export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root {...props} />;
}

export interface DialogTriggerProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const DialogTrigger = forwardRef<
  ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(function DialogTrigger({ asChild = false, className, ...rest }, ref) {
  return (
    <DialogPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={`waas-dialog-trigger${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Class applied to the overlay element behind the dialog. */
  overlayClassName?: string;
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ overlayClassName, className, children, ...rest }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={`waas-dialog-overlay${overlayClassName ? ` ${overlayClassName}` : ""}`}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={`waas-dialog-content${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(function DialogTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={`waas-dialog-title${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`waas-dialog-description${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});

export interface DialogCloseProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  /** Merges props onto the child instead of rendering a button wrapper. */
  asChild?: boolean;
}

export const DialogClose = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseProps
>(function DialogClose({ asChild = false, className, ...rest }, ref) {
  return (
    <DialogPrimitive.Close
      ref={ref}
      asChild={asChild}
      className={`waas-dialog-close${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
