import type { Point, Room } from "./types";
export const SOUND_SPEED = 343;
export function polygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  return (
    Math.abs(
      points.reduce((sum, p, i) => {
        const q = points[(i + 1) % points.length];
        return sum + p.x * q.y - q.x * p.y;
      }, 0),
    ) / 2
  );
}
/** Smaller angle between BA and BC in degrees. Reflex polygon angles need winding-aware processing. */
export function angleAt(a: Point, b: Point, c: Point): number {
  const u = { x: a.x - b.x, y: a.y - b.y },
    v = { x: c.x - b.x, y: c.y - b.y };
  const den = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  if (!den) throw new Error("Angle requires non-coincident points");
  return (
    (Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / den))) *
      180) /
    Math.PI
  );
}
export function wallAngle(a: Point, b: Point): number {
  if (a.x === b.x && a.y === b.y) throw new Error("Wall needs length");
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
export function roomMetrics(r: Pick<Room, "length" | "width" | "height">) {
  if ([r.length, r.width, r.height].some((v) => !Number.isFinite(v) || v <= 0))
    throw new Error("Dimensions must be positive finite numbers");
  return {
    area: r.length * r.width,
    volume: r.length * r.width * r.height,
    ratios: [1, r.width / r.height, r.length / r.height],
    modes: [
      { axis: "Length", d: r.length },
      { axis: "Width", d: r.width },
      { axis: "Height", d: r.height },
    ].map(({ axis, d }) => ({
      axis,
      hz: [1, 2, 3, 4].map((n) => (n * SOUND_SPEED) / (2 * d)),
    })),
  };
}
export const ratioSets = [
  { name: "Golden", w: 1.618, l: 2.618 },
  { name: "Sepmeyer A", w: 1.14, l: 1.39 },
  { name: "Sepmeyer B", w: 1.28, l: 1.54 },
  { name: "Sepmeyer C", w: 1.6, l: 2.33 },
];
