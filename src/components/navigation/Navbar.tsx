import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

export type NavbarRootProps = HTMLAttributes<HTMLElement> 
export interface NavbarBrandProps extends HTMLAttributes<HTMLDivElement> {
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a div. */
  asChild?: boolean;
}
export interface NavbarNavProps extends HTMLAttributes<HTMLElement> {
  /** Accessible label for the inner navigation landmark. */
  "aria-label"?: string;
}
export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as the current page. */
  active?: boolean;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering an anchor. */
  asChild?: boolean;
}
export type NavbarActionsProps = HTMLAttributes<HTMLDivElement> 

const NavbarRoot = forwardRef<HTMLElement, NavbarRootProps>(function NavbarRoot(
  { children, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      data-waas-navbar=""
      className={`waas-navbar${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </header>
  );
});

const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(function NavbarBrand(
  { icon, asChild = false, children, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-waas-navbar-brand=""
        className={`waas-navbar-brand${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      data-waas-navbar-brand=""
      className={`waas-navbar-brand${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      <span data-waas-navbar-brand-text="">{children}</span>
    </div>
  );
});

const NavbarNav = forwardRef<HTMLElement, NavbarNavProps>(function NavbarNav(
  { "aria-label": ariaLabel, children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-waas-navbar-nav=""
      className={`waas-navbar-nav${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </nav>
  );
});

const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(function NavbarLink(
  { active = false, icon, asChild = false, children, ...rest },
  ref,
) {
  const shared = {
    "aria-current": active ? ("page" as const) : undefined,
    "data-waas-navbar-link": "true",
    "data-active": active ? "true" : undefined,
  };
  if (asChild) {
    return (
      <Slot
        ref={ref}
        {...shared}
        className={`waas-navbar-link${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <a
      ref={ref}
      {...shared}
      className={`waas-navbar-link${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </a>
  );
});

const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(function NavbarActions(
  { children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-waas-navbar-actions=""
      className={`waas-navbar-actions${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    >
      {children}
    </div>
  );
});

export const Navbar = {
  Root: NavbarRoot,
  Brand: NavbarBrand,
  Nav: NavbarNav,
  Link: NavbarLink,
  Actions: NavbarActions,
};
