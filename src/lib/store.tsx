import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AppData, Room, ProgrammeRoom } from "./types";
import { initialData } from "../data/initial";
import {
  LEGACY_KEY,
  STORAGE_KEY,
  normaliseData,
  upgradeLegacy,
} from "./migration";
export { validateData } from "./migration";
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
  savingBlocked: boolean;
  updateRoom: (
    id: string,
    patch: Pick<Room, "length" | "width" | "height">,
  ) => void;
  updateProgramme: (
    id: string,
    patch: Pick<
      ProgrammeRoom,
      "length" | "width" | "height" | "areaTarget" | "capacity"
    >,
  ) => void;
  revise: (description: string, change: (d: AppData) => AppData) => void;
  importData: (text: string) => void;
  clearError: () => void;
}
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current)
        return {
          data: normaliseData(JSON.parse(current)),
          safe: true,
          error: "",
        };
      const old = localStorage.getItem(LEGACY_KEY);
      return {
        data: old ? normaliseData(JSON.parse(old)) : upgradeLegacy(initialData),
        safe: true,
        error: "",
      };
    } catch {
      return {
        data: upgradeLegacy(initialData),
        safe: false,
        error:
          "Saved data could not be read. The original stored file has been left untouched. Import a valid backup to resume saving; do not clear browser storage.",
      };
    }
  });
  const [data, setData] = useState<AppData>(loaded.data);
  const [safe, setSafe] = useState(loaded.safe);
  const [error, setError] = useState(loaded.error);
  const [savingBlocked, setSavingBlocked] = useState(!loaded.safe);
  useEffect(() => {
    if (!safe) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavingBlocked(false);
    } catch {
      setSavingBlocked(true);
      setError(
        "Local saving failed, possibly due to attachment size. Export JSON immediately to retain your changes.",
      );
    }
  }, [data, safe]);
  const revise = (description: string, change: (d: AppData) => AppData) =>
    setData((old) => {
      const next = change(structuredClone(old));
      const number = Math.max(0, ...old.revisions.map((r) => r.number)) + 1;
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
      `Updated retained earlier-study dimensions — ${data.rooms.find((r) => r.id === id)?.name}`,
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
                  source: "Locally edited earlier-study reference data",
                  date: sourceDate(),
                  revision:
                    Math.max(0, ...d.revisions.map((r) => r.number)) + 1,
                },
              }
            : r,
        ),
      }),
    );
  const updateProgramme = (
    id: string,
    patch: Pick<
      ProgrammeRoom,
      "length" | "width" | "height" | "areaTarget" | "capacity"
    >,
  ) =>
    revise(
      `Updated current preliminary room — ${data.programme.find((r) => r.id === id)?.name}`,
      (d) => ({
        ...d,
        planRevision: d.planRevision + 1,
        programme: d.programme.map((r) =>
          r.id === id
            ? {
                ...r,
                ...patch,
                dimensionBasis: "owner-edited",
                evidence: {
                  ...r.evidence,
                  status: "Proposed",
                  source: "Owner-edited preliminary room data",
                  date: sourceDate(),
                  revision:
                    Math.max(0, ...d.revisions.map((r) => r.number)) + 1,
                },
              }
            : r,
        ),
      }),
    );
  const importData = (text: string) => {
    const incoming = normaliseData(JSON.parse(text));
    setData((old) => ({
      ...incoming,
      revisions: [
        ...old.revisions,
        ...incoming.revisions.filter(
          (r) => !old.revisions.some((o) => o.id === r.id),
        ),
        {
          id: crypto.randomUUID(),
          number:
            Math.max(
              0,
              ...old.revisions.map((r) => r.number),
              ...incoming.revisions.map((r) => r.number),
            ) + 1,
          date: new Date().toISOString(),
          description:
            "Imported project data; version 1 files are upgraded without deleting their earlier study.",
        },
      ],
    }));
    setSafe(true);
    setError("");
  };
  return (
    <Context.Provider
      value={{
        data,
        error,
        savingBlocked,
        updateRoom,
        updateProgramme,
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
export function sourceDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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
