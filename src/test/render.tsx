import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { theme } from "@/theme";

import type { ReactElement, ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

// Renders like the app does (with the MUI theme) and returns a user-event instance.
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Providers, ...options }),
  };
}
