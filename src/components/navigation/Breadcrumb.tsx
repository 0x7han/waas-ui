import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from "react";

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  /** Accessible label for the breadcrumb landmark. Defaults to "Breadcrumb". */
  "aria-label"?: string;
}
export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement> 
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement> 
export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Merges props onto the child via Radix Slot instead of rendering an anchor. */
  asChild?: boolean;
}
export type BreadcrumbCurrentProps = HTMLAttributes<HTMLElement> 
export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Decorative separator glyph. Defaults to "/". */
  children?: ReactNode;
}

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(function BreadcrumbRoot(
  { "aria-label": ariaLabel = "Breadcrumb", children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-waas-breadcrumb=""
      className={`waas-breadcrumb${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </nav>
  );
});

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(function BreadcrumbList(
  { children, ...rest },
  ref,
) {
  return (
    <ol
      ref={ref}
      data-waas-breadcrumb-list=""
      className={`waas-breadcrumb-list${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </ol>
  );
});

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      data-waas-breadcrumb-item=""
      className={`waas-breadcrumb-item${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </li>
  );
});

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ asChild = false, children, ...rest }, ref) {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-waas-breadcrumb-link=""
          className={`waas-breadcrumb-link${rest.className ? ` ${rest.className}` : ""}`}
          {...rest}
        >
          {children}
        </Slot>
      );
    }
    return (
      <a
        ref={ref}
        data-waas-breadcrumb-link=""
        className={`waas-breadcrumb-link${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

const BreadcrumbCurrent = forwardRef<HTMLElement, BreadcrumbCurrentProps>(
  function BreadcrumbCurrent({ children, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-current="page"
        data-waas-breadcrumb-current=""
        className={`waas-breadcrumb-current${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ children = "/", ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-waas-breadcrumb-separator=""
        className={`waas-breadcrumb-separator${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
  Separator: BreadcrumbSeparator,
};
