import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type SidebarPreset = "expanded" | "collapsed" | "icon-rail" | "mobile-drawer";

interface SidebarContextValue {
  collapsed: boolean;
  preset: SidebarPreset;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(component: string): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (ctx === null) {
    throw new Error(`${component} must be used inside Sidebar.Root.`);
  }
  return ctx;
}

export interface SidebarRootProps extends HTMLAttributes<HTMLElement> {
  /** Accessible label for the navigation landmark. */
  "aria-label"?: string;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. Defaults to false. */
  defaultCollapsed?: boolean;
  /** Notifies when the collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Layout preset. Defaults to "expanded". */
  preset?: SidebarPreset;
  /** Controlled open state for the mobile-drawer preset. */
  open?: boolean;
  /** Uncontrolled initial open state for the mobile-drawer preset. Defaults to true. */
  defaultOpen?: boolean;
  /** Notifies when the drawer open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Defaults to "Toggle sidebar". */
  "aria-label"?: string;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
}

export interface SidebarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks the item as the current page. */
  active?: boolean;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Small status/count indicator rendered in the trailing badge slot. */
  badge?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a button. */
  asChild?: boolean;
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLElement> {
  /** Accessible label for the group. */
  label: string;
}

export interface SidebarWorkspaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Workspace display name. */
  name: string;
  /** Secondary description such as the plan tier. */
  description?: string;
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
}

export interface SidebarUserProps extends HTMLAttributes<HTMLDivElement> {
  /** User display name. */
  name: string;
  /** User email or secondary line. */
  email?: string;
  /** Consumer-owned avatar rendered in the leading icon slot. */
  avatar?: ReactNode;
}

function focusSiblingItem(current: HTMLElement, direction: 1 | -1 | "first" | "last"): void {
  const root = current.closest("[data-waas-sidebar]");
  if (root === null) {
    return;
  }
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-waas-sidebar-item]")).filter(
    (el) => !(el instanceof HTMLButtonElement && el.disabled),
  );
  const index = items.indexOf(current);
  if (index === -1 || items.length === 0) {
    return;
  }
  let target: HTMLElement | undefined;
  if (direction === "first") {
    target = items[0];
  } else if (direction === "last") {
    target = items[items.length - 1];
  } else {
    target = items[(index + direction + items.length) % items.length];
  }
  target?.focus();
}

function handleItemKeyDown(event: KeyboardEvent<HTMLElement>): void {
  const target = event.currentTarget;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    focusSiblingItem(target, 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    focusSiblingItem(target, -1);
  } else if (event.key === "Home") {
    event.preventDefault();
    focusSiblingItem(target, "first");
  } else if (event.key === "End") {
    event.preventDefault();
    focusSiblingItem(target, "last");
  }
}

