import { useNavigate, useParams } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { ConceptPlanWorkspace } from "./ConceptPlanWorkspace";
import { LegacyStudy, strategies as earlierStrategies } from "./LegacyStudy";
import {
  Badge,
  Targets,
  Verification,
  References,
  Decisions,
  RoomProgramme,
  GeometryAnalysis,
} from "./Engineering";
import { EditableNote, ResourceManager } from "./StudyFields";
import { IsolationAssemblyNotes } from "./IsolationModel";
import { useProject } from "../lib/store";
const sections = [
  [
    "isolation",
    "Studio-wide Isolation Architecture",
    "Integrated Room-in-Room / Box-in-Box isolation. Develop Mass–Decoupling–Damping, room-specific floating construction, airtightness, junctions and flanking control together. No universal spring floor or single isolated platform is specified.",
  ],
  [
    "hvac",
    "HVAC and Environmental Control",
    "NC-15 remains a Proposed aspiration only. Assess duct noise, cross-talk, terminal noise, plant vibration, airflow, pressure loss and environmental conditions with the services engineer and acoustician.",
  ],
  [
    "audio",
    "Electrical, Audio and Network Infrastructure",
    "Coordinate electrical distribution, earthing, audio wiring, patching, signal flow, data networks and lighting. Equipment schedules, routes and room interfaces are pending; no invented package is supplied.",
  ],
  [
    "construction",
    "Construction Coordination",
    "Pending site survey, structure, finished clear dimensions, isolation allowances, circulation, sound locks, fire safety, accessibility, door swings, services coordination and approval workflows.",
  ],
  [
    "equipment",
    "Equipment Planning",
    "Actual equipment schedules and requirements will be added later. Typical objects in the drawing are real-size fit references only; they are not procurement selections or capacity commitments.",
  ],
  [
    "verification",
    "Engineering References and Verification",
    "References have distinct scopes. Distinguish Proposed, Calculated, Simulated, Measured and Verified values; simulations, test methods, commissioning and supporting evidence remain to be entered.",
  ],
];
export function CurrentProgramme() {
  const { data } = useProject();
  return (
    <details className="tool-block">
      <summary>Current preliminary room programme / eight rooms</summary>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Target m²</th>
              <th>Clear envelope m</th>
              <th>Drawn m²</th>
              <th>Basis</th>
            </tr>
          </thead>
          <tbody>
            {data.programme.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.areaTarget}</td>
                <td>
                  {r.length.toFixed(2)} × {r.width.toFixed(2)}
                  {r.height !== null
                    ? ` × ${r.height.toFixed(2)} H`
                    : " · H pending"}
                </td>
                <td>{(r.length * r.width).toFixed(2)}</td>
                <td>
                  {r.dimensionBasis === "area-derived"
                    ? "Area-derived assumption"
                    : r.dimensionBasis === "concept"
                      ? "Concept — Proposed"
                      : "Owner edited — Proposed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="notice">
        Provisional net-area targets, not verified construction dimensions.
        Lounge & Services includes toilets and supporting facilities. Walls,
        cavities, circulation and services require additional gross area.
        Footprint TBD.
      </p>
    </details>
  );
}
export function TechnicalStudy() {
  const { section = "architectural" } = useParams();
  const navigate = useNavigate();
  const oldRoute = ["programme", "geometry", "treatment", "decisions"].includes(
    section,
  );
  return (
    <div className="study-layout updated-study-layout">
      <aside className="study-index">
        <div className="rail-heading">
          <FolderOpen size={15} />
          TECHNICAL STUDY
        </div>
        <p className="muted small">A proposal with a traceable basis.</p>
        <nav aria-label="Technical study sections">
          <button
            className={`study-plan-link ${section === "architectural" ? "selected" : ""}`}
            onClick={() => navigate("/flagship/study/architectural")}
          >
            <span>00</span>
            <b>Flagship Studio Floor Plan</b>
          </button>
          {sections.map(([id, name], i) => (
            <a
              key={id}
              className={section === id ? "selected" : ""}
              href={`#/flagship/study/${id}`}
              onClick={() =>
                setTimeout(
                  () =>
                    document
                      .getElementById(`study-${id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  60,
                )
              }
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{name}</b>
            </a>
          ))}
        </nav>
        <details className="retained-index">
          <summary>Earlier study / retained</summary>
          {[
            ["programme", "Earlier Room Program & Capacity"],
            ["geometry", "Acoustic Geometry & Analysis"],
            ["treatment", "Acoustic Treatment Strategy"],
            ["decisions", "Design Decisions & Revision History"],
          ].map(([id, name]) => (
            <button key={id} onClick={() => navigate(`/flagship/study/${id}`)}>
              {name}
            </button>
          ))}
        </details>
        <div className="rail-foot">
          PRELIMINARY DESIGN
          <br />
          <span>Not for construction.</span>
        </div>
      </aside>
      <main className="study-content">
        {oldRoute ? (
          <>
            <p className="notice">
              Preserved earlier study. These original reference rooms and
              calculations are not the current eight-room concept programme.{" "}
              <button
                className="text-button"
                onClick={() => navigate("/flagship/study/architectural")}
              >
                Return to current floor plan
              </button>
            </p>
            <LegacyStudy />
          </>
        ) : (
          <>
            <ConceptPlanWorkspace />
            <CurrentProgramme />
            <section className="progressive-study">
              <div className="section-kicker">
                AFTER THE PLAN / PROGRESSIVE TECHNICAL STUDY
              </div>
              <h2>Engineering development</h2>
              {sections.map(([id, name, intro], i) => (
                <details
                  key={id}
                  id={`study-${id}`}
                  className="tool-block study-section"
                  open={section === id}
                >
                  <summary>
                    <span className="study-section-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {name}
                    <Badge />
                  </summary>
                  <p className="intro-text">{intro}</p>
                  {id === "isolation" && <IsolationAssemblyNotes />}
                  {id === "verification" && (
                    <>
                      <Targets />
                      <Verification />
                      <References />
                    </>
                  )}
                  <div className="empty-inline">
                    Actual findings, specifications and coordinated diagrams —
                    pending.
                  </div>
                  <EditableNote
                    noteKey={`study:${id}`}
                    label={`${name} findings`}
                  />
                </details>
              ))}
              <ResourceManager />
              <details className="tool-block">
                <summary>
                  Preserved earlier study / original ten-section record
                </summary>
                <p>
                  Existing content is retained. Earlier five-room dimensions are
                  reference data, not an alternative current programme.
                </p>
                <RoomProgramme />
                <GeometryAnalysis />
                {Object.values(earlierStrategies).map((s) => (
                  <section key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.intro}</p>
                    <ul>
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
                <Targets />
                <Verification />
                <References />
                <Decisions />
              </details>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
