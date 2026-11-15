import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareView",
  description: "Clinical patient overview built on synthetic data",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
