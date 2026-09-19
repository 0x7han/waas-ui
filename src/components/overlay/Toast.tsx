import * as ToastPrimitive from "@radix-ui/react-toast";
import {
  forwardRef,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";

import { getDefaultToastStore } from "./toastStore";
import type { ToastStore } from "./toastStore";
export interface ToastProviderProps
  extends ComponentPropsWithoutRef<typeof ToastPrimitive.Provider> {
  /** Store rendered by this provider. Defaults to the shared store behind `toast()`. */
  store?: ToastStore;
  /** Class applied to the toast viewport list. */
  viewportClassName?: string;
}

/** Hosts store toasts on a Radix viewport. Swipe, timer, and Escape semantics come from Radix. */
export function ToastProvider({
  store = getDefaultToastStore(),
  viewportClassName,
  children,
  ...rest
}: ToastProviderProps): ReactNode {
  const toasts = useSyncExternalStore(store.subscribe, store.getToasts);
  return (
    <ToastPrimitive.Provider {...rest}>
      {children}
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          open
          role="status"
          onOpenChange={(open: boolean) => {
            if (!open) {
              store.dismiss(item.id);
            }
          }}
          data-variant={item.variant}
          className="waas-toast"
        >
          <ToastPrimitive.Title className="waas-toast-title">
            {item.title}
          </ToastPrimitive.Title>
          {item.description !== undefined ? (
            <ToastPrimitive.Description className="waas-toast-description">
              {item.description}
            </ToastPrimitive.Description>
          ) : null}
          <ToastPrimitive.Close
            aria-label="Dismiss toast"
            className="waas-toast-close"
          >
            {"\u00D7"}
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        className={`waas-toast-viewport${viewportClassName ? ` ${viewportClassName}` : ""}`}
      />
    </ToastPrimitive.Provider>
  );
}

export type ToastViewportProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(function ToastViewport({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={`waas-toast-viewport${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
});
