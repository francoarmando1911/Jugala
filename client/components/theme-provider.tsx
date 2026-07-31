"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** @description Wrapper del ThemeProvider de next-themes para soporte de temas claro/oscuro */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}