import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, FolderOpen } from "lucide-react";
import { PlanWorkspace } from "./PlanWorkspace";
import {
  RoomProgramme,
  GeometryAnalysis,
  References,
  Targets,
  Verification,
  Decisions,
} from "./Engineering";
const sections = [
  [
    "architectural",
    "Architectural Proposal",
    "Metric workspace & room information",
  ],
  ["programme", "Room Program & Capacity", "Five preliminary room envelopes"],
  ["geometry", "Acoustic Geometry & Analysis", "Compare reference proportions"],
  [
    "isolation",
    "Sound Isolation Strategy",
    "Boundary and flanking-path strategy",
  ],
  [
    "treatment",
    "Acoustic Treatment Strategy",
    "Internal reflections and decay",
  ],
  ["hvac", "HVAC & Background Noise", "Quiet services and vibration control"],
  ["audio", "Audio Systems & Connectivity", "Future signal-flow coordination"],
  [
    "construction",
    "Construction Coordination",
    "Interfaces and engineering handovers",
  ],
  [
    "verification",
    "International References & Verification",
    "Scopes, targets and validation",
  ],
  ["decisions", "Design Decisions & Revision History", "Local design record"],
];
const strategies: Record<
  string,
  { title: string; intro: string; items: string[] }
> = {
  isolation: {
    title: "Sound Isolation Strategy",
    intro:
      "Control transmission between spaces — including paths that bypass the main wall.",
    items: [
      "Define source spectra and receiving-room needs before setting frequency-dependent isolation requirements.",
      "Develop mass, decoupling, damping and airtightness as a coordinated assembly.",
      "Review room-within-room feasibility, structural bridges, doors, seals, windows and service penetrations.",
      "Validate junctions and flanking paths; commission appropriate field tests. No achieved isolation rating is claimed.",
    ],
  },
  treatment: {
    title: "Acoustic Treatment Strategy",
    intro:
      "Control sound inside the room, without confusing treatment with isolation.",
    items: [
      "Develop room-specific, frequency-band decay targets. No numerical reverberation target is approved.",
      "Evaluate low-frequency control, early reflections, absorption and diffusion as a system.",
      "Assess repeatable variable-acoustic states for the Main Live Room.",
      "Treatment layout, quantities and simulation are future engineering deliverables.",
    ],
  },
  hvac: {
    title: "HVAC & Background Noise",
    intro:
      "Quiet services need acoustic and mechanical coordination from the beginning.",
    items: [
      "NC-15 is a Proposed aspiration only, not a measured or achieved result.",
      "Assess duct-borne noise, cross-talk, terminal noise, plant vibration and structural connections.",
      "Coordinate airflow and pressure loss with attenuation and vibration isolation.",
      "Confirm octave-band targets and commissioning methods with the services engineer and acoustician.",
    ],
  },
  audio: {
    title: "Audio Systems & Connectivity",
    intro:
      "Expandable coordination structure. No equipment package or signal-flow design has been invented.",
    items: [
      "Future integration: equipment schedules and signal-flow documentation.",
      "Future integration: analogue, digital and network patching records.",
      "Future integration: cable routes, power, earthing and service interfaces.",
      "Pending design: control-room monitoring, talkback and cross-room connectivity.",
    ],
  },
  construction: {
    title: "Construction Coordination",
    intro:
      "The acoustic design must become a coordinated, buildable set of details.",
    items: [
      "Pending: site survey, structural review and building services interfaces.",
      "Pending: finished clear dimensions and isolation shell allowances.",
      "Pending: fire safety, accessibility, circulation and door coordination.",
      "Future integration: formal document control, consultant reviews and approval workflows.",
    ],
  },
};
export function TechnicalStudy() {
  const { section = "architectural" } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<string | null>(null);
  const selected = sections.some((s) => s[0] === section)
    ? section
    : "architectural";
  const strategy = strategies[selected];
  return (
    <div className="study-layout">
      <aside className="study-index">
        <div className="rail-heading">
          <FolderOpen size={15} />
          TECHNICAL STUDY
        </div>
        <p className="muted small">A proposal with a traceable basis.</p>
        <nav aria-label="Technical study sections">
          {sections.map((s, i) => (
            <details
              key={s[0]}
              open={selected === s[0] && collapsed !== s[0]}
              className={selected === s[0] ? "selected" : ""}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setCollapsed(selected === s[0] && collapsed !== s[0] ? s[0] : null);
                  navigate(`/flagship/study/${s[0]}`);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{s[1]}</b>
                <ChevronDown size={12} />
              </summary>
              <p>{s[2]}</p>
            </details>
          ))}
        </nav>
        <div className="rail-foot">
          PRELIMINARY DESIGN
          <br />
          <span>Not for construction.</span>
        </div>
      </aside>
      <main className="study-content">
        {selected === "architectural" && <PlanWorkspace />}
        {selected === "programme" && <RoomProgramme />}
        {selected === "geometry" && <GeometryAnalysis />}
        {selected === "decisions" && <Decisions />}
        {selected === "verification" && (
          <div className="content-panel">
            <div className="section-kicker">EVIDENCE FRAMEWORK</div>
            <h2>References & verification</h2>
            <p className="intro-text">A target is not a result.</p>
            <Targets />
            <Verification />
            <h2>Reference library</h2>
            <References />
          </div>
        )}
        {strategy && (
          <div className="content-panel">
            <div className="section-kicker">DESIGN STRATEGY / PRELIMINARY</div>
            <h2>{strategy.title}</h2>
            <p className="intro-text">{strategy.intro}</p>
            <div className="strategy-list">
              {strategy.items.map((item, i) => (
                <div key={item}>
                  <span>0{i + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            {["hvac", "treatment", "isolation"].includes(selected) && (
              <Targets />
            )}
            <p className="notice">
              Engineering development is pending. No design performance has been
              simulated, measured or verified.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
