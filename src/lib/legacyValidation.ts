import type { LegacyData } from "./types";
import { initialData } from "../data/initial";
export function validateLegacy(value: unknown): asserts value is LegacyData {
  const d = value as LegacyData;
  if (
    !d ||
    d.schemaVersion !== 1 ||
    !Array.isArray(d.rooms) ||
    d.rooms.length !== 5 ||
    !d.geometry ||
    !Array.isArray(d.revisions) ||
    !Array.isArray(d.decisions) ||
    !Array.isArray(d.verification) ||
    !Array.isArray(d.references) ||
    !Array.isArray(d.targets) ||
    !Array.isArray(d.projects) ||
    !Array.isArray(d.facilities) ||
    !Array.isArray(d.verificationResults)
  )
    throw new Error("Invalid project file or unsupported schema version.");
  if (
    new Set(d.rooms.map((r) => r.id)).size !== 5 ||
    initialData.rooms.some((r) => !d.rooms.some((s) => r.id === s.id))
  )
    throw new Error("The five-room programme must be preserved.");
  for (const r of d.rooms) {
    if (
      [r.length, r.width, r.height].some(
        (v) =>
          typeof v !== "number" || !Number.isFinite(v) || v <= 0 || v > 200,
      ) ||
      typeof r.name !== "string" ||
      typeof r.use !== "string" ||
      !r.evidence ||
      !["Proposed", "Calculated", "Simulated", "Measured", "Verified"].includes(
        r.evidence.status,
      )
    )
      throw new Error("Invalid room dimensions or evidence.");
  }
  // This version deliberately cannot approve or import a final plan.
  if (
    d.geometry.approval !== "pending" ||
    [
      "walls",
      "polygons",
      "openings",
      "soundLocks",
      "routes",
      "dimensions",
    ].some(
      (k) =>
        !Array.isArray(d.geometry[k as keyof typeof d.geometry]) ||
        (d.geometry[k as keyof typeof d.geometry] as unknown[]).length !== 0,
    )
  )
    throw new Error(
      "Approved drawing import is a future integration. This version accepts only an empty, pending drawing.",
    );
  if (
    !Array.isArray(d.geometry.layers) ||
    d.geometry.layers.some(
      (l) => typeof l.id !== "string" || typeof l.visible !== "boolean",
    )
  )
    throw new Error("Invalid layers.");
  for (const t of d.targets)
    if (!t.target?.evidence || typeof t.name !== "string")
      throw new Error("Invalid design targets.");
  for (const v of d.verification)
    if (
      typeof v.id !== "string" ||
      typeof v.title !== "string" ||
      !["Pending", "In review"].includes(v.stage) ||
      typeof v.note !== "string"
    )
      throw new Error("Invalid verification items.");
  for (const v of d.decisions)
    if (typeof v.text !== "string" || typeof v.date !== "string")
      throw new Error("Invalid decision record.");
  for (const v of d.revisions)
    if (typeof v.description !== "string" || typeof v.number !== "number")
      throw new Error("Invalid revision history.");
}
