import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Page-level actions, e.g. a primary button. Wraps below the title on narrow screens. */
  actions?: ReactNode;
};

// Every page has exactly one h1, rendered here.
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h1">{title}</Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box> : null}
    </Box>
  );
}
