import { Label as RadixLabel } from "@radix-ui/react-label";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface FormFieldState {
  controlId: string;
  descriptionId: string;
  errorId: string;
  error: boolean;
  required: boolean;
  disabled: boolean;
  hasDescription: boolean;
  hasError: boolean;
  registerDescription: () => () => void;
  registerError: () => () => void;
}

import { FormFieldContext, useFormField } from "./FormFieldContext";
export interface FormFieldRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Control id override. Generated when omitted. */
  id?: string;
  /** Error state. Shows FormField.Error and marks controls invalid. */
  error?: boolean;
  /** Required state. Propagates aria-required to controls. */
  required?: boolean;
  /** Disabled state. Propagates disabled to controls. */
  disabled?: boolean;
  children?: ReactNode;
}

export const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldRootProps>(
  function FormFieldRoot(
    { id: idProp, error = false, required = false, disabled = false, className, children, ...rest },
    ref,
  ) {
    const autoId = useId();
    const controlId = idProp ?? `waas-field-${autoId.replace(/[^a-zA-Z0-9-_]/g, "")}`;
    const descriptionId = `${controlId}-description`;
    const errorId = `${controlId}-error`;
    const [descriptionCount, setDescriptionCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);

    const registerDescription = useCallback(() => {
      setDescriptionCount((count) => count + 1);
      return () => {
        setDescriptionCount((count) => Math.max(0, count - 1));
      };
    }, []);

    const registerError = useCallback(() => {
      setErrorCount((count) => count + 1);
      return () => {
        setErrorCount((count) => Math.max(0, count - 1));
      };
    }, []);

    const value = useMemo<FormFieldState>(
      () => ({
        controlId,
        descriptionId,
        errorId,
        error,
        required,
        disabled,
        hasDescription: descriptionCount > 0,
        hasError: errorCount > 0,
        registerDescription,
        registerError,
      }),
      [
        controlId,
        descriptionId,
        errorId,
        error,
        required,
        disabled,
        descriptionCount,
        errorCount,
        registerDescription,
        registerError,
      ],
    );

    return (
      <div
        ref={ref}
        data-invalid={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        className={`waas-field${className ? ` ${className}` : ""}`}
        {...rest}
      >
        <FormFieldContext.Provider value={value}>{children}</FormFieldContext.Provider>
      </div>
    );
  },
);

export type FormFieldLabelProps = ComponentPropsWithoutRef<typeof RadixLabel> 

export const FormFieldLabel = forwardRef<HTMLLabelElement, FormFieldLabelProps>(
  function FormFieldLabel({ className, children, ...rest }, ref) {
    const field = useFormField();
    return (
      <RadixLabel
        ref={ref}
        htmlFor={field?.controlId}
        data-required={field?.required === true ? "true" : undefined}
        className={`waas-field-label${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
        {field?.required === true ? (
          <span aria-hidden="true" data-waas-required-marker="">
            {" *"}
          </span>
        ) : null}
      </RadixLabel>
    );
  },
);

export type FormFieldDescriptionProps = HTMLAttributes<HTMLParagraphElement> 

export const FormFieldDescription = forwardRef<HTMLParagraphElement, FormFieldDescriptionProps>(
  function FormFieldDescription({ className, children, ...rest }, ref) {
    const field = useFormField();
    const registerDescription = field?.registerDescription;
    useEffect(() => registerDescription?.(), [registerDescription]);
    return (
      <p
        ref={ref}
        id={field?.descriptionId}
        className={`waas-field-description${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </p>
    );
  },
);

export type FormFieldErrorProps = HTMLAttributes<HTMLParagraphElement> 

export const FormFieldError = forwardRef<HTMLParagraphElement, FormFieldErrorProps>(
  function FormFieldError({ className, children, ...rest }, ref) {
    const field = useFormField();
    const registerError = field?.registerError;
    const inError = field?.error === true;
    useEffect(() => {
      if (inError && registerError !== undefined) {
        return registerError();
      }
      return undefined;
    }, [inError, registerError]);
    if (field === null || field.error !== true) {
      return null;
    }
    return (
      <p
        ref={ref}
        id={field.errorId}
        role="alert"
        className={`waas-field-error${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </p>
    );
  },
);
