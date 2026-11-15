import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";

type ErrorStateProps = {
  title?: string;
  message?: string;
  /** Shows a retry button when provided. */
  onRetry?: () => void;
  retryLabel?: string;
};

// MUI Alert renders role="alert", so the error is announced immediately.
export function ErrorState({
  title = "Something went wrong",
  message = "The information couldn't be loaded.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : undefined
      }
      sx={{ my: 2 }}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
