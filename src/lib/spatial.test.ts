import { describe, it, expect } from "vitest";
import { preliminaryProgramme } from "../data/programme";
import { spatialStudy, typicalObjects, objectFit, WALL_ZONE } from "./spatial";
import { normaliseData, upgradeLegacy, validateData } from "./migration";
import { initialData } from "../data/initial";
describe("Progressive programme and physical geometry", () => {
  it("retains all legacy records and edited dimensions during schema upgrade", () => {
    const old = structuredClone(initialData);
    old.rooms[0].length = 11.23;
    old.decisions.push({
      id: "kept",
      text: "Owner decision",
      date: "2026-11-11T10:00:00Z",
      roomId: "live",
    });
    old.revisions.push({
      id: "r",
      number: 7,
      date: "2026-11-11T10:00:00Z",
      description: "Keep history",
    });
    const d = normaliseData(old);
    expect(d.schemaVersion).toBe(2);
    expect(d.rooms).toEqual(old.rooms);
    expect(d.decisions).toEqual(old.decisions);
    expect(d.revisions[0]).toEqual(old.revisions[0]);
    expect(d.revisions.at(-1)?.number).toBe(8);
    expect(d.programme).toHaveLength(8);
    expect(old.schemaVersion).toBe(1);
  });
  it("round-trips schema 2 without another migration or loss", () => {
    const d = upgradeLegacy(initialData);
    expect(normaliseData(JSON.parse(JSON.stringify(d)))).toEqual(d);
    expect(() => validateData(d)).not.toThrow();
  });
  it("preserves the exact area targets while exposing rounded dimensional differences", () => {
    expect(preliminaryProgramme.reduce((s, r) => s + r.areaTarget, 0)).toBe(
      245.5,
    );
    const rooms = spatialStudy(preliminaryProgramme).rooms;
    expect(
      rooms.find((r) => r.id === "live")!.w *
        rooms.find((r) => r.id === "live")!.d,
    ).toBeCloseTo(99.96);
    expect(
      rooms.find((r) => r.id === "bass")!.w *
        rooms.find((r) => r.id === "bass")!.d,
    ).toBe(7.5);
    expect(
      rooms.find((r) => r.id === "lounge")!.w *
        rooms.find((r) => r.id === "lounge")!.d,
    ).toBeCloseTo(70.2);
    expect(
      preliminaryProgramme.find((r) => r.id === "vocal")!.height,
    ).toBeNull();
  });
  it("uses metre envelopes without overlapping clear rooms", () => {
    const s = spatialStudy(preliminaryProgramme);
    expect(WALL_ZONE).toBe(0.3);
    for (let i = 0; i < s.rooms.length; i++)
      for (let j = i + 1; j < s.rooms.length; j++) {
        const a = s.rooms[i],
          b = s.rooms[j];
        expect(
          a.x + a.w <= b.x ||
            b.x + b.w <= a.x ||
            a.y + a.d <= b.y ||
            b.y + b.d <= a.y,
        ).toBe(true);
      }
  });
  it("fits unscaled typical objects and keeps the piano at concert-grand dimensions", () => {
    const s = spatialStudy(preliminaryProgramme);
    const objects = typicalObjects(s.rooms);
    expect(objectFit(s.rooms, objects)).toEqual([]);
    expect(objects.find((o) => o.id === "grand")).toMatchObject({
      w: 1.57,
      d: 2.74,
      roomId: "live",
    });
    expect(objects.find((o) => o.id === "console")).toMatchObject({
      w: 2.2,
      d: 1,
    });
    expect(objects.find((o) => o.id === "engineer")).toMatchObject({
      w: 0.65,
      d: 0.65,
    });
  });
  it("flags real fit problems rather than shrinking the reference object", () => {
    const p = structuredClone(preliminaryProgramme);
    p[0].length = 2;
    const s = spatialStudy(p);
    expect(objectFit(s.rooms, typicalObjects(s.rooms)).length).toBeGreaterThan(
      0,
    );
    expect(typicalObjects(s.rooms).find((o) => o.id === "grand")!.d).toBe(2.74);
  });
  it("rejects invalid local attachments and missing room programme", () => {
    const d = upgradeLegacy(initialData);
    d.programme.pop();
    expect(() => validateData(d)).toThrow();
    const p = upgradeLegacy(initialData);
    p.resources.push({
      id: "bad",
      name: "bad",
      mime: "text/html",
      dataUrl: "data:text/html;base64,xxx",
      roomId: null,
      kind: "document",
      size: 3,
      date: new Date().toISOString(),
      status: "Proposed",
    });
    expect(() => validateData(p)).toThrow();
  });
});
