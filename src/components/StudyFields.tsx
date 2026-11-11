import { useState, useEffect } from "react";
import { Upload, Download, Check } from "lucide-react";
import { useProject, cairoDate, sourceDate } from "../lib/store";
import type { ProgrammeRoom, Status, ProjectResource } from "../lib/types";
import { Badge, EvidenceDetails } from "./Engineering";
import { conceptClarifications, conceptEvidence } from "../data/programme";
import conceptImage from "../assets/concept/flagship-concept-plan.webp";
const statuses: Status[] = [
  "Proposed",
  "Calculated",
  "Simulated",
  "Measured",
  "Verified",
];
export function ConceptReference({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={`concept-reference ${compact ? "compact" : ""}`}>
      <a href={conceptImage} target="_blank" rel="noreferrer">
        <img
          src={conceptImage}
          alt="Latest architectural concept — preliminary reference with unresolved dimensional conflicts"
        />
      </a>
      <figcaption>
        <b>Latest architectural concept – preliminary reference</b>
        <span>
          Owner-supplied concept; not a verified drawing. Open the image to
          inspect the original labels.
        </span>
      </figcaption>
    </figure>
  );
}
export function Clarifications() {
  return (
    <details className="tool-block concept-conflicts">
      <summary>Concept conflicts & drawing assumptions</summary>
      <ol>
        {conceptClarifications.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>
      <EvidenceDetails evidence={conceptEvidence} />
    </details>
  );
}
export function EditableNote({
  noteKey,
  label,
  placeholder = "Add the actual study finding, its source and outstanding checks…",
}: {
  noteKey: string;
  label: string;
  placeholder?: string;
}) {
  const { data, revise } = useProject();
  const initial = data.notes[noteKey];
  const [body, setBody] = useState(initial?.body ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "Proposed");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setBody(initial?.body ?? "");
    setStatus(initial?.status ?? "Proposed");
  }, [initial?.body, initial?.status, noteKey]);
  return (
    <form
      className="editable-note"
      onSubmit={(e) => {
        e.preventDefault();
        revise(`Updated study content: ${label}`, (d) => ({
          ...d,
          notes: {
            ...d.notes,
            [noteKey]: { body, status, date: new Date().toISOString() },
          },
        }));
        setSaved(true);
      }}
    >
      <label>
        {label}
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setSaved(false);
          }}
          placeholder={placeholder}
        />
      </label>
      <div className="note-actions">
        <select
          aria-label={`${label} evidence status`}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as Status);
            setSaved(false);
          }}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={
            body === (initial?.body ?? "") &&
            status === (initial?.status ?? "Proposed")
          }
        >
          <Check size={13} />
          Save content
        </button>
      </div>
      <p className="small muted">
        User-entered evidence status; selecting a label does not verify an
        engineering claim. Add the source, method and validation record in the
        note.
      </p>
      {saved && (
        <p className="cyan small" role="status">
          Saved locally with a revision.
        </p>
      )}
      {initial && (
        <small className="muted">Updated {cairoDate(initial.date)}</small>
      )}
    </form>
  );
}
export function ResourceManager({ roomId = null }: { roomId?: string | null }) {
  const { data, revise } = useProject();
  const [kind, setKind] = useState<ProjectResource["kind"]>("document");
  const [message, setMessage] = useState("");
  const entries = data.resources.filter((r) => r.roomId === roomId);
  return (
    <div className="resource-manager">
      <div className="inline-heading">
        <h3>Images, diagrams & documents</h3>
        <Badge />
      </div>
      <p className="small muted">
        Local project attachments; no backend upload. PNG/JPEG/WebP/GIF, PDF,
        TXT or JSON; 2 MB per file and 3 MB total. Export project JSON as your
        portable backup.
      </p>
      <div className="resource-controls">
        <select
          aria-label="Resource category"
          value={kind}
          onChange={(e) => setKind(e.target.value as ProjectResource["kind"])}
        >
          {["image", "diagram", "specification", "document"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <label className="upload-label">
          <Upload size={13} />
          Add file
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain,application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const mime =
                file.type ||
                (file.name.endsWith(".json")
                  ? "application/json"
                  : file.name.endsWith(".txt")
                    ? "text/plain"
                    : "");
              if (
                !/^(image\/(png|jpeg|webp|gif)|application\/(pdf|json)|text\/plain)$/.test(
                  mime,
                )
              ) {
                setMessage("Unsupported type. Use an image, PDF, TXT or JSON.");
                return;
              }
              if (
                file.size > 2000000 ||
                data.resources.reduce((sum, r) => sum + r.size, 0) + file.size >
                  3000000
              ) {
                setMessage("Attachment limit exceeded. Use a smaller file.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const url = String(reader.result).replace(
                  /^data:[^;]+;/,
                  `data:${mime};`,
                );
                revise(`Added local ${kind}: ${file.name}`, (d) => ({
                  ...d,
                  resources: [
                    ...d.resources,
                    {
                      id: crypto.randomUUID(),
                      roomId,
                      kind,
                      name: file.name,
                      mime,
                      dataUrl: url,
                      size: file.size,
                      date: new Date().toISOString(),
                      status: "Proposed",
                    },
                  ],
                }));
                setMessage("File added locally. Export JSON to back it up.");
              };
              reader.onerror = () => setMessage("The file could not be read.");
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>
      <p role="status" className="small cyan">
        {message}
      </p>
      {!entries.length && (
        <div className="empty-inline">
          No local attachments for this scope yet.
        </div>
      )}
      {entries.map((r) => (
        <div className="resource-item" key={r.id}>
          {r.mime.startsWith("image/") && <img src={r.dataUrl} alt={r.name} />}
          <div>
            <b>{r.name}</b>
            <small>
              {r.kind} · {(r.size / 1024).toFixed(0)} KB · {cairoDate(r.date)}
            </small>
            <Badge status={r.status} />
          </div>
          <a className="text-button" href={r.dataUrl} download={r.name}>
            <Download size={13} />
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
export function ProgrammeEditor({ room }: { room: ProgrammeRoom }) {
  const { updateProgramme } = useProject();
  const [f, setF] = useState({
    length: String(room.length),
    width: String(room.width),
    height: room.height === null ? "" : String(room.height),
    areaTarget: String(room.areaTarget),
    capacity: room.capacity,
  });
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    setF({
      length: String(room.length),
      width: String(room.width),
      height: room.height === null ? "" : String(room.height),
      areaTarget: String(room.areaTarget),
      capacity: room.capacity,
    });
  }, [
    room.id,
    room.length,
    room.width,
    room.height,
    room.areaTarget,
    room.capacity,
  ]);
  const valid =
    [f.length, f.width, f.areaTarget].every(
      (v) =>
        v.trim() &&
        Number.isFinite(Number(v)) &&
        Number(v) > 0 &&
        Number(v) < 10000,
    ) &&
    (f.height === "" ||
      (Number.isFinite(Number(f.height)) && Number(f.height) > 0));
  return (
    <>
      <form
        className="room-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          updateProgramme(room.id, {
            length: Number(f.length),
            width: Number(f.width),
            height: f.height === "" ? null : Number(f.height),
            areaTarget: Number(f.areaTarget),
            capacity: f.capacity,
          });
          setFeedback(
            "Saved. The true-scale drawing and derived areas updated.",
          );
        }}
      >
        <div className="inline-heading">
          <h3>Preliminary clear envelope</h3>
          <Badge />
        </div>
        <p className="dimension-source">
          {room.dimensionBasis === "concept"
            ? "Proposed – from concept drawing"
            : room.dimensionBasis === "area-derived"
              ? "Proposed – area-derived diagram assumption"
              : "Proposed – owner-edited reference"}
        </p>
        <div className="dimension-fields">
          {(["length", "width", "height"] as const).map((k) => (
            <label key={k}>
              {k === "height" ? "Clear height" : k} / m
              <input
                type="number"
                step="any"
                aria-label={`${room.name} ${k}`}
                value={f[k]}
                placeholder={k === "height" ? "TBD" : undefined}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <label className="compact-field">
          Net-area target / m²
          <input
            aria-label={`${room.name} area target`}
            type="number"
            step="any"
            value={f.areaTarget}
            onChange={(e) => setF({ ...f, areaTarget: e.target.value })}
          />
        </label>
        <label className="compact-field">
          Capacity / layout requirement
          <textarea
            value={f.capacity}
            onChange={(e) => setF({ ...f, capacity: e.target.value })}
          />
        </label>
        <button className="button gold-button" disabled={!valid}>
          <Check size={13} />
          Save preliminary dimensions
        </button>
        {!valid && (
          <p className="error-text">
            Use positive finite dimensions; leave unknown height blank.
          </p>
        )}
        <p role="status" className="cyan small">
          {feedback}
        </p>
      </form>
      <div className="stats current-stats">
        <div>
          <small>NET AREA TARGET</small>
          <strong>
            {room.areaTarget.toFixed(2)} <em>m²</em>
          </strong>
          <Badge />
        </div>
        <div>
          <small>DRAWN CLEAR AREA</small>
          <strong>
            {(room.length * room.width).toFixed(2)} <em>m²</em>
          </strong>
          <Badge status="Calculated" />
        </div>
        <div>
          <small>AIR VOLUME</small>
          <strong>
            {room.height === null
              ? "TBD"
              : (room.length * room.width * room.height).toFixed(2)}
            {room.height !== null && <em> m³</em>}
          </strong>
          {room.height !== null && <Badge status="Calculated" />}
        </div>
      </div>
      <EvidenceDetails evidence={room.evidence} />
      <EvidenceDetails
        evidence={{
          ...room.evidence,
          status: "Calculated",
          method:
            "Rectangular envelope A = L × W; V = A × finished clear H when H is known",
          assumptions:
            "Not a finished angled-room polygon. Missing heights are not inferred.",
          validation:
            "Approved polygons, actual clear dimensions, full acoustic/operational validation.",
        }}
      />
    </>
  );
}
