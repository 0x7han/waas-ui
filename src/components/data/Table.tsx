import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

export type TableMobileStrategy = "scroll" | "cards";

export interface TableRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Mobile strategy hook. "scroll" keeps a scroll region; "cards" signals a stacked-card fallback. Defaults to "scroll". */
  mobileStrategy?: TableMobileStrategy;
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const TableRoot = forwardRef<HTMLDivElement, TableRootProps>(function TableRoot(
  { mobileStrategy = "scroll", asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-mobile-strategy={mobileStrategy}
        className={`waas-table-root${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      data-mobile-strategy={mobileStrategy}
      className={`waas-table-root${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-waas-table-toolbar="true"
        className={`waas-table-toolbar${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      data-waas-table-toolbar="true"
      className={`waas-table-toolbar${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export type TableSearchProps = InputHTMLAttributes<HTMLInputElement> 

export const TableSearch = forwardRef<HTMLInputElement, TableSearchProps>(function TableSearch(
  props,
  ref,
) {
  return (
    <input
      ref={ref}
      type="search"
      data-waas-table-search="true"
      className={`waas-table-search${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export interface TableFiltersProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const TableFilters = forwardRef<HTMLDivElement, TableFiltersProps>(function TableFilters(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        role={rest.role ?? "group"}
        data-waas-table-filters="true"
        className={`waas-table-filters${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      role={rest.role ?? "group"}
      data-waas-table-filters="true"
      className={`waas-table-filters${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface TablePaginationProps extends HTMLAttributes<HTMLElement> {
  /** Compact hook for small viewports: tighter gaps and stacked controls. */
  compact?: boolean;
  /** Accessible label for the pagination landmark. Defaults to "Pagination". */
  "aria-label"?: string;
}

export const TablePagination = forwardRef<HTMLElement, TablePaginationProps>(
  function TablePagination({ compact = false, "aria-label": ariaLabel = "Pagination", ...rest }, ref) {
    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-compact={compact ? "true" : undefined}
        className={`waas-table-pagination${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  },
);

export interface TableElementProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Accessible label for the scroll region wrapper. When set, the wrapper is a labelled region. */
  scrollLabel?: string;
  /** Consumer-owned caption is separate (Table.Caption); this labels the scroll region only. */
  "aria-label"?: string;
}

export const TableBase = forwardRef<HTMLTableElement, TableElementProps>(function TableBase(
  { scrollLabel, ...rest },
  ref,
) {
  return (
    <div
      role={scrollLabel === undefined ? undefined : "region"}
      aria-label={scrollLabel}
      tabIndex={0}
      data-waas-table-scroll="true"
      className="waas-table-scroll"
    >
      <table
        ref={ref}
        className={`waas-table${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    </div>
  );
});

export type TableCaptionProps = HTMLAttributes<HTMLElement> 

export const TableCaption = forwardRef<HTMLElement, TableCaptionProps>(function TableCaption(
  props,
  ref,
) {
  return (
    <caption
      ref={ref as never}
      className={`waas-table-caption${props.className ? ` ${props.className}` : ""}`}
      {...(props as object)}
    />
  );
});

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement> 

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  props,
  ref,
) {
  return (
    <thead
      ref={ref}
      className={`waas-table-head${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> 

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  props,
  ref,
) {
  return (
    <tbody
      ref={ref}
      className={`waas-table-body${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> 

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  props,
  ref,
) {
  return (
    <tr ref={ref} className={`waas-table-row${props.className ? ` ${props.className}` : ""}`} {...props} />
  );
});

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Mobile priority hook: 1 stays visible longest; higher numbers hide first. */
  priority?: number;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ priority, scope, ...rest }, ref) {
    return (
      <th
        ref={ref}
        scope={scope ?? "col"}
        data-priority={priority}
        className={`waas-table-header-cell${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  },
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Mobile priority hook: 1 stays visible longest; higher numbers hide first. */
  priority?: number;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { priority, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      data-priority={priority}
      className={`waas-table-cell${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface TableCompound {
  Root: typeof TableRoot;
  Toolbar: typeof TableToolbar;
  Search: typeof TableSearch;
  Filters: typeof TableFilters;
  Pagination: typeof TablePagination;
  Caption: typeof TableCaption;
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  HeaderCell: typeof TableHeaderCell;
  Cell: typeof TableCell;
}
