import { forwardRef, type TextareaHTMLAttributes } from "react";
import { useFormField } from "./FormFieldContext";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Standalone error display. Inside a FormField.Root the field error applies. */
  error?: boolean;
  /** Shows a loading status, disables the control, and blocks typing. */
  loading?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    error: errorProp = false,
    loading = false,
    className,
    id: idProp,
    required: requiredProp,
    disabled: disabledProp,
    "aria-describedby": describedByProp,
    "aria-invalid": invalidProp,
    children,
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

  return (
    <>
      {loading ? (
        <svg
          role="status"
          aria-label="Loading"
          viewBox="0 0 16 16"
          fill="none"
          className="waas-input-spinner"
          data-waas-icon-slot="status"
          aria-hidden={false}
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
          <path
            d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      <textarea
        ref={ref}
        id={id}
        required={required || undefined}
        disabled={disabled}
        aria-required={required ? "true" : undefined}
        aria-invalid={inError ? "true" : invalidProp}
        aria-describedby={describedBy}
        data-invalid={inError ? "true" : undefined}
        data-required={required ? "true" : undefined}
        data-disabled={disabled && !loading ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        className={`waas-textarea${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </textarea>
    </>
  );
});
