import { describe, expect, it } from "vitest";
import { createPlaybackSpectrum } from "./useAudioAnalyzer";

describe("visualizer playback spectrum", () => {
  it("produces a non-silent frame when live FFT data is unavailable", () => {
    const frame = createPlaybackSpectrum(12.25, 256);
    expect(frame).toHaveLength(256);
    expect(Math.max(...frame)).toBeGreaterThan(80);
  });

  it("changes bar energy as playback time advances", () => {
    const first = createPlaybackSpectrum(12.25, 256);
    const next = createPlaybackSpectrum(12.35, 256);
    expect(Array.from(next)).not.toEqual(Array.from(first));
  });
});
