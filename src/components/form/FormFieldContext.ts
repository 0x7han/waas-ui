import { createContext, useContext } from "react";
import type { FormFieldState } from "./FormField";

export const FormFieldContext = createContext<FormFieldState | null>(null);

/** Reads the enclosing FormField state. Null outside a FormField.Root. */
export function useFormField(): FormFieldState | null {
  return useContext(FormFieldContext);
}
