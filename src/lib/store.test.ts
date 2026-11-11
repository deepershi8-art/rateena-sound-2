import { describe, it, expect } from "vitest";
import { initialData } from "../data/initial";
import { validateData } from "./store";
import { roomMetrics } from "./geometry";
describe("Versioned engineering data", () => {
  it("preserves the exact room programme and total area", () => {
    expect(() => validateData(initialData)).not.toThrow();
    expect(initialData.rooms).toHaveLength(5);
    expect(
      initialData.rooms.reduce((a, r) => a + roomMetrics(r).area, 0),
    ).toBeCloseTo(179.54);
    expect(initialData.geometry.walls).toHaveLength(0);
    expect(initialData.geometry.polygons).toHaveLength(0);
  });
  it("rejects unknown schema versions and invalid room dimensions", () => {
    expect(() => validateData({ ...initialData, schemaVersion: 2 })).toThrow();
    const d = structuredClone(initialData);
    d.rooms[0].length = -1;
    expect(() => validateData(d)).toThrow();
  });
  it("rejects a fabricated plan or extra room", () => {
    const d = structuredClone(initialData);
    d.geometry.walls.push({
      id: "x",
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      thickness: 0.2,
      layerId: "walls",
    });
    expect(() => validateData(d)).toThrow();
    expect(() =>
      validateData({
        ...initialData,
        rooms: [...initialData.rooms, initialData.rooms[0]],
      }),
    ).toThrow();
  });
  it("has no fabricated measurement or operational record", () => {
    expect(initialData.verificationResults).toHaveLength(0);
    expect(initialData.decisions).toHaveLength(0);
    expect(initialData.revisions).toHaveLength(0);
    expect(
      initialData.targets.every((t) => t.target.evidence.status === "Proposed"),
    ).toBe(true);
  });
});
