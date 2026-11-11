import { useState, useEffect } from "react";
import { ExternalLink, Check, Plus } from "lucide-react";
import type { Evidence, Room, Status } from "../lib/types";
import { useProject, cairoDate } from "../lib/store";
import { roomMetrics, ratioSets } from "../lib/geometry";
import { initialEvidence, qualifications } from "../data/initial";
export function Badge({ status = "Proposed" }: { status?: Status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}
export function EvidenceDetails({
  evidence,
  calculated = false,
}: {
  evidence: Evidence;
  calculated?: boolean;
}) {
  const e = calculated
    ? {
        ...evidence,
        status: "Calculated" as const,
        method:
          "A = L × W; V = L × W × H; H:W:L = 1:W/H:L/H; axial fₙ = n·343/(2D), n = 1…4",
        assumptions:
          evidence.assumptions +
          " c = 343 m/s assumed. Ideal rigid rectangular reference; no damping, tangential or oblique modes.",
        validation:
          "Approved finished polygon, temperature-dependent sound speed, source/receiver placement, simulation and measurement.",
      }
    : evidence;
  return (
    <details className="evidence">
      <summary>
        Evidence & calculation record <Badge status={e.status} />
      </summary>
      <dl>
        {Object.entries({
          Source: e.source,
          Method: e.method,
          Assumptions: e.assumptions,
          "Date / revision": `${e.date} / R${String(e.revision).padStart(3, "0")}`,
          Discipline: e.discipline,
          "Outstanding validation": e.validation,
        }).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
export function RoomStats({ room }: { room: Room }) {
  const m = roomMetrics(room);
  return (
    <>
      <div className="stats">
        <div>
          <small>NET FLOOR AREA</small>
          <strong>
            {m.area.toFixed(2)} <em>m²</em>
          </strong>
          <Badge status="Calculated" />
        </div>
        <div>
          <small>AIR VOLUME</small>
          <strong>
            {m.volume.toFixed(2)} <em>m³</em>
          </strong>
          <Badge status="Calculated" />
        </div>
        <div>
          <small>H : W : L</small>
          <strong className="ratio-value">
            1 : {m.ratios[1].toFixed(3)} : {m.ratios[2].toFixed(3)}
          </strong>
          <Badge status="Calculated" />
        </div>
      </div>
      <EvidenceDetails evidence={room.evidence} calculated />
    </>
  );
}
export function Modes({ room }: { room: Room }) {
  const m = roomMetrics(room);
  return (
    <div>
      <div className="inline-heading">
        <h3>Axial mode estimates</h3>
        <Badge status="Calculated" />
      </div>
      <p className="muted small">
        Rectangular-reference approximation only. f = n·c / 2D, assuming c = 343
        m/s. Not a prediction of the finished room response.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Axis / Hz</th>
              {[1, 2, 3, 4].map((n) => (
                <th key={n}>n = {n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.modes.map((a) => (
              <tr key={a.axis}>
                <th>{a.axis}</th>
                {a.hz.map((hz, i) => (
                  <td key={i}>{hz.toFixed(1)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EvidenceDetails evidence={room.evidence} calculated />
    </div>
  );
}
export function RoomEditor({ room }: { room: Room }) {
  const { updateRoom } = useProject();
  const [fields, setFields] = useState({
    length: String(room.length),
    width: String(room.width),
    height: String(room.height),
  });
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    setFields({
      length: String(room.length),
      width: String(room.width),
      height: String(room.height),
    });
  }, [room.length, room.width, room.height]);
  const valid = Object.values(fields).every(
    (v) =>
      v.trim() !== "" &&
      Number.isFinite(Number(v)) &&
      Number(v) > 0 &&
      Number(v) <= 200,
  );
  return (
    <form
      className="room-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) {
          updateRoom(room.id, {
            length: Number(fields.length),
            width: Number(fields.width),
            height: Number(fields.height),
          });
          setFeedback(
            "Preliminary dimensions saved. Dependent calculations updated.",
          );
        }
      }}
    >
      <div className="inline-heading">
        <h3>Clear internal dimensions</h3>
        <Badge status={room.evidence.status} />
      </div>
      <div className="dimension-fields">
        {(["length", "width", "height"] as const).map((key) => (
          <label key={key}>
            {key === "height" ? "Finished clear height" : key} <span>m</span>
            <input
              aria-label={`${room.name} ${key}`}
              type="number"
              min="0.01"
              max="200"
              step="any"
              value={fields[key]}
              onChange={(e) => {
                setFields({ ...fields, [key]: e.target.value });
                setFeedback("");
              }}
              required
            />
          </label>
        ))}
      </div>
      <button className="button gold-button" type="submit" disabled={!valid}>
        <Check size={14} />
        Save preliminary dimensions
      </button>
      {!valid && (
        <p className="error-text">
          Enter positive dimensions, no greater than 200 m.
        </p>
      )}
      <p role="status" className="small cyan">
        {feedback}
      </p>
      <p className="muted small">
        Reference envelope only. This does not create or approve a drawing.
      </p>
    </form>
  );
}
export function RoomProgramme() {
  const { data } = useProject();
  return (
    <div className="content-panel">
      <div className="section-kicker">FIVE ROOMS / ONE FACILITY</div>
      <h2>Room programme & capacity</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>L × W × H / m</th>
              <th>Net / m²</th>
              <th>Volume / m³</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.rooms.map((r) => (
              <tr key={r.id}>
                <th>
                  {r.name}
                  <small>{r.use}</small>
                </th>
                <td>
                  {r.length.toFixed(2)} × {r.width.toFixed(2)} ×{" "}
                  {r.height.toFixed(2)}
                </td>
                <td>{roomMetrics(r).area.toFixed(2)}</td>
                <td>{roomMetrics(r).volume.toFixed(2)}</td>
                <td>
                  <Badge />
                  <small>Area / volume: Calculated</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="total-line">
        Net primary-room area{" "}
        <strong>
          {data.rooms.reduce((a, r) => a + roomMetrics(r).area, 0).toFixed(2)}{" "}
          m²
        </strong>
        <Badge status="Calculated" />
      </p>
      <p>
        Main Live Room capacity: <b>{data.rooms[0].capacity}</b> <Badge />{" "}
        Occasional larger sessions may distribute musicians across connected
        isolation rooms.
      </p>
      <div className="notice">
        {qualifications.map((q) => (
          <p key={q}>{q}</p>
        ))}
      </div>
      <EvidenceDetails evidence={initialEvidence} />
      <EvidenceDetails evidence={initialEvidence} calculated />
    </div>
  );
}
export function GeometryAnalysis() {
  const { data } = useProject();
  const [id, setId] = useState(data.rooms[0].id);
  const room = data.rooms.find((r) => r.id === id)!;
  const [height, setHeight] = useState(4.58);
  const valid = Number.isFinite(height) && height > 0 && height <= 200;
  return (
    <div className="content-panel">
      <div className="section-kicker">CALCULATION WORKSPACE</div>
      <h2>Geometry is a hypothesis.</h2>
      <p className="intro-text">
        Compare proportions. Understand the limits. Validate the actual room.
      </p>
      <label className="select-label">
        Reference room
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {data.rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <RoomStats room={room} />
      <Modes room={room} />
      <details open className="tool-block">
        <summary>Compare rectangular reference proportions</summary>
        <p className="muted">
          Golden is a preliminary geometric hypothesis, not scientifically
          proven superior to Sepmeyer or Bolt. The initial live-room envelope
          was derived from a 12 m length using 1 : 1.618 : 2.618.
        </p>
        <label className="select-label">
          Comparison height / m
          <input
            type="number"
            min="0.01"
            max="200"
            step="any"
            value={height || ""}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        {valid ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>H : W : L</th>
                  <th>L × W × H / m</th>
                  <th>Area / m²</th>
                  <th>Volume / m³</th>
                </tr>
              </thead>
              <tbody>
                {ratioSets.map((s) => (
                  <tr key={s.name}>
                    <th>{s.name}</th>
                    <td>
                      1 : {s.w} : {s.l}
                    </td>
                    <td>
                      {(height * s.l).toFixed(2)} × {(height * s.w).toFixed(2)}{" "}
                      × {height.toFixed(2)}
                    </td>
                    <td>{(height * height * s.w * s.l).toFixed(2)}</td>
                    <td>{(height ** 3 * s.w * s.l).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p role="alert">Enter a valid positive comparison height.</p>
        )}
        <EvidenceDetails
          evidence={{
            ...initialEvidence,
            status: "Calculated",
            source:
              "Owner brief §9 (Golden); Sepmeyer 1965, DOI 10.1121/1.1909344; acoustic.ua published table (cross-checked 11 Nov 2026)",
            method:
              "H fixed by user; W = ratio × H; L = ratio × H; A = W × L; V = A × H",
            assumptions:
              "Candidate rectangular ratios H:W:L. Equal-height comparison is not equal volume or equal acoustic performance.",
            validation: "Full modal analysis, geometry and operational review.",
          }}
        />
      </details>
      <details className="tool-block" open>
        <summary>Bolt proportional region — illustrative only</summary>
        <div className="bolt-layout">
          <svg
            viewBox="0 0 460 270"
            role="img"
            aria-label="Simplified illustrative Bolt chart, not a compliance test"
          >
            <path d="M55 30V225H420" fill="none" stroke="#577181" />
            <path
              d="M85 204Q119 130 180 71L355 40Q324 114 246 160Z"
              fill="#31bcd9"
              fillOpacity=".09"
              stroke="#31bcd9"
              strokeDasharray="4 5"
            />
            {ratioSets.map((s, i) => (
              <g key={s.name}>
                <circle
                  cx={55 + (s.w - 1) * 220}
                  cy={225 - (s.l - 1) * 95}
                  r="4"
                  fill={i === 0 ? "#ceb781" : "#58b9e9"}
                />
                <text x={64 + (s.w - 1) * 220} y={220 - (s.l - 1) * 95}>
                  {s.name}
                </text>
              </g>
            ))}
            <text x="199" y="259">
              WIDTH / HEIGHT →
            </text>
            <text x="13" y="25">
              L / H
            </text>
          </svg>
          <div>
            <h3>A concept, not a pass/fail gate.</h3>
            <p>
              Approximation of the Bolt chart, hand-sketched for explanation.
              The shaded boundary is illustrative, not digitised from the
              original chart. No compliance result is calculated.
            </p>
            <p>
              Proportional regions help frame preliminary modal-distribution
              questions. Volume and the complete modal behaviour still matter.
            </p>
          </div>
        </div>
        <EvidenceDetails
          evidence={{
            ...initialEvidence,
            status: "Proposed",
            source: "R. H. Bolt, 1946, DOI 10.1121/1.1916349",
            method:
              "Illustrative sketch only. No analytical region or suitability check implemented.",
            assumptions:
              "Rectangular reference ratios; simplified qualitative region.",
            validation:
              "Source an accurate chart region before implementing a quantitative check.",
          }}
        />
      </details>
      <div className="notice">
        Non-parallel walls are not automatically better. No universal optimum
        wall angle is assumed. Irregular geometry requires true polygon areas
        and appropriate numerical acoustic modelling; do not apply rectangular
        modal equations uncritically.
      </div>
    </div>
  );
}
export function References() {
  const { data } = useProject();
  return (
    <div className="reference-list">
      {data.references.map((r) => (
        <div className="reference-item" key={r.id}>
          <h3>
            {r.name}
            {r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${r.name} source`}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </h3>
          <p>{r.scope}</p>
        </div>
      ))}
      <p className="muted small">
        Names and scopes only. No clauses, conformance claims or measurement
        results are asserted. Confirm current editions and project applicability
        with the responsible consultant.
      </p>
    </div>
  );
}
export function Targets() {
  const { data } = useProject();
  return (
    <div className="targets">
      {data.targets.map((t) => (
        <div className="target-item" key={t.id}>
          <div className="inline-heading">
            <h3>{t.name}</h3>
            <Badge status={t.target.evidence.status} />
          </div>
          <p>{t.target.value}</p>
          <EvidenceDetails evidence={t.target.evidence} />
        </div>
      ))}
    </div>
  );
}
export function Verification() {
  const { data, revise } = useProject();
  return (
    <div>
      <h3>Pending validation register</h3>
      <p className="muted small">
        Tracking review status does not create a measured or verified result.
      </p>
      {data.verification.map((v) => (
        <div className="verification-item" key={v.id}>
          <label>
            {v.title}
            <select
              aria-label={`${v.title} status`}
              value={v.stage}
              onChange={(e) =>
                revise(
                  `Verification review status changed: ${v.title}`,
                  (d) => ({
                    ...d,
                    verification: d.verification.map((i) =>
                      i.id === v.id
                        ? {
                            ...i,
                            stage: e.target.value as "Pending" | "In review",
                          }
                        : i,
                    ),
                  }),
                )
              }
            >
              <option>Pending</option>
              <option>In review</option>
            </select>
          </label>
          <VerificationNote id={v.id} initial={v.note} />
        </div>
      ))}
      <div className="empty-inline">
        No measurement or verification results recorded.
      </div>
    </div>
  );
}
function VerificationNote({ id, initial }: { id: string; initial: string }) {
  const { revise } = useProject();
  const [note, setNote] = useState(initial);
  return (
    <div className="note-row">
      <input
        aria-label="Validation note"
        placeholder="Add a validation note…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        disabled={note === initial}
        onClick={() =>
          revise("Updated validation note", (d) => ({
            ...d,
            verification: d.verification.map((i) =>
              i.id === id ? { ...i, note } : i,
            ),
          }))
        }
      >
        Save note
      </button>
    </div>
  );
}
export function Decisions() {
  const { data, revise } = useProject();
  const [text, setText] = useState("");
  return (
    <div className="content-panel">
      <div className="section-kicker">AUDIT TRAIL</div>
      <h2>Decisions & revisions</h2>
      <form
        className="decision-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) {
            revise("Recorded a design decision", (d) => ({
              ...d,
              decisions: [
                ...d.decisions,
                {
                  id: crypto.randomUUID(),
                  text: text.trim(),
                  date: new Date().toISOString(),
                },
              ],
            }));
            setText("");
          }
        }}
      >
        <label>
          Record design rationale
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the decision, alternatives and why…"
            required
          />
        </label>
        <button className="button gold-button" disabled={!text.trim()}>
          <Plus size={15} />
          Record decision
        </button>
      </form>
      <h3>Design decisions</h3>
      {!data.decisions.length ? (
        <div className="empty-inline">
          No decisions recorded. Preliminary geometry is not approved.
        </div>
      ) : (
        [...data.decisions].reverse().map((d) => (
          <div className="log-item" key={d.id}>
            <small>{cairoDate(d.date)}</small>
            <p>{d.text}</p>
          </div>
        ))
      )}
      <h3>Revision history</h3>
      {!data.revisions.length ? (
        <div className="empty-inline">No local changes yet. Baseline R000.</div>
      ) : (
        [...data.revisions].reverse().map((r) => (
          <div className="log-item" key={r.id}>
            <small>
              R{String(r.number).padStart(3, "0")} · {cairoDate(r.date)}
            </small>
            <p>{r.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
