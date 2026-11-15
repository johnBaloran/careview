import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  /** Optional next step, e.g. a "Clear filters" button. */
  action?: ReactNode;
};

// role="status" so a list becoming empty (e.g. after a search) is announced.
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box role="status" sx={{ textAlign: "center", py: 6, px: 2 }}>
      <Typography variant="h3" component="p">
        {title}
      </Typography>
      {description ? (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{ mt: 2 }}>{action}</Box> : null}
    </Box>
  );
}
