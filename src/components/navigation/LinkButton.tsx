"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import NextLink from "next/link";

type LinkButtonProps = Omit<ButtonProps<typeof NextLink>, "component"> & {
  href: string;
};

// A MUI Button that navigates with Next's Link. It's a client component so Server Components can
// use it: they can't pass `component={NextLink}` (a function) across the server/client boundary.
export function LinkButton(props: LinkButtonProps) {
  return <Button component={NextLink} {...props} />;
}
