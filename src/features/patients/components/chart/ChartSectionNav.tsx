"use client";

import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { segment: "", label: "Summary" },
  { segment: "conditions", label: "Conditions" },
  { segment: "encounters", label: "Encounters" },
  { segment: "observations", label: "Observations" },
  { segment: "medications", label: "Medications" },
] as const;

// Sections are separate routes, so this is navigation (links with aria-current), not ARIA tabs.
export function ChartSectionNav({ patientId }: { patientId: string }) {
  const pathname = usePathname();
  const base = `/patients/${patientId}`;
  return (
    <Box
      component="nav"
      aria-label="Patient chart sections"
      sx={{ borderBottom: 1, borderColor: "divider", mb: 2, overflowX: "auto" }}
    >
      <Box
        component="ul"
        sx={{ display: "flex", gap: 3, listStyle: "none", m: 0, p: 0 }}
      >
        {SECTIONS.map(({ segment, label }) => {
          const href = segment ? `${base}/${segment}` : base;
          const active = pathname === href;
          return (
            <Box component="li" key={label} sx={{ flexShrink: 0 }}>
              <MuiLink
                component={NextLink}
                href={href}
                aria-current={active ? "page" : undefined}
                underline="none"
                sx={{
                  display: "block",
                  py: 1.25,
                  fontWeight: 600,
                  color: active ? "primary.main" : "text.secondary",
                  borderBottom: 2,
                  borderColor: active ? "primary.main" : "transparent",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {label}
              </MuiLink>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
