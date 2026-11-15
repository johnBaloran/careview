import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { theme } from "@/theme";

import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "CareView", template: "%s · CareView" },
  description: "Clinical patient overview built on synthetic data",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
