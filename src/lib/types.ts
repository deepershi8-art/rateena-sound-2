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
export interface LegacyData {
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

export interface ProgrammeRoom {
  id: string;
  name: string;
  shortName: string;
  purpose: string;
  areaTarget: number;
  length: number;
  width: number;
  height: number | null;
  dimensionBasis: "concept" | "area-derived" | "owner-edited";
  capacity: string;
  evidence: Evidence;
}
export interface ProjectResource {
  id: string;
  roomId: string | null;
  kind: "image" | "diagram" | "specification" | "document";
  name: string;
  mime: string;
  dataUrl: string;
  size: number;
  date: string;
  status: Status;
}
export interface StudyNote {
  body: string;
  status: Status;
  date: string;
}
export interface PlanPreferences {
  grid: boolean;
  furniture: boolean;
  instruments: boolean;
  doors: boolean;
  dimensions: boolean;
  labels: boolean;
  walls: boolean;
}
export interface AppData extends Omit<LegacyData, "schemaVersion"> {
  schemaVersion: 2;
  programme: ProgrammeRoom[];
  resources: ProjectResource[];
  notes: Record<string, StudyNote>;
  planRevision: number;
  planPreferences: PlanPreferences;
}
