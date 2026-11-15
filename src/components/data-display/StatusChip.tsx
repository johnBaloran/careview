import Chip from "@mui/material/Chip";

type StatusChipProps = {
  label: string;
  /** Colour carries meaning only; the label always says the status in words. */
  tone?: "positive" | "neutral" | "info";
};

const COLORS = {
  positive: "success",
  neutral: "default",
  info: "info",
} as const;

export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return (
    <Chip size="small" variant="outlined" color={COLORS[tone]} label={label} />
  );
}
