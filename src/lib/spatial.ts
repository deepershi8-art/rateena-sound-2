import type { ProgrammeRoom } from "./types";
export const WALL_ZONE = 0.3; // Proposed reference zone only, not an engineered assembly.
export interface SpatialRoom {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  room: ProgrammeRoom;
}
export interface TypicalObject {
  id: string;
  roomId: string;
  x: number;
  y: number;
  w: number;
  d: number;
  type:
    | "piano"
    | "riser"
    | "drums"
    | "bass"
    | "chair"
    | "console"
    | "sofa"
    | "rack"
    | "person";
  label: string;
  layer: "instruments" | "furniture";
}
export function spatialStudy(rooms: ProgrammeRoom[]) {
  const get = (id: string) => {
    const r = rooms.find((r) => r.id === id);
    if (!r) throw new Error(`Missing programme room: ${id}`);
    return r;
  };
  const live = get("live"),
    eq = get("equipment"),
    p = get("percussion"),
    c = get("control"),
    b = get("bass"),
    v = get("vocal"),
    s = get("storage"),
    l = get("lounge");
  const w = WALL_ZONE,
    px = w + eq.length + w,
    cx = px + p.length + w,
    bx = cx + c.length + w,
    sx = bx + Math.max(b.length, v.length) + 2 * w + 1.2;
  const centre = (px + bx + Math.max(b.length, v.length)) / 2,
    liveX = centre - live.length / 2,
    top = w,
    mid = top + live.width + w;
  const midDepth = Math.max(
      5.85,
      eq.width,
      p.width,
      c.width,
      b.width + w + v.width,
      s.width,
    ),
    loungeY = mid + midDepth + 2 * w + 1.2;
  const place = (r: ProgrammeRoom, x: number, y: number): SpatialRoom => ({
    id: r.id,
    x,
    y,
    w: r.length,
    d: r.width,
    room: r,
  });
  const placed = [
    place(live, liveX, top),
    place(eq, w, mid),
    place(p, px, mid),
    place(c, cx, mid),
    place(b, bx, mid),
    place(v, bx, mid + b.width + w),
    place(s, sx, mid),
    place(l, centre - l.length / 2, loungeY),
  ];
  return {
    rooms: placed,
    width: Math.max(...placed.map((r) => r.x + r.w)) + w,
    height: Math.max(...placed.map((r) => r.y + r.d)) + w,
    wall: w,
  };
}
export function typicalObjects(rooms: SpatialRoom[]): TypicalObject[] {
  const o: TypicalObject[] = [];
  const add = (
    id: string,
    roomId: string,
    x: number,
    y: number,
    w: number,
    d: number,
    type: TypicalObject["type"],
    label: string,
    layer: TypicalObject["layer"],
  ) => {
    const r = rooms.find((r) => r.id === roomId)!;
    o.push({ id, roomId, x: r.x + x, y: r.y + y, w, d, type, label, layer });
  };
  add(
    "grand",
    "live",
    1,
    2,
    1.57,
    2.74,
    "piano",
    "Concert grand 2.74 × 1.57 m",
    "instruments",
  );
  add(
    "live-riser",
    "live",
    7,
    3.7,
    2.4,
    2.4,
    "riser",
    "Drum riser 2.4 × 2.4 m",
    "instruments",
  );
  add(
    "live-kit",
    "live",
    7.3,
    4.15,
    1.8,
    1.5,
    "drums",
    "Drum kit footprint 1.8 × 1.5 m",
    "instruments",
  );
  add(
    "live-bass",
    "live",
    10,
    2.8,
    1,
    1,
    "bass",
    "Double-bass player 1 × 1 m; instrument approx. 1.9 m tall",
    "instruments",
  );
  for (let i = 0; i < 4; i++)
    add(
      `player-${i}`,
      "live",
      4 + (i % 2) * 1.3,
      2.8 + Math.floor(i / 2) * 1.4,
      0.8,
      0.8,
      "person",
      "Musician chair space 0.8 × 0.8 m",
      "furniture",
    );
  add(
    "booth-riser",
    "percussion",
    0.8,
    1.2,
    2.4,
    2.4,
    "riser",
    "Drum riser 2.4 × 2.4 m",
    "instruments",
  );
  add(
    "booth-kit",
    "percussion",
    1.1,
    1.65,
    1.8,
    1.5,
    "drums",
    "Drum kit footprint 1.8 × 1.5 m",
    "instruments",
  );
  add(
    "bass-player",
    "bass",
    1,
    1.1,
    1,
    1,
    "bass",
    "Player footprint 1 × 1 m, not instrument height",
    "instruments",
  );
  add(
    "vocal-space",
    "vocal",
    1.1,
    1.1,
    0.8,
    0.8,
    "person",
    "Musician chair space 0.8 × 0.8 m",
    "furniture",
  );
  add(
    "console",
    "control",
    1.4,
    1.5,
    2.2,
    1,
    "console",
    "Console reference 2.2 × 1.0 m",
    "furniture",
  );
  add(
    "engineer",
    "control",
    2.175,
    2.85,
    0.65,
    0.65,
    "chair",
    "Engineer chair diameter 0.65 m",
    "furniture",
  );
  add(
    "rack-1",
    "equipment",
    0.2,
    1.2,
    0.6,
    1,
    "rack",
    "19-inch rack enclosure 0.6 × 1.0 m",
    "furniture",
  );
  add(
    "rack-2",
    "equipment",
    1.1,
    1.2,
    0.6,
    1,
    "rack",
    "19-inch rack enclosure 0.6 × 1.0 m",
    "furniture",
  );
  add(
    "sofa",
    "lounge",
    3.4,
    2.7,
    2.1,
    0.9,
    "sofa",
    "Three-seat sofa 2.1 × 0.9 m",
    "furniture",
  );
  return o;
}
export function objectFit(rooms: SpatialRoom[], objects: TypicalObject[]) {
  return objects
    .filter((o) => {
      const r = rooms.find((r) => r.id === o.roomId)!;
      return (
        o.x < r.x ||
        o.y < r.y ||
        o.x + o.w > r.x + r.w + 1e-8 ||
        o.y + o.d > r.y + r.d + 1e-8
      );
    })
    .map(
      (o) =>
        `${o.label} exceeds the current ${rooms.find((r) => r.id === o.roomId)!.room.name} reference envelope.`,
    );
}
