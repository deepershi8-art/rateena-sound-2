import type { ReactNode } from "react";
// Language boundary retained for future integration. Arabic UI was deferred by the owner.
const english = {
  home: "Workspace",
  management: "Project Management",
  studyKnowledge: "RATEENA SOUND",
  underConstruction: "Under Construction",
  knowledge: "Knowledge",
  technicalStudy: "Technical Study",
  export: "Export JSON",
  import: "Import JSON",
  report: "Export report",
  local: "Saved on this device",
  back: "Back to workspace",
  active: "Active priority",
  phaseOne: "Phase One",
  phaseTwo: "Phase Two",
  future: "Future facility",
  open: "Open Flagship Studio",
  explore: "View future structure",
};
export function LanguageProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export function useI18n() {
  return { t: (key: keyof typeof english) => english[key] };
}
