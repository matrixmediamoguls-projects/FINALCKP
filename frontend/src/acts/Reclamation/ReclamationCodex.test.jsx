import { describe, expect, it } from "vitest";
import { buildReactorBarHeights } from "./ReclamationCodex";

describe("Reclamation reactor bars", () => {
  it("maps individual spectrum bins to visibly different bar heights", () => {
    const quiet = new Uint8Array(256);
    const active = Uint8Array.from({ length: 256 }, (_, index) => (index % 7) * 36);
    const bands = { intensity: 50, bass: 50, mid: 50, treble: 50 };

    const quietBars = buildReactorBarHeights(quiet, bands);
    const activeBars = buildReactorBarHeights(active, bands);

    expect(activeBars).not.toEqual(quietBars);
    expect(Math.max(...activeBars) - Math.min(...activeBars)).toBeGreaterThan(30);
  });
});
