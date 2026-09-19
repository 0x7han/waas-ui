import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes } from "react";

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-waas-card="true"
        className={`waas-card${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      data-waas-card="true"
      className={`waas-card${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={`waas-card-header${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      className={`waas-card-header${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level rendered for the title. Defaults to 3. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { level = 3, ...rest },
  ref,
) {
  const Tag = `h${level}` as "h3";
  return (
    <Tag
      ref={ref as never}
      className={`waas-card-title${rest.className ? ` ${rest.className}` : ""}`}
      {...(rest as object)}
    />
  );
});

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> 

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription(props, ref) {
    return (
      <p
        ref={ref}
        className={`waas-card-description${props.className ? ` ${props.className}` : ""}`}
        {...props}
      />
    );
  },
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={`waas-card-content${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      className={`waas-card-content${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a div wrapper. */
  asChild?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={`waas-card-footer${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      className={`waas-card-footer${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});
