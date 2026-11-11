import type { AppData, LegacyData } from "./types";
import { validateLegacy } from "./legacyValidation";
import {
  preliminaryProgramme,
  additionalReferences,
  GENERIC_CAPACITY,
  LIVE_PROGRAMME_CAPACITY,
} from "../data/programme";
export const LEGACY_KEY = "rateena-sound-2:v1";
export const STORAGE_KEY = "rateena-sound-2:v2";
export function upgradeLegacy(old: LegacyData, record = false): AppData {
  validateLegacy(old);
  const d = structuredClone(old);
  return {
    ...d,
    schemaVersion: 2,
    programme: structuredClone(preliminaryProgramme),
    resources: [],
    notes: {},
    planRevision: 0,
    planPreferences: {
      grid: false,
      furniture: true,
      instruments: true,
      doors: true,
      dimensions: true,
      labels: true,
      walls: true,
    },
    references: [
      ...d.references,
      ...additionalReferences.filter(
        (r) => !d.references.some((o) => o.id === r.id),
      ),
    ],
    revisions: record
      ? [
          ...d.revisions,
          {
            id: crypto.randomUUID(),
            number: Math.max(0, ...d.revisions.map((r) => r.number)) + 1,
            date: new Date().toISOString(),
            description:
              "Non-destructive upgrade: eight-room concept programme added; all earlier rooms, decisions and study records retained.",
          },
        ]
      : d.revisions,
  };
}
export function validateData(
  value: unknown,
): asserts value is LegacyData | AppData {
  const d = value as AppData | LegacyData;
  if (d?.schemaVersion === 1) {
    validateLegacy(d);
    return;
  }
  if (d?.schemaVersion !== 2) throw new Error("Unsupported project schema.");
  validateLegacy({ ...d, schemaVersion: 1 });
  if (
    !Array.isArray(d.programme) ||
    d.programme.length !== 8 ||
    preliminaryProgramme.some((r) => !d.programme.some((o) => o.id === r.id)) ||
    new Set(d.programme.map((r) => r.id)).size !== 8
  )
    throw new Error(
      "The current eight-room concept programme must be preserved.",
    );
  for (const r of d.programme)
    if (
      !r.evidence ||
      !["Proposed", "Calculated", "Simulated", "Measured", "Verified"].includes(
        r.evidence.status,
      ) ||
      typeof r.shortName !== "string" ||
      typeof r.capacity !== "string" ||
      !["concept", "area-derived", "owner-edited"].includes(r.dimensionBasis) ||
      typeof r.name !== "string" ||
      typeof r.purpose !== "string" ||
      [r.length, r.width, r.areaTarget].some(
        (v) =>
          typeof v !== "number" || !Number.isFinite(v) || v <= 0 || v > 10000,
      ) ||
      (r.height !== null && (!Number.isFinite(r.height) || r.height <= 0))
    )
      throw new Error("Invalid current programme dimensions.");
  if (
    !Array.isArray(d.resources) ||
    !d.notes ||
    !d.planPreferences ||
    typeof d.planRevision !== "number"
  )
    throw new Error("Missing current project fields.");
  if (
    d.resources.reduce((s, r) => s + r.size, 0) > 3000000 ||
    Object.values(d.planPreferences).some((v) => typeof v !== "boolean")
  )
    throw new Error("Invalid local resources or layer preferences.");
  const layers = [
    "grid",
    "furniture",
    "instruments",
    "doors",
    "dimensions",
    "labels",
    "walls",
  ];
  if (
    Object.keys(d.planPreferences).length !== layers.length ||
    layers.some(
      (k) =>
        typeof d.planPreferences[k as keyof typeof d.planPreferences] !==
        "boolean",
    )
  )
    throw new Error("The seven drawing layer preferences are required.");
  for (const r of d.resources)
    if (
      typeof r.name !== "string" ||
      !Number.isInteger(r.size) ||
      r.size < 0 ||
      !Number.isFinite(Date.parse(r.date)) ||
      !["Proposed", "Calculated", "Simulated", "Measured", "Verified"].includes(
        r.status,
      ) ||
      typeof r.mime !== "string" ||
      typeof r.dataUrl !== "string" ||
      !/^data:(image\/(png|jpeg|webp|gif)|application\/(pdf|json)|text\/plain);base64,/.test(
        r.dataUrl,
      ) ||
      r.size > 2000000
    )
      throw new Error("Invalid or unsupported local resource.");
  for (const n of Object.values(d.notes))
    if (
      typeof n.body !== "string" ||
      !Number.isFinite(Date.parse(n.date)) ||
      !["Proposed", "Calculated", "Simulated", "Measured", "Verified"].includes(
        n.status,
      )
    )
      throw new Error("Invalid study note.");
}
/** Owner, 11 Nov 2026: the live room targets up to 25 musicians. Only the
 * untouched earlier default is replaced; an owner-edited value is kept. */
const SUPERSEDED_CAPACITY = "12–15 musicians";
export const LIVE_ROOM_CAPACITY = "Up to 25 musicians (design target)";
function applyCapacityUpdate(data: AppData) {
  for (const r of data.rooms)
    if (r.id === "live" && r.capacity === SUPERSEDED_CAPACITY)
      r.capacity = LIVE_ROOM_CAPACITY;
  for (const r of data.programme)
    if (r.id === "live" && r.capacity === GENERIC_CAPACITY)
      r.capacity = LIVE_PROGRAMME_CAPACITY;
  return data;
}
export function normaliseData(value: unknown) {
  validateData(value);
  return applyCapacityUpdate(
    value.schemaVersion === 1
      ? upgradeLegacy(value, true)
      : structuredClone(value),
  );
}
