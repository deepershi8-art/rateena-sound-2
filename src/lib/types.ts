export type Status =
  "Proposed" | "Calculated" | "Simulated" | "Measured" | "Verified";
export interface Evidence {
  status: Status;
  source: string;
  method: string;
  assumptions: string;
  date: string;
  revision: number;
  discipline: string;
  validation: string;
}
export interface TechnicalValue {
  value: number | string;
  unit: string;
  evidence: Evidence;
}
export interface Point {
  x: number;
  y: number;
}
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  layerId: string;
}
export interface RoomPolygon {
  roomId: string;
  vertices: Point[];
  angles: number[];
  finishedHeight: number;
  approved: boolean;
}
export interface Opening {
  id: string;
  wallId: string;
  offset: number;
  width: number;
  type: "door" | "acoustic-door" | "window";
  layerId: string;
}
export interface SoundLock {
  id: string;
  polygon: Point[];
  doorIds: string[];
}
export interface RouteLine {
  id: string;
  points: Point[];
  kind: "sightline" | "circulation";
  layerId: string;
}
export interface Dimension {
  id: string;
  start: Point;
  end: Point;
  offset: number;
  layerId: string;
}
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
}
export interface Geometry {
  units: "m";
  approval: "pending" | "approved";
  revision: number;
  walls: Wall[];
  polygons: RoomPolygon[];
  openings: Opening[];
  soundLocks: SoundLock[];
  routes: RouteLine[];
  dimensions: Dimension[];
  layers: Layer[];
}
export interface Room {
  id: string;
  name: string;
  use: string;
  length: number;
  width: number;
  height: number;
  capacity?: string;
  evidence: Evidence;
}
export interface Project {
  id: string;
  name: string;
  facilityIds: string[];
}
export interface Facility {
  id: string;
  name: string;
  phase: 1 | 2;
  state: "active" | "future";
}
export interface Reference {
  id: string;
  name: string;
  scope: string;
  url?: string;
}
export interface DesignTarget {
  id: string;
  name: string;
  target: TechnicalValue;
}
export interface Verification {
  id: string;
  title: string;
  stage: "Pending" | "In review";
  note: string;
}
export interface Decision {
  id: string;
  text: string;
  date: string;
  roomId?: string;
}
export interface Revision {
  id: string;
  number: number;
  date: string;
  description: string;
}
export interface AppData {
  schemaVersion: 1;
  projects: Project[];
  facilities: Facility[];
  rooms: Room[];
  geometry: Geometry;
  references: Reference[];
  targets: DesignTarget[];
  verification: Verification[];
  verificationResults: TechnicalValue[];
  decisions: Decision[];
  revisions: Revision[];
}
