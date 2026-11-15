import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  /** Unique on the page; labels the section landmark. */
  headingId: string;
  /** Optional header action, e.g. a "View all" link. */
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({
  title,
  headingId,
  action,
  children,
}: SectionCardProps) {
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      sx={{ p: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography variant="h2" id={headingId}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
}
