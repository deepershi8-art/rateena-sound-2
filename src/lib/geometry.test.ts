import { describe, it, expect } from "vitest";
import { polygonArea, angleAt, wallAngle, roomMetrics } from "./geometry";
describe("Metric geometry", () => {
  it("calculates shoelace area in either winding", () => {
    const p = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 3 },
      { x: 0, y: 3 },
    ];
    expect(polygonArea(p)).toBe(12);
    expect(polygonArea(p.reverse())).toBe(12);
  });
  it("handles concave polygons and empty shapes", () => {
    expect(
      polygonArea([
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 1 },
        { x: 4, y: 3 },
        { x: 0, y: 3 },
      ]),
    ).toBe(9);
    expect(polygonArea([])).toBe(0);
  });
  it("calculates angles and rejects degenerate vectors", () => {
    expect(angleAt({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 })).toBe(90);
    expect(angleAt({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(
      45,
    );
    expect(() =>
      angleAt({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }),
    ).toThrow();
    expect(wallAngle({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(90);
  });
  it("recalculates area, volume, normalised dimensions and axial modes", () => {
    const m = roomMetrics({ length: 12, width: 7.42, height: 4.58 });
    expect(m.area).toBeCloseTo(89.04);
    expect(m.volume).toBeCloseTo(407.8032);
    expect(m.modes[0].hz[0]).toBeCloseTo(14.2916667);
    expect(m.ratios[2]).toBeCloseTo(12 / 4.58);
    expect(
      roomMetrics({ length: 6, width: 7.42, height: 4.58 }).modes[0].hz[0],
    ).toBeCloseTo(m.modes[0].hz[0] * 2);
    expect(() => roomMetrics({ length: 0, width: 1, height: 1 })).toThrow();
  });
});
