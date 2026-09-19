import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";


import { getPaginationItems } from "./getPaginationItems";
interface PaginationContextValue {
  page: number;
  pageCount: number;
  siblingCount: number;
  goTo: (page: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext(component: string): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (ctx === null) {
    throw new Error(`${component} must be used inside Pagination.Root.`);
  }
  return ctx;
}

export interface PaginationRootProps extends HTMLAttributes<HTMLElement> {
  /** Total number of pages. Must be at least 1. */
  pageCount: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page. Defaults to 1. */
  defaultPage?: number;
  /** Notifies when the page changes. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Accessible label for the navigation landmark. Defaults to "Pagination". */
  "aria-label"?: string;
}

export interface PaginationPrevProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Defaults to "Previous page". */
  "aria-label"?: string;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
}

export interface PaginationNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Defaults to "Next page". */
  "aria-label"?: string;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
}

export type PaginationPagesProps = HTMLAttributes<HTMLDivElement>;

const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
  {
    pageCount,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    "aria-label": ariaLabel = "Pagination",
    className,
    children,
    ...rest
  },
  ref,
) {
  const total = Math.max(1, Math.floor(pageCount));
  const clamp = useCallback((p: number) => Math.min(Math.max(1, Math.floor(p)), total), [total]);
  const [uncontrolled, setUncontrolled] = useState(() => clamp(defaultPage));
  const page = pageProp === undefined ? uncontrolled : clamp(pageProp);

  const goTo = useCallback(
    (next: number) => {
      const clamped = clamp(next);
      if (pageProp === undefined) {
        setUncontrolled((prev) => (prev === clamped ? prev : clamped));
      }
      if (clamped !== page) {
        onPageChange?.(clamped);
      }
    },
    [clamp, onPageChange, page, pageProp],
  );

  const context = useMemo<PaginationContextValue>(
    () => ({ page, pageCount: total, siblingCount, goTo }),
    [page, total, siblingCount, goTo],
  );

  return (
    <PaginationContext.Provider value={context}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-waas-pagination=""
        data-page={page}
        data-page-count={total}
        className={`waas-pagination${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
});

const PaginationPrev = forwardRef<HTMLButtonElement, PaginationPrevProps>(function PaginationPrev(
  {
    "aria-label": ariaLabel = "Previous page",
    asChild = false,
    disabled,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { page, goTo } = usePaginationContext("Pagination.Prev");
  const isDisabled = disabled === true || page <= 1;
  const prevClassName = `waas-pagination-prev${className ? ` ${className}` : ""}`;
  const handleSlotClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    goTo(page - 1);
    (onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };
  if (asChild) {
    return (
      <Slot
        ref={ref}
        aria-label={ariaLabel}
        data-waas-pagination-prev=""
        aria-disabled={isDisabled ? "true" : undefined}
        className={prevClassName}
        onClick={handleSlotClick}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  const label: ReactNode = children === undefined ? "‹" : children;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      disabled={isDisabled}
      data-waas-pagination-prev=""
      className={prevClassName}
      onClick={(event) => {
        goTo(page - 1);
        onClick?.(event);
      }}
      {...rest}
    >
      {label}
    </button>
  );
});

const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(function PaginationNext(
  {
    "aria-label": ariaLabel = "Next page",
    asChild = false,
    disabled,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { page, pageCount, goTo } = usePaginationContext("Pagination.Next");
  const isDisabled = disabled === true || page >= pageCount;
  const nextClassName = `waas-pagination-next${className ? ` ${className}` : ""}`;
  const handleSlotClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    goTo(page + 1);
    (onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };
  if (asChild) {
    return (
      <Slot
        ref={ref}
        aria-label={ariaLabel}
        data-waas-pagination-next=""
        aria-disabled={isDisabled ? "true" : undefined}
        className={nextClassName}
        onClick={handleSlotClick}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  const label: ReactNode = children === undefined ? "›" : children;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      disabled={isDisabled}
      data-waas-pagination-next=""
      className={nextClassName}
      onClick={(event) => {
        goTo(page + 1);
        onClick?.(event);
      }}
      {...rest}
    >
      {label}
    </button>
  );
});

const PaginationPages = forwardRef<HTMLDivElement, PaginationPagesProps>(function PaginationPages(
  { className, children, ...rest },
  ref,
) {
  const { page, pageCount, siblingCount, goTo } = usePaginationContext("Pagination.Pages");
  const items = getPaginationItems(page, pageCount, siblingCount);
  return (
    <div
      ref={ref}
      data-waas-pagination-pages=""
      className={`waas-pagination-pages${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children ??
        items.map((item) =>
          item.kind === "ellipsis" ? (
            <span key={item.key} aria-hidden="true" data-waas-pagination-ellipsis="">
              …
            </span>
          ) : (
            <button
              key={item.page}
              type="button"
              aria-label={`Page ${item.page}`}
              aria-current={item.page === page ? "page" : undefined}
              data-waas-pagination-page=""
              data-current={item.page === page ? "true" : undefined}
              className="waas-pagination-page"
              onClick={() => goTo(item.page)}
            >
              {item.page}
            </button>
          ),
        )}
    </div>
  );
});

export const Pagination = {
  Root: PaginationRoot,
  Prev: PaginationPrev,
  Pages: PaginationPages,
  Next: PaginationNext,
};