const SidebarRoot = forwardRef<HTMLElement, SidebarRootProps>(function SidebarRoot(
  {
    "aria-label": ariaLabel,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    preset = "expanded",
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    onKeyDown,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
  const collapsed = collapsedProp === undefined ? uncontrolledCollapsed : collapsedProp;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp === undefined ? uncontrolledOpen : openProp;

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    if (collapsedProp === undefined) {
      setUncontrolledCollapsed(next);
    }
    onCollapsedChange?.(next);
  }, [collapsed, collapsedProp, onCollapsedChange]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  useEffect(() => {
    if (preset !== "mobile-drawer" || !open) {
      return;
    }
    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [preset, open, setOpen]);

  const context = useMemo<SidebarContextValue>(
    () => ({ collapsed, preset, toggleCollapsed }),
    [collapsed, preset, toggleCollapsed],
  );

  return (
    <SidebarContext.Provider value={context}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-waas-sidebar=""
        data-preset={preset}
        data-collapsed={collapsed ? "true" : undefined}
        data-open={preset === "mobile-drawer" ? (open ? "true" : "false") : undefined}
        className={`waas-sidebar${className ? ` ${className}` : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape" && preset === "mobile-drawer" && open) {
            setOpen(false);
            return;
          }
          onKeyDown?.(event);
        }}
        {...rest}
      >
        {children}
      </nav>
    </SidebarContext.Provider>
  );
});

const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger(
    { "aria-label": ariaLabel = "Toggle sidebar", asChild = false, onClick, className, children, ...rest },
    ref,
  ) {
    const { collapsed, toggleCollapsed } = useSidebarContext("Sidebar.Trigger");
    const triggerClassName = `waas-sidebar-trigger${className ? ` ${className}` : ""}`;
    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-label={ariaLabel}
          aria-expanded={!collapsed}
          data-waas-sidebar-trigger=""
          className={triggerClassName}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            toggleCollapsed();
            (onClick as ((event: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event);
          }}
          {...rest}
        >
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={!collapsed}
        data-waas-sidebar-trigger=""
        className={triggerClassName}
        onClick={(event) => {
          toggleCollapsed();
          onClick?.(event);
        }}
        {...rest}
      >
        {children ?? (collapsed ? "»" : "«")}
      </button>
    );
  },
);

const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(function SidebarItem(
  { active = false, icon, badge, asChild = false, disabled, onKeyDown, className, children, ...rest },
  ref,
) {
  useSidebarContext("Sidebar.Item");
  const onItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      handleItemKeyDown(event);
      onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
    },
    [onKeyDown],
  );
  const itemClassName = `waas-sidebar-item${className ? ` ${className}` : ""}`;
  const shared = {
    "aria-current": active ? ("page" as const) : undefined,
    "data-waas-sidebar-item": "true",
    "data-active": active ? "true" : undefined,
    onKeyDown: onItemKeyDown,
    className: itemClassName,
  };
  if (asChild) {
    return (
      <Slot ref={ref} {...shared} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <button ref={ref} type="button" disabled={disabled} {...shared} {...rest}>
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      <span data-waas-sidebar-label="">{children}</span>
      {badge !== undefined ? <span data-waas-sidebar-badge="">{badge}</span> : null}
    </button>
  );
});

const SidebarGroup = forwardRef<HTMLElement, SidebarGroupProps>(function SidebarGroup(
  { label, className, children, ...rest },
  ref,
) {
  useSidebarContext("Sidebar.Group");
  const titleId = useId();
  return (
    <section
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      className={`waas-sidebar-group${className ? ` ${className}` : ""}`}
      {...rest}
    >
      <span id={titleId} data-waas-sidebar-group-title="">
        {label}
      </span>
      {children}
    </section>
  );
});

const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, children, ...rest }, ref) {
    useSidebarContext("Sidebar.Header");
    return (
      <div
        ref={ref}
        data-waas-sidebar-header=""
        className={`waas-sidebar-header${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, children, ...rest }, ref) {
    useSidebarContext("Sidebar.Footer");
    return (
      <div
        ref={ref}
        data-waas-sidebar-footer=""
        className={`waas-sidebar-footer${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const SidebarWorkspace = forwardRef<HTMLDivElement, SidebarWorkspaceProps>(function SidebarWorkspace(
  { name, description, icon, className, children, ...rest },
  ref,
) {
  useSidebarContext("Sidebar.Workspace");
  return (
    <div
      ref={ref}
      data-waas-sidebar-workspace=""
      className={`waas-sidebar-workspace${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      <span data-waas-sidebar-workspace-text="">
        <span data-waas-sidebar-workspace-name="">{name}</span>
        {description !== undefined ? (
          <span data-waas-sidebar-workspace-description="">{description}</span>
        ) : null}
      </span>
      {children}
    </div>
  );
});

const SidebarUser = forwardRef<HTMLDivElement, SidebarUserProps>(function SidebarUser(
  { name, email, avatar, className, children, ...rest },
  ref,
) {
  useSidebarContext("Sidebar.User");
  return (
    <div
      ref={ref}
      data-waas-sidebar-user=""
      className={`waas-sidebar-user${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {avatar !== undefined ? <span data-waas-icon-slot="">{avatar}</span> : null}
      <span data-waas-sidebar-user-text="">
        <span data-waas-sidebar-user-name="">{name}</span>
        {email !== undefined ? <span data-waas-sidebar-user-email="">{email}</span> : null}
      </span>
      {children}
    </div>
  );
});

export const Sidebar = {
  Root: SidebarRoot,
  Trigger: SidebarTrigger,
  Item: SidebarItem,
  Group: SidebarGroup,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Workspace: SidebarWorkspace,
  User: SidebarUser,
};
