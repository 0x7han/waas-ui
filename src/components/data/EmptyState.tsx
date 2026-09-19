import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface EmptyStateRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Consumer-owned icon rendered in the icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const EmptyStateRoot = forwardRef<HTMLDivElement, EmptyStateRootProps>(
  function EmptyStateRoot({ icon, asChild = false, ...rest }, ref) {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-waas-empty-state="true"
          className={`waas-empty-state${rest.className ? ` ${rest.className}` : ""}`}
          {...rest}
        >
          {rest.children}
        </Slot>
      );
    }
    return (
      <div
        ref={ref}
        data-waas-empty-state="true"
        className={`waas-empty-state${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
        {rest.children}
      </div>
    );
  },
);

export interface EmptyStateTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level rendered for the title. Defaults to 3. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle({ level = 3, ...rest }, ref) {
    const Tag = `h${level}` as "h3";
    return (
      <Tag
        ref={ref as never}
        className={`waas-empty-state-title${rest.className ? ` ${rest.className}` : ""}`}
        {...(rest as object)}
      />
    );
  },
);

export type EmptyStateDescriptionProps = HTMLAttributes<HTMLParagraphElement> 

export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  function EmptyStateDescription(props, ref) {
    return (
      <p
        ref={ref}
        className={`waas-empty-state-description${props.className ? ` ${props.className}` : ""}`}
        {...props}
      />
    );
  },
);

export interface EmptyStateActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  function EmptyStateActions({ asChild = false, ...rest }, ref) {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-waas-empty-state-actions="true"
          className={`waas-empty-state-actions${rest.className ? ` ${rest.className}` : ""}`}
          {...rest}
        >
          {rest.children}
        </Slot>
      );
    }
    return (
      <div
        ref={ref}
        data-waas-empty-state-actions="true"
        className={`waas-empty-state-actions${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  },
);
