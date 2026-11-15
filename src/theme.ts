"use client";

import { createTheme } from "@mui/material/styles";

// Calm clinical palette: neutral surfaces, one teal accent. Every text/background pair below
// meets WCAG AA (4.5:1), checked when the palette was chosen. Status colours (success,
// warning, error) are reserved for meaning, never decoration.
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#0F6E78", contrastText: "#FFFFFF" },
    // MUI's default info (#0288d1) is only 3.86:1 on white, below AA for chip text.
    info: { main: "#0B61A4" },
    background: { default: "#F5F7F8", paper: "#FFFFFF" },
    text: { primary: "#1B2328", secondary: "#4A5862" },
    divider: "#DDE3E7",
  },
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontSize: 14,
    h1: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.35 },
    h3: { fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.4 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
