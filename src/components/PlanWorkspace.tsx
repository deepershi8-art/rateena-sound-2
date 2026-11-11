import { useRef, useState, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Download,
  Box,
  FileInput,
  Move,
} from "lucide-react";
import { useProject, download } from "../lib/store";
import { roomMetrics } from "../lib/geometry";
import { qualifications } from "../data/initial";
import {
  Badge,
  EvidenceDetails,
  RoomStats,
  RoomEditor,
  Modes,
  References,
} from "./Engineering";
const tabs = [
  "Room Details",
  "Acoustic Analysis",
  "Design Standards",
  "Design Rationale",
  "Construction Requirements",
  "Verification & Sources",
];
export function PlanWorkspace() {
  const { data, revise } = useProject();
  const [selected, setSelected] = useState("live");
  const [tab, setTab] = useState(tabs[0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(100);
  const [layersOpen, setLayersOpen] = useState(false);
  const [future, setFuture] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const room = data.rooms.find((r) => r.id === selected)!;
  const metres = 1000 / scale;
  const viewW = canvasSize.width / zoom;
  const viewH = canvasSize.height / zoom;
  const vx = -pan.x / zoom;
  const vy = -pan.y / zoom;
  const grid = data.geometry.layers.find((l) => l.id === "grid")?.visible;
  const changeZoom = (z: number) => setZoom(Math.max(0.3, Math.min(4, z)));
  const exportSVG = () => {
    const current = svgRef.current;
    if (current) {
      const copy = current.cloneNode(true) as SVGSVGElement;
      copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      copy.setAttribute("width", `${canvasSize.width}mm`);
      copy.setAttribute("height", `${canvasSize.height}mm`);
      copy.insertAdjacentHTML(
        "afterbegin",
        "<title>Architectural Drawing Pending — Geometry Not Yet Approved. Empty drafting workspace, not a floor plan.</title>",
      );
      download(
        "RATEENA-pending-workspace.svg",
        new XMLSerializer().serializeToString(copy),
        "image/svg+xml",
      );
    }
  };
  return (
    <div className="architecture">
      <div className="workspace-heading">
        <div>
          <div className="section-kicker">TECHNICAL STUDY / 01</div>
          <h2>Architectural Proposal</h2>
        </div>
        <div className="revision-tag">
          DRAWING R{String(data.geometry.revision).padStart(3, "0")} · METRIC
        </div>
      </div>
      <div className="pending-status">
        <span className="status-dot" />
        Architectural Drawing Pending — Geometry Not Yet Approved
      </div>
      <div className="architecture-grid">
        <div className="drawing-column">
          <div className="canvas-toolbar">
            <div className="toolbar-group">
              <button
                title="Zoom out"
                aria-label="Zoom out"
                onClick={() => changeZoom(zoom - 0.15)}
              >
                <ZoomOut size={17} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                title="Zoom in"
                aria-label="Zoom in"
                onClick={() => changeZoom(zoom + 0.15)}
              >
                <ZoomIn size={17} />
              </button>
              <button
                title="Reset view"
                aria-label="Reset view"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                <Maximize size={16} />
              </button>
            </div>
            <label>
              Scale{" "}
              <select
                aria-label="Drawing scale"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              >
                <option value="50">1:50</option>
                <option value="100">1:100</option>
                <option value="200">1:200</option>
              </select>
            </label>
            <button
              className={layersOpen ? "active-tool" : ""}
              onClick={() => setLayersOpen(!layersOpen)}
              aria-expanded={layersOpen}
            >
              <Layers size={15} />
              Layers
            </button>
          </div>
          {layersOpen && (
            <div className="layers-panel">
              {data.geometry.layers.map((l) => (
                <label key={l.id}>
                  <input
                    type="checkbox"
                    checked={l.visible}
                    onChange={() =>
                      revise(`Layer visibility: ${l.name}`, (d) => ({
                        ...d,
                        geometry: {
                          ...d.geometry,
                          layers: d.geometry.layers.map((a) =>
                            a.id === l.id ? { ...a, visible: !a.visible } : a,
                          ),
                        },
                      }))
                    }
                  />
                  {l.name}
                </label>
              ))}
            </div>
          )}
          <div className="plan-canvas" ref={canvasRef}>
            <svg
              ref={svgRef}
              viewBox={`${vx} ${vy} ${viewW} ${viewH}`}
              role="img"
              aria-label="Empty metric architectural drawing canvas. Drag to pan."
              onPointerDown={(e) => {
                drag.current = {
                  x: e.clientX,
                  y: e.clientY,
                  px: pan.x,
                  py: pan.y,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (drag.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPan({
                    x:
                      drag.current.px +
                      ((e.clientX - drag.current.x) * canvasSize.width) /
                        rect.width,
                    y:
                      drag.current.py +
                      ((e.clientY - drag.current.y) * canvasSize.height) /
                        rect.height,
                  });
                }
              }}
              onPointerUp={() => (drag.current = null)}
              onPointerCancel={() => (drag.current = null)}
            >
              <defs>
                <pattern
                  id="metric-grid"
                  width={metres}
                  height={metres}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M${metres} 0H0V${metres}`}
                    fill="none"
                    stroke="#233548"
                    strokeWidth="0.4"
                  />
                </pattern>
                <pattern
                  id="major-grid"
                  width={metres * 5}
                  height={metres * 5}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width={metres * 5}
                    height={metres * 5}
                    fill="url(#metric-grid)"
                  />
                  <path
                    d={`M${metres * 5} 0H0V${metres * 5}`}
                    fill="none"
                    stroke="#3b5368"
                    strokeWidth=".55"
                  />
                </pattern>
              </defs>
              <rect x={vx} y={vy} width={viewW} height={viewH} fill="#0b1420" />
              {grid && (
                <rect
                  x={vx}
                  y={vy}
                  width={viewW}
                  height={viewH}
                  fill="url(#major-grid)"
                />
              )}
              <g stroke="#7c9aae" strokeWidth=".7">
                <path d="M-8 0H8M0-8V8" />
              </g>
              <text x="11" y="15" fill="#7c9aae" fontSize="8">
                0,0 m
              </text>
            </svg>
          </div>
          <div className="drafting-footer">
            <span>
              <Move size={13} />
              Drag to pan · grid 1 m
            </span>
            <div
              className="scale-bar"
              style={{ width: Math.max(35, metres * 5 * zoom) }}
            >
              <span>0</span>
              <span>5 m</span>
            </div>
            <span>
              1:{scale} nominal · zoom {Math.round(zoom * 100)}%*
            </span>
          </div>
          <div className="scale-note">
            *Screen scale depends on your display. At 100% zoom, SVG uses
            millimetre units at the selected scale. Zoom changes export scale
            too. Use metric coordinates, not a screen ruler. No approved drawing
            exists.
          </div>
          <div className="workspace-actions">
            <button onClick={exportSVG}>
              <Download size={14} />
              Export canvas SVG
            </button>
            <button onClick={() => setFuture("PDF export")}>
              <Download size={14} />
              PDF <small>Future</small>
            </button>
            <button onClick={() => setFuture("CAD / DXF import")}>
              <FileInput size={14} />
              DXF <small>Future</small>
            </button>
            <button
              onClick={() =>
                setFuture("3D view derived from approved geometry")
              }
            >
              <Box size={14} />
              3D view <small>Future</small>
            </button>
          </div>
          <div className="room-strip">
            <div className="section-kicker">ROOM LIST · SELECT TO INSPECT</div>
            <div className="room-list">
              {data.rooms.map((r) => (
                <button
                  className={r.id === selected ? "selected" : ""}
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                >
                  <span>{r.name}</span>
                  <small>
                    {roomMetrics(r).area.toFixed(2)} m² · Calculated
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="room-panel">
          <div className="room-panel-heading">
            <span className="section-kicker">ROOM INFORMATION</span>
            <h3>{room.name}</h3>
            <p>{room.use}</p>
            <Badge />
          </div>
          <div
            className="panel-tabs"
            role="tablist"
            aria-label="Room information tabs"
          >
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={t === tab}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="room-panel-body" role="tabpanel" aria-label={tab}>
            {tab === tabs[0] && (
              <>
                <RoomEditor key={room.id} room={room} />
                <RoomStats room={room} />
                {room.capacity && (
                  <p className="small">
                    Target capacity: {room.capacity} <Badge /> Subject to layout
                    validation.
                  </p>
                )}
                <details className="qualification-list">
                  <summary>Engineering qualifications</summary>
                  {qualifications.map((q) => (
                    <p key={q}>{q}</p>
                  ))}
                </details>
                <EvidenceDetails evidence={room.evidence} />
              </>
            )}
            {tab === tabs[1] && (
              <>
                <Modes room={room} />
                <p className="notice">
                  Full acoustic simulation: Future integration. No simulated
                  room response is available.
                </p>
              </>
            )}
            {tab === tabs[2] && <References />}
            {tab === tabs[3] && (
              <>
                <h3>Reference, not final geometry</h3>
                <p>
                  The initial Main Live Room uses a Golden proportion
                  hypothesis. All five envelopes remain preliminary candidates,
                  not optimised construction geometry.
                </p>
                <p>
                  Non-parallel walls require exact coordinates, measured angles,
                  true polygon area and acoustic validation. They are not
                  automatically better.
                </p>
                <EvidenceDetails evidence={room.evidence} />
              </>
            )}
            {tab === tabs[4] && (
              <>
                <h3>Coordination required</h3>
                <ul className="plain-list">
                  <li>Protect finished clear height.</li>
                  <li>Coordinate shell thickness and structural loading.</li>
                  <li>Resolve doors, sound locks and circulation.</li>
                  <li>Avoid unplanned service and structural bridges.</li>
                  <li>Check ventilation, fire safety and accessibility.</li>
                </ul>
                <p className="notice">
                  Construction details and approvals are pending. This workspace
                  is not construction documentation.
                </p>
              </>
            )}
            {tab === tabs[5] && (
              <>
                <EvidenceDetails evidence={room.evidence} />
                <EvidenceDetails evidence={room.evidence} calculated />
                <h3>Validation outstanding</h3>
                <p>
                  Approved geometry, site survey, source/receiver placement,
                  capacity, services and commissioning.
                </p>
                <p className="empty-inline">No measured or verified result.</p>
              </>
            )}
          </div>
        </aside>
      </div>
      {future && (
        <div className="modal-backdrop" onClick={() => setFuture("")}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Future integration"
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-kicker">FUTURE INTEGRATION</div>
            <h2>{future}</h2>
            <p>
              This capability is not implemented. It will use the same approved
              metric geometry model. No fabricated output is available.
            </p>
            <button
              className="button gold-button"
              autoFocus
              onClick={() => setFuture("")}
            >
              Return to workspace
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
