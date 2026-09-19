/** Theme name applied as `data-theme` on `<html>`. Built-ins are light/dark; any brand key is allowed. */
export type WaasThemeName = "light" | "dark" | (string & {});

/** Brand key applied as `data-brand` on `<html>`. Composes with the theme. */
export type WaasBrandName = string;
