import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { useFormField } from "./FormFieldContext";

export type InputType = "text" | "email" | "password" | "search" | "number";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "prefix"> {
  /** Input composition. Defaults to "text". */
  type?: InputType;
  /** Leading adornment rendered in the prefix icon slot. */
  prefix?: ReactNode;
  /** Trailing adornment rendered in the suffix icon slot. */
  suffix?: ReactNode;
  /** Success validation display. Ignored while in the error state. */
  success?: boolean;
  /** Standalone error display. Inside a FormField.Root the field error applies. */
  error?: boolean;
  /** Shows a loading Spinner, disables the control, and blocks typing. */
  loading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    prefix,
    suffix,
    success = false,
    error: errorProp = false,
    loading = false,
    className,
    id: idProp,
    required: requiredProp,
    disabled: disabledProp,
    "aria-describedby": describedByProp,
    "aria-invalid": invalidProp,
    ...rest
  },
  ref,
) {
  const field = useFormField();
  const id = idProp ?? field?.controlId;
  const inError = errorProp || field?.error === true;
  const required = requiredProp ?? field?.required ?? false;
  const disabled = (disabledProp ?? field?.disabled ?? false) || loading;

  const describedByIds: string[] = [];
  if (describedByProp !== undefined && describedByProp !== "") {
    describedByIds.push(describedByProp);
  }
  if (field?.hasDescription === true) {
    describedByIds.push(field.descriptionId);
  }
  if (inError && field?.hasError === true) {
    describedByIds.push(field.errorId);
  }
  const describedBy = describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

  const showValid = success && !inError;
  const inputClassName = `waas-input${className ? ` ${className}` : ""}`;
  const input = (
    <input
      ref={ref}
      id={id}
      type={type}
      required={required || undefined}
      disabled={disabled}
      aria-required={required ? "true" : undefined}
      aria-invalid={inError ? "true" : invalidProp}
      aria-describedby={describedBy}
      data-invalid={inError ? "true" : undefined}
      data-valid={showValid ? "true" : undefined}
      data-required={required ? "true" : undefined}
      data-disabled={disabled && !loading ? "true" : undefined}
      data-loading={loading ? "true" : undefined}
      className={inputClassName}
      {...rest}
    />
  );

  if (prefix === undefined && suffix === undefined && !loading) {
    return input;
  }
  return (
    <span
      data-invalid={inError ? "true" : undefined}
      data-disabled={disabled && !loading ? "true" : undefined}
      data-loading={loading ? "true" : undefined}
      className="waas-input-wrapper"
    >
      {loading ? (
        <span data-waas-icon-slot="prefix">
          <svg
            role="status"
            aria-label="Loading"
            viewBox="0 0 16 16"
            fill="none"
            className="waas-input-spinner"
            aria-hidden={false}
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <path
              d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : prefix !== undefined ? (
        <span data-waas-icon-slot="prefix">{prefix}</span>
      ) : null}
      {input}
      {suffix !== undefined ? <span data-waas-icon-slot="suffix">{suffix}</span> : null}
    </span>
  );
});
