import * as RadixTabs from "@radix-ui/react-tabs";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type TabsRootProps = ComponentPropsWithoutRef<typeof RadixTabs.Root> 
export type TabsListProps = ComponentPropsWithoutRef<typeof RadixTabs.List> 
export type TabsContentProps = ComponentPropsWithoutRef<typeof RadixTabs.Content> 
export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Consumer-owned icon rendered in the leading icon slot. */
  icon?: ReactNode;
  /** Merges props onto the child via Radix Slot instead of rendering a tab button. */
  asChild?: boolean;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixTabs.Root
      ref={ref}
      data-waas-tabs=""
      className={`waas-tabs${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </RadixTabs.Root>
  );
});

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixTabs.List
      ref={ref}
      data-waas-tabs-list=""
      className={`waas-tabs-list${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </RadixTabs.List>
  );
});

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { icon, asChild = false, className, children, ...rest },
  ref,
) {
  const triggerClassName = `waas-tabs-trigger${className ? ` ${className}` : ""}`;
  if (asChild) {
    return (
      <RadixTabs.Trigger ref={ref} asChild {...rest}>
        <Slot data-waas-tabs-trigger="" className={triggerClassName}>
          {children}
        </Slot>
      </RadixTabs.Trigger>
    );
  }
  return (
    <RadixTabs.Trigger ref={ref} data-waas-tabs-trigger="" className={triggerClassName} {...rest}>
      {icon !== undefined ? <span data-waas-icon-slot="">{icon}</span> : null}
      {children}
    </RadixTabs.Trigger>
  );
});

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixTabs.Content
      ref={ref}
      data-waas-tabs-content=""
      className={`waas-tabs-content${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </RadixTabs.Content>
  );
});

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
