import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarRootProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size hook for layout. Defaults to "md". */
  size?: AvatarSize;
  /** Merges props onto the child via Radix Slot instead of rendering a span wrapper. */
  asChild?: boolean;
}

export const AvatarRoot = forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  { size = "md", asChild = false, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-size={size}
        className={`waas-avatar${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      >
        {rest.children}
      </Slot>
    );
  }
  return (
    <span
      ref={ref}
      data-size={size}
      className={`waas-avatar${rest.className ? ` ${rest.className}` : ""}`}
      {...rest}
    />
  );
});

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Accessible label for the avatar image. Required — avatars identify people. */
  alt: string;
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
  props,
  ref,
) {
  return (
    <img
      ref={ref}
      role="img"
      className={`waas-avatar-image${props.className ? ` ${props.className}` : ""}`}
      {...props}
    />
  );
});

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  /** Merges props onto the child via Radix Slot instead of rendering a span wrapper. */
  asChild?: boolean;
}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ asChild = false, ...rest }, ref) {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-waas-avatar-fallback="true"
          className={`waas-avatar-fallback${rest.className ? ` ${rest.className}` : ""}`}
          {...rest}
        >
          {rest.children}
        </Slot>
      );
    }
    return (
      <span
        ref={ref}
        data-waas-avatar-fallback="true"
        aria-hidden={rest["aria-hidden"] ?? true}
        className={`waas-avatar-fallback${rest.className ? ` ${rest.className}` : ""}`}
        {...rest}
      />
    );
  },
);
