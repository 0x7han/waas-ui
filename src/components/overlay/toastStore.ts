import type { ReactNode } from "react";

export type ToastVariant = "info" | "success" | "warning" | "danger";

export interface ToastInput {
  /** Toast heading, announced by screen readers. */
  title: ReactNode;
  /** Optional supporting text. */
  description?: ReactNode;
  /** Visual variant. Defaults to "info". */
  variant?: ToastVariant;
}

export interface ToastData extends ToastInput {
  id: string;
  variant: ToastVariant;
}

export interface ToastStore {
  /** Current toasts, oldest first. Returns a stable reference between mutations. */
  getToasts(): ToastData[];
  /** Re-subscribes on every publish, dismiss, or clear. */
  subscribe(listener: () => void): () => void;
  /** Publishes a toast and returns its id. */
  toast(input: ToastInput): string;
  /** Removes the toast with the given id, if present. */
  dismiss(id: string): void;
  /** Removes every toast. */
  clear(): void;
}

/** Creates an isolated toast store. Render it with ToastProvider. */
export function createToastStore(): ToastStore {
  let toasts: ToastData[] = [];
  const listeners = new Set<() => void>();
  let sequence = 0;

  function emit(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getToasts: () => toasts,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    toast: (input: ToastInput) => {
      sequence += 1;
      const id = `waas-toast-${sequence}`;
      toasts = [...toasts, { variant: "info", ...input, id }];
      emit();
      return id;
    },
    dismiss: (id: string) => {
      if (toasts.some((toast) => toast.id === id)) {
        toasts = toasts.filter((toast) => toast.id !== id);
        emit();
      }
    },
    clear: () => {
      if (toasts.length > 0) {
        toasts = [];
        emit();
      }
    },
  };
}

/** Shared store behind the `toast()` helper. */
const defaultToastStore = createToastStore();

/** Publishes a toast on the shared store and returns its id. */
export function toast(input: ToastInput): string {
  return defaultToastStore.toast(input);
}

/** Dismisses a toast on the shared store. */
export function dismissToast(id: string): void {
  defaultToastStore.dismiss(id);
}

export function getDefaultToastStore(): ToastStore {
  return defaultToastStore;
}

