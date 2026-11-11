import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AppData, Room } from "./types";
import { initialData } from "../data/initial";
const KEY = "rateena-sound-2:v1";
export function validateData(value: unknown): asserts value is AppData {
  const d = value as AppData;
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
export function download(
  name: string,
  content: string,
  type = "application/json",
) {
  const u = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
interface Store {
  data: AppData;
  error: string;
  updateRoom: (
    id: string,
    patch: Pick<Room, "length" | "width" | "height">,
  ) => void;
  revise: (description: string, change: (d: AppData) => AppData) => void;
  importData: (text: string) => void;
  clearError: () => void;
}
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [error, setError] = useState("");
  const [data, setData] = useState<AppData>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(initialData);
      const d: unknown = JSON.parse(raw);
      validateData(d);
      return d;
    } catch {
      return structuredClone(initialData);
    }
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) validateData(JSON.parse(raw));
    } catch {
      setError(
        "Saved data could not be read. A clean preliminary programme was loaded. Export a backup before continuing.",
      );
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      setError("Local saving failed. Export JSON to retain your changes.");
    }
  }, [data]);
  const revise = (description: string, change: (d: AppData) => AppData) =>
    setData((old) => {
      const next = change(structuredClone(old));
      const number = (old.revisions.at(-1)?.number ?? 0) + 1;
      return {
        ...next,
        revisions: [
          ...next.revisions,
          {
            id: crypto.randomUUID(),
            number,
            date: new Date().toISOString(),
            description,
          },
        ],
      };
    });
  const updateRoom = (
    id: string,
    patch: Pick<Room, "length" | "width" | "height">,
  ) =>
    revise(
      `Updated preliminary dimensions — ${data.rooms.find((r) => r.id === id)?.name}`,
      (d) => ({
        ...d,
        rooms: d.rooms.map((r) =>
          r.id === id
            ? {
                ...r,
                ...patch,
                evidence: {
                  ...r.evidence,
                  status: "Proposed",
                  source: "Locally edited preliminary room data",
                  date: new Date().toISOString().slice(0, 10),
                  revision: (d.revisions.at(-1)?.number ?? 0) + 1,
                },
              }
            : r,
        ),
      }),
    );
  const importData = (text: string) => {
    const incoming: unknown = JSON.parse(text);
    validateData(incoming);
    setData((old) => {
      const number =
        Math.max(
          old.revisions.at(-1)?.number ?? 0,
          incoming.revisions.at(-1)?.number ?? 0,
        ) + 1;
      return {
        ...incoming,
        revisions: [
          ...old.revisions,
          ...incoming.revisions.filter(
            (r) => !old.revisions.some((o) => o.id === r.id),
          ),
          {
            id: crypto.randomUUID(),
            number,
            date: new Date().toISOString(),
            description: "Imported version 1 project data",
          },
        ],
      };
    });
  };
  return (
    <Context.Provider
      value={{
        data,
        error,
        updateRoom,
        revise,
        importData,
        clearError: () => setError(""),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProject() {
  const c = useContext(Context);
  if (!c) throw new Error("Missing Provider");
  return c;
}
export function cairoDate(iso: string) {
  return (
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso)) + " Cairo"
  );
}
