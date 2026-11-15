import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

type LoadingStateProps = {
  /** Visible text, also announced politely to screen readers. */
  label?: string;
};

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 4,
        justifyContent: "center",
      }}
    >
      <CircularProgress size={20} aria-hidden />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}
