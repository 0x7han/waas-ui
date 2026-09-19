import { createContext } from "react";
import type { WaasBrandName, WaasThemeName } from "../tokens";

export const ThemeContext = createContext<{
  theme: WaasThemeName;
  brand: WaasBrandName | undefined;
}>({ theme: "light", brand: undefined });
