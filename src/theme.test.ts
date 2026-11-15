import { getContrastRatio } from "@mui/material/styles";

import { theme } from "./theme";

// jest-axe can't measure colour contrast in jsdom (no rendering), so the palette is checked here.
const { palette } = theme;
const surfaces = {
  paper: palette.background.paper,
  background: palette.background.default,
};

describe("theme colour contrast (WCAG AA, 4.5:1 for normal text)", () => {
  it.each([
    ["primary text", palette.text.primary],
    ["secondary text", palette.text.secondary],
    ["primary (links, active nav)", palette.primary.main],
    ["success (Active chips)", palette.success.main],
    ["info (Planned / Upcoming chips)", palette.info.main],
    ["error (alerts)", palette.error.main],
  ])("%s on paper and background", (_name, color) => {
    expect(getContrastRatio(color, surfaces.paper)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(color, surfaces.background)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("white text on the primary colour (buttons)", () => {
    expect(
      getContrastRatio(palette.primary.contrastText, palette.primary.main),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
