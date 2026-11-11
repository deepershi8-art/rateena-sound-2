import { describe, it, expect } from "vitest";
import {
  analyseAxialModes,
  axialMode,
  pressureNodes,
  wavelength,
} from "./modes";
describe("Axial mode calculation (rectangular-room approximation)", () => {
  it("uses f = n·c / 2D with c = 343 m/s", () => {
    expect(axialMode(12, 1)).toBeCloseTo(14.2917, 4);
    expect(axialMode(8.33, 2)).toBeCloseTo(41.1765, 3);
    expect(axialMode(4.5, 1)).toBeCloseTo(38.1111, 4);
    expect(() => axialMode(0, 1)).toThrow();
  });
  it("flags the clustering in the 12.00 × 8.33 × 4.50 m live room honestly", () => {
    const a = analyseAxialModes({ L: 12, W: 8.33, H: 4.5 });
    expect(a.modes).toHaveLength(12);
    expect(a.coincidentPairs).toBe(0);
    expect(a.clusteredPairs).toBe(1); // L3 42.9 Hz vs W2 41.2 Hz
    expect(a.quality).toBe("Some clustering");
    expect(
      a.modes
        .filter((m) => m.flag)
        .map((m) => `${m.axis}${m.n}`)
        .sort(),
    ).toEqual(["L3", "W2"]);
    expect(a.ratio[1]).toBeCloseTo(1.851, 3);
    expect(a.ratio[2]).toBeCloseTo(2.667, 3);
  });
  it("detects coincident modes in a cube and in doubled dimensions", () => {
    expect(analyseAxialModes({ L: 5, W: 5, H: 5 }).quality).toBe(
      "Coincident modes",
    );
    expect(
      analyseAxialModes({ L: 12, W: 6, H: 4.5 }).coincidentPairs,
    ).toBeGreaterThan(0);
  });
  it("places pressure nodes between antinodes at the walls", () => {
    expect(pressureNodes(1)).toEqual([0.5]);
    expect(pressureNodes(2)).toEqual([0.25, 0.75]);
    expect(wavelength(41.2)).toBeCloseTo(8.325, 3);
  });
});
