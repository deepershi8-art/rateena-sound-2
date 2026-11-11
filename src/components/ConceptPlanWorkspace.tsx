import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  Expand,
  Layers,
  Minus,
  Plus,
  RotateCcw,
  Move,
  MousePointer2,
} from "lucide-react";
import { useProject } from "../lib/store";
import {
  spatialStudy,
  typicalObjects,
  objectFit,
  WALL_ZONE,
} from "../lib/spatial";
import type { SpatialRoom, TypicalObject } from "../lib/spatial";
import { Badge, Modes } from "./Engineering";
import {
  ConceptReference,
  Clarifications,
  EditableNote,
  ResourceManager,
  ProgrammeEditor,
} from "./StudyFields";
import { IsolationAssemblyNotes } from "./IsolationModel";
import type { Room } from "../lib/types";
const tabs = [
  "Overview",
  "Architecture",
  "Sound Isolation",
  "Internal Acoustics",
  "Infrastructure",
  "Equipment",
  "Documents",
] as const;
const descriptions: Record<string, string> = {
  Architecture:
    "Walls, floor, ceiling, doors and glazing remain subject to developed architecture and engineering coordination. The drawing uses provisional 0.30 m partition zones, not approved wall assemblies.",
  "Sound Isolation":
    "Critical recording spaces are planned around an integrated Room-in-Room / Box-in-Box strategy. Mass–Decoupling–Damping and room-specific floating construction are complementary techniques.",
  "Internal Acoustics":
    "Treatment, room modes, bass control, decay and listening/performing conditions need room-specific study. No treatment quantities or achieved performance are asserted.",
  Infrastructure:
    "HVAC, electrical, audio wiring, data and lighting requirements are awaiting coordinated engineering input.",
  Equipment:
    "Planned equipment and operating requirements are pending. Drawing objects are typical size references only, not an equipment schedule.",
};
/** Proposed control-room glazing (owner design brief). Typical widths; no acoustic rating specified. */
export function controlWindows(rooms: SpatialRoom[]) {
  const get = (id: string) => rooms.find((r) => r.id === id)!;
  const c = get("control");
  const lounge = get("lounge");
  const half = WALL_ZONE / 2;
  const span = (len: number, max: number) =>
    Math.min(len, Math.max(0.6, max - 0.4));
  const w = [
    {
      id: "live",
      label: "to Main Live Room",
      x: c.x + (c.w - span(2.4, c.w)) / 2,
      y: c.y - half,
      len: span(2.4, c.w),
      vertical: false,
    },
    {
      id: "lounge",
      label: "to circulation / lounge",
      x: c.x + 0.35,
      y: c.y + c.d + half,
      len: span(1.5, c.w / 2 - 0.4),
      vertical: false,
    },
    {
      id: "lounge-wall",
      label: "lounge wall, aligned for sight line",
      x: c.x + 0.35,
      y: lounge.y - half,
      len: span(1.5, c.w / 2 - 0.4),
      vertical: false,
    },
    {
      id: "percussion",
      label: "to Percussion Isolation Booth",
      x: c.x - half,
      y: c.y + 1.2,
      len: span(1.2, c.d - 1.2),
      vertical: true,
    },
    {
      id: "bass",
      label: "to Bass / Rhythm Isolation Booth",
      x: c.x + c.w + half,
      y: c.y + 0.7,
      len: span(1.0, get("bass").d - 0.7),
      vertical: true,
    },
    {
      id: "vocal",
      label: "to Vocal Isolation Booth",
      x: c.x + c.w + half,
      y: get("vocal").y + 0.4,
      len: span(1.0, get("vocal").d - 0.4),
      vertical: true,
    },
  ];
  return w;
}
function ControlGlazing({ rooms }: { rooms: SpatialRoom[] }) {
  return (
    <g className="glazing">
      {controlWindows(rooms).map((w) => {
        const t = WALL_ZONE;
        const rect = w.vertical
          ? { x: w.x - t / 2, y: w.y, width: t, height: w.len }
          : { x: w.x, y: w.y - t / 2, width: w.len, height: t };
        const lines = w.vertical
          ? [-0.05, 0.05].map((o) => `M${w.x + o} ${w.y}V${w.y + w.len}`)
          : [-0.05, 0.05].map((o) => `M${w.x} ${w.y + o}H${w.x + w.len}`);
        return (
          <g key={w.id} data-window={w.id}>
            <title>{`Proposed double / laminated glazing ${w.label} — ${w.len.toFixed(2)} m typical width; acoustic rating not specified`}</title>
            <rect className="glazing-cut" {...rect} />
            {lines.map((d) => (
              <path key={d} className="glazing-pane" d={d} />
            ))}
          </g>
        );
      })}
    </g>
  );
}
function ObjectDrawing({ o }: { o: TypicalObject }) {
  return (
    <g
      data-object={o.id}
      transform={`translate(${o.x} ${o.y})`}
      className={`typical-object ${o.type}`}
    >
      <title>{o.label} — typical, not selected equipment</title>
      <rect className="object-bounds" width={o.w} height={o.d} />
      {o.type === "piano" ? (
        <>
          <path
            d={`M0 0H${o.w}V${o.d * 0.27}C${o.w * 0.95} ${o.d * 0.65},${o.w * 0.6} ${o.d},${o.w * 0.23} ${o.d}Q0 ${o.d},0 ${o.d * 0.8}Z`}
            fill="#b8955a"
            fillOpacity=".15"
          />
          <path d={`M0 .18H${o.w}M0 .37H${o.w}`} />
          {Array.from({ length: 15 }, (_, i) => (
            <path key={i} d={`M${(i * o.w) / 15} .18V.37`} />
          ))}
        </>
      ) : o.type === "drums" ? (
        <>
          <circle cx={o.w * 0.5} cy={o.d * 0.5} r=".27" />
          <circle cx={o.w * 0.3} cy={o.d * 0.3} r=".17" />
          <circle cx={o.w * 0.65} cy={o.d * 0.25} r=".18" />
          <circle cx={o.w * 0.78} cy={o.d * 0.65} r=".19" />
          <circle cx=".2" cy=".9" r=".24" />
          <circle cx={o.w - 0.2} cy=".18" r=".18" />
        </>
      ) : o.type === "bass" ? (
        <>
          <circle cx=".5" cy=".3" r=".17" />
          <path d="M.3 .8Q.1 .5 .4 .5L.45 .15H.55L.6 .5Q.9 .6 .7 .8Z" />
        </>
      ) : o.type === "chair" || o.type === "person" ? (
        <>
          <circle cx={o.w / 2} cy={o.d / 2} r={o.w * 0.38} />
          <path
            d={`M${o.w * 0.15} ${o.d * 0.17}Q${o.w / 2} ${-o.d * 0.05},${o.w * 0.85} ${o.d * 0.17}`}
          />
        </>
      ) : o.type === "console" ? (
        <>
          {Array.from({ length: 20 }, (_, i) => (
            <path key={i} d={`M${0.12 + i * 0.1} .1V${o.d - 0.1}`} />
          ))}
        </>
      ) : o.type === "rack" ? (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M.06 ${0.1 + i * 0.1}H${o.w - 0.06}`} />
          ))}
        </>
      ) : o.type === "sofa" ? (
        <>
          <rect x=".13" y=".16" width={o.w - 0.26} height={o.d - 0.24} />
          <path d="M.72 .16V.82M1.38 .16V.82" />
        </>
      ) : null}
    </g>
  );
}
function BottomDoor({
  x,
  y,
  width = 0.9,
  double = false,
}: {
  x: number;
  y: number;
  width?: number;
  double?: boolean;
}) {
  const leaf = double ? width / 2 : width;
  return (
    <g className="door-drawing">
      <path
        className="door-cut"
        d={`M${x} ${y}H${x + width}`}
        strokeWidth={WALL_ZONE + 0.06}
      />
      <path
        d={`M${x} ${y}V${y - leaf}M${x} ${y - leaf}A${leaf} ${leaf} 0 0 1 ${x + leaf} ${y}`}
      />
      {double && (
        <path
          d={`M${x + width} ${y}V${y - leaf}M${x + width} ${y - leaf}A${leaf} ${leaf} 0 0 0 ${x + width - leaf} ${y}`}
        />
      )}
    </g>
  );
}
function RightDoor({ x, y }: { x: number; y: number }) {
  return (
    <g className="door-drawing">
      <path
        className="door-cut"
        strokeWidth={WALL_ZONE + 0.06}
        d={`M${x} ${y}V${y + 0.9}`}
      />
      <path
        d={`M${x} ${y}H${x - 0.9}M${x - 0.9} ${y}A.9 .9 0 0 0 ${x} ${y + 0.9}`}
      />
    </g>
  );
}
export function ConceptPlanWorkspace() {
  const { data, revise } = useProject();
  const spatial = useMemo(() => spatialStudy(data.programme), [data.programme]);
  const objects = useMemo(() => typicalObjects(spatial.rooms), [spatial]);
  const failures = objectFit(spatial.rooms, objects);
  const [selected, setSelected] = useState("live");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const prefs = data.planPreferences;
  const wrapper = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [panMode, setPanMode] = useState(false);
  const [scale, setScale] = useState(100);
  const minX = Math.min(0, ...spatial.rooms.map((r) => r.x - WALL_ZONE));
  const base = {
    x: minX - 2.1,
    y: -1.7,
    w: spatial.width - minX + 4.2,
    h: spatial.height + 5.0,
  };
  const [view, setView] = useState(base);
  const drag = useRef<{
    clientX: number;
    clientY: number;
    scaleX: number;
    scaleY: number;
    vx: number;
    vy: number;
  } | null>(null);
  useEffect(() => {
    setView({
      x: minX - 2.1,
      y: -1.7,
      w: spatial.width - minX + 4.2,
      h: spatial.height + 5,
    });
  }, [spatial.width, spatial.height, minX]);
  const r = data.programme.find((r) => r.id === selected)!;
  const roomImage = data.resources.find(
    (resource) =>
      resource.roomId === r.id &&
      resource.kind === "image" &&
      resource.mime.startsWith("image/"),
  );
  const sr = spatial.rooms.find((r) => r.id === selected)!;
  const lounge = spatial.rooms.find((r) => r.id === "lounge")!;
  const exportWidth = (base.w * 1000) / scale,
    exportHeight = (base.h * 1000) / scale;
  const fitsA3 =
    Math.min(exportWidth, exportHeight) <= 297 &&
    Math.max(exportWidth, exportHeight) <= 420;
  const preference = (key: keyof typeof prefs) =>
    revise(`Plan layer: ${key}`, (d) => ({
      ...d,
      planPreferences: { ...d.planPreferences, [key]: !d.planPreferences[key] },
    }));
  const zoom = (factor: number) =>
    setView((v) => {
      const w = Math.min(base.w * 2, Math.max(base.w / 5, v.w * factor));
      const h = (w * base.h) / base.w;
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
    });
  const exportSvg = () => {
    if (!svgRef.current) return;
    const c = svgRef.current.cloneNode(true) as SVGSVGElement;
    c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    c.setAttribute("width", `${exportWidth}mm`);
    c.setAttribute("height", `${exportHeight}mm`);
    c.setAttribute("viewBox", `${base.x} ${base.y} ${base.w} ${base.h}`);
    const css = document.createElementNS("http://www.w3.org/2000/svg", "style");
    css.textContent = `svg{background:#080e16;font-family:Arial,sans-serif;color:#c9b684}.room-fill{fill:#0c1720;stroke:#68a7be;stroke-width:.025}.room-fill.active{fill:#18262c;stroke:#d2b477}.wall-zone{fill:none;stroke:#32404a}.room-name{fill:#d9e4e9;font-size:.34px;text-anchor:middle}.room-area{fill:#9fb9c8;font-size:.27px;text-anchor:middle}.plan-title{fill:#c9b684;font-size:.28px}.plan-note{fill:#9eb4c0;font-size:.22px}.dimension{fill:none;stroke:#527281;stroke-width:.015}.dimension text{fill:#83a0b1;stroke:none;font-size:.24px;text-anchor:middle}.metric-grid{fill:url(#metreGrid)}.typical-object{fill:none;stroke:#a88d61;stroke-width:.025}.object-bounds{stroke-dasharray:.08 .06;stroke-opacity:.45}.door-drawing{fill:none;stroke:#9cbcc8;stroke-width:.025}.door-cut{stroke:#080e16}.scale-bar text{fill:#c9dbe1;font-size:.25px;text-anchor:middle}.wc-line{stroke:#87a0ad;stroke-width:.03;fill:none}.glazing-cut{fill:#080e16;stroke:#6ec8eb;stroke-width:.02}.glazing-pane{stroke:#6ec8eb;stroke-width:.025;fill:none}`;
    c.prepend(css);
    const u = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(c)], {
        type: "image/svg+xml",
      }),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = `RATEENA-Flagship-preliminary-1-${scale}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  };
  return (
    <section className="concept-plan-workspace">
      <div className="plan-introduction">
        <div>
          <span className="eyebrow">
            Flagship Studio / primary technical interface
          </span>
          <h2>
            Floor Plan<span className="gold">.</span>
          </h2>
          <p>
            True-scale preliminary spatial study. Select a room to explore its
            brief.
          </p>
        </div>
        <Badge />
      </div>
      <p className="notice">
        Not an approved building footprint. Room net-area targets are preserved
        at true proportion; unresolved concept dimensions require an expanded
        arrangement. Walls, access and services remain proposed.
      </p>
      <div className="plan-topline">
        <span>1 SVG unit = 1 metre · rectangular clear envelopes</span>
        <span>
          Plan revision {data.planRevision} · {data.programme.length} selectable
          rooms
        </span>
      </div>
      <div className="plan-layout">
        <div className="drawing-column">
          <div className="plan-toolbar" aria-label="Drawing controls">
            <div>
              <button aria-label="Zoom out" onClick={() => zoom(1.2)}>
                <Minus size={15} />
              </button>
              <button aria-label="Zoom in" onClick={() => zoom(0.8)}>
                <Plus size={15} />
              </button>
              <button
                aria-label="Fit true-scale plan"
                onClick={() => setView(base)}
              >
                <RotateCcw size={15} />
              </button>
              <button
                className={panMode ? "selected" : ""}
                aria-label="Toggle pan mode"
                aria-pressed={panMode}
                onClick={() => setPanMode((v) => !v)}
              >
                {panMode ? <Move size={15} /> : <MousePointer2 size={15} />}
              </button>
            </div>
            <div>
              <select
                aria-label="SVG physical export scale"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              >
                <option value="50">1:50</option>
                <option value="100">1:100</option>
                <option value="200">1:200</option>
              </select>
              <button aria-label="Export dimensioned SVG" onClick={exportSvg}>
                <Download size={15} />
              </button>
              <button
                aria-label="Fullscreen drawing"
                onClick={() => {
                  if (document.fullscreenElement)
                    void document.exitFullscreen();
                  else
                    void wrapper.current?.requestFullscreen().catch(() => {});
                }}
              >
                <Expand size={15} />
              </button>
            </div>
          </div>
          <div className="plan-layers">
            <Layers size={13} />
            {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={prefs[k]}
                  onChange={() => preference(k)}
                />
                {k === "grid"
                  ? "Metre grid"
                  : k === "doors"
                    ? "Doors & windows"
                    : k}
              </label>
            ))}
          </div>
          <div
            className={`metre-plan ${panMode ? "pan-mode" : ""}`}
            ref={wrapper}
          >
            <svg
              ref={svgRef}
              viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
              aria-label="True-scale Flagship Studio preliminary floor plan"
              onPointerDown={(e) => {
                if (!panMode || !svgRef.current) return;
                const m = svgRef.current.getScreenCTM()!;
                drag.current = {
                  clientX: e.clientX,
                  clientY: e.clientY,
                  scaleX: m.a,
                  scaleY: m.d,
                  vx: view.x,
                  vy: view.y,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!drag.current || !svgRef.current) return;
                const d = drag.current;
                setView((v) => ({
                  ...v,
                  x: d.vx - (e.clientX - d.clientX) / d.scaleX,
                  y: d.vy - (e.clientY - d.clientY) / d.scaleY,
                }));
              }}
              onPointerUp={() => (drag.current = null)}
              onPointerCancel={() => (drag.current = null)}
            >
              <defs>
                <pattern
                  id="metreGrid"
                  width="1"
                  height="1"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 0H0V1"
                    fill="none"
                    stroke="#3b6479"
                    strokeOpacity=".28"
                    strokeWidth=".015"
                  />
                </pattern>
                <pattern
                  id="wallHatch"
                  width=".15"
                  height=".15"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <path
                    d="M0 0V.15"
                    stroke="#8fa4ae"
                    strokeOpacity=".2"
                    strokeWidth=".025"
                  />
                </pattern>
              </defs>
              <rect
                x={base.x}
                y={base.y}
                width={base.w}
                height={base.h}
                fill="#080e16"
              />
              {prefs.grid && (
                <rect
                  x={base.x}
                  y={base.y}
                  width={base.w}
                  height={base.h}
                  className="metric-grid"
                />
              )}
              <text x={minX} y="-.8" className="plan-title">
                RATEENA SOUND / FLAGSHIP STUDIO
              </text>
              <text x={minX} y="-.25" className="plan-note">
                PROVISIONAL NET ENVELOPES · NOT FOR CONSTRUCTION
              </text>
              {spatial.rooms.map((a, i) => (
                <g
                  key={a.id}
                  className="selectable-room"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${a.room.name}, ${a.room.areaTarget} square metre target`}
                  aria-pressed={selected === a.id}
                  onClick={() => {
                    if (!panMode) {
                      setSelected(a.id);
                      setTab("Overview");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(a.id);
                      setTab("Overview");
                    }
                  }}
                >
                  {prefs.walls && (
                    <>
                      <rect
                        className="wall-zone"
                        data-wall={a.id}
                        x={a.x - WALL_ZONE / 2}
                        y={a.y - WALL_ZONE / 2}
                        width={a.w + WALL_ZONE}
                        height={a.d + WALL_ZONE}
                        strokeWidth={WALL_ZONE}
                      />
                      <rect
                        x={a.x - WALL_ZONE}
                        y={a.y - WALL_ZONE}
                        width={a.w + 2 * WALL_ZONE}
                        height={a.d + 2 * WALL_ZONE}
                        fill="url(#wallHatch)"
                      />
                    </>
                  )}
                  <rect
                    data-room-envelope={a.id}
                    className={`room-fill ${selected === a.id ? "active" : ""}`}
                    x={a.x}
                    y={a.y}
                    width={a.w}
                    height={a.d}
                  />
                  {prefs.grid && (
                    <rect
                      x={a.x}
                      y={a.y}
                      width={a.w}
                      height={a.d}
                      className="metric-grid"
                    />
                  )}
                  {prefs.labels && (
                    <g className="draft-label">
                      <text
                        className="room-name"
                        style={a.w <= 2 ? { fontSize: ".27px" } : undefined}
                        x={a.x + a.w / 2}
                        y={a.y + 0.58}
                      >
                        {String(i + 1).padStart(2, "0")}{" "}
                        {(a.id === "equipment"
                          ? "TECH"
                          : a.room.shortName
                        ).toUpperCase()}
                      </text>
                      <text
                        className="room-area"
                        x={a.x + a.w / 2}
                        y={a.y + 0.99}
                      >
                        {a.room.areaTarget} m² target
                      </text>
                    </g>
                  )}
                  {prefs.dimensions && (
                    <g className="dimension">
                      <path
                        d={`M${a.x} ${a.y + a.d + 0.2}V${a.y + a.d + 0.65}M${a.x} ${a.y + a.d + 0.5}H${a.x + a.w}M${a.x + a.w} ${a.y + a.d + 0.2}V${a.y + a.d + 0.65}`}
                      />
                      <text x={a.x + a.w / 2} y={a.y + a.d + 0.46}>
                        {a.w.toFixed(2)} m
                      </text>
                      {a.id === "live" && (
                        <>
                          <path
                            d={`M${a.x - 0.5} ${a.y}V${a.y + a.d}M${a.x - 0.65} ${a.y}H${a.x - 0.2}M${a.x - 0.65} ${a.y + a.d}H${a.x - 0.2}`}
                          />
                          <text
                            transform={`translate(${a.x - 0.65} ${a.y + a.d / 2}) rotate(-90)`}
                          >
                            {a.d.toFixed(2)} m
                          </text>
                        </>
                      )}
                    </g>
                  )}
                </g>
              ))}
              {objects
                .filter((o) => prefs[o.layer])
                .map((o) => (
                  <ObjectDrawing key={o.id} o={o} />
                ))}
              {prefs.furniture &&
                [0, 1].map((n) => (
                  <g
                    key={n}
                    transform={`translate(${lounge.x + 0.4 + n * 1.8} ${lounge.y + lounge.d - 1.3})`}
                    className="wc-line"
                  >
                    <rect width="1.5" height=".9" />
                    <ellipse cx=".38" cy=".5" rx=".19" ry=".3" />
                    <path d="M.12 .15H.64V.3H.12Z" />
                    <text
                      x=".8"
                      y=".55"
                      className="room-area"
                      style={{ fontSize: ".19px" }}
                    >
                      WC {n ? "W" : "M"}
                    </text>
                    <title>
                      WC {n ? "Women" : "Men"} cubicle 1.5 × 0.9 m, typical
                      only; accessibility and services unresolved
                    </title>
                    {prefs.doors && <BottomDoor x={0.3} y={0} width={0.9} />}
                  </g>
                ))}
              {prefs.doors &&
                spatial.rooms.map((a) =>
                  a.id === "live" || a.id === "bass" || a.id === "vocal" ? (
                    <RightDoor
                      key={a.id}
                      x={a.x + a.w + 0.15}
                      y={a.y + (a.id === "live" ? a.d - 1.5 : 1.1)}
                    />
                  ) : (
                    <BottomDoor
                      key={a.id}
                      x={
                        a.id === "lounge"
                          ? a.x + a.w / 2 - 0.9
                          : a.x + Math.max(0.1, (a.w - 0.9) / 2)
                      }
                      y={a.y + a.d + 0.15}
                      width={a.id === "lounge" ? 1.8 : 0.9}
                      double={a.id === "lounge"}
                    />
                  ),
                )}
              {prefs.doors && (
                <g
                  transform={`translate(${lounge.x + lounge.w - 1.2} ${lounge.y - 0.15}) rotate(180)`}
                >
                  <title>Proposed 0.90 m lounge-to-studio access door</title>
                  <BottomDoor x={0} y={0} />
                </g>
              )}
              {prefs.doors && <ControlGlazing rooms={spatial.rooms} />}
              <text
                className="plan-note"
                textAnchor="middle"
                x={lounge.x + lounge.w / 2}
                y={lounge.y + lounge.d + 0.95}
              >
                MAIN ENTRANCE · 1.80 m TYPICAL PAIR
              </text>
              <g
                className="scale-bar"
                data-testid="scale-bar"
                transform={`translate(${minX} ${spatial.height + 1.7})`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <rect
                    key={i}
                    x={i}
                    width="1"
                    height=".13"
                    fill={i % 2 ? "#080e16" : "#a2c2d1"}
                    stroke="#a2c2d1"
                    strokeWidth=".02"
                  />
                ))}
                <path
                  data-testid="scale-bar-five-metres"
                  d="M0 0H5"
                  stroke="transparent"
                  strokeWidth=".01"
                />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <text x={i} y=".55" key={i}>
                    {i}
                    {i === 5 ? " m" : ""}
                  </text>
                ))}
              </g>
              <text
                x={minX + 7}
                y={spatial.height + 1.82}
                className="plan-note"
              >
                1 UNIT = 1 m · TYPICAL OBJECTS · ASSUMED WALL ZONE 0.30 m
              </text>
            </svg>
          </div>
          <div className="scale-caption">
            <b>Metric geometry, not a screen ruler.</b>
            <span>
              SVG export 1:{scale} at {exportWidth.toFixed(0)} ×{" "}
              {exportHeight.toFixed(0)} mm.{" "}
              {fitsA3
                ? "Fits A3 at 100% print size."
                : "Does not fit A3 at this scale."}{" "}
              Disable “fit to page”; screen zoom does not preserve physical
              scale.
            </span>
          </div>
          <div className="room-selector" aria-label="Choose a room">
            {spatial.rooms.map((a) => (
              <button
                key={a.id}
                className={selected === a.id ? "selected" : ""}
                onClick={() => {
                  setSelected(a.id);
                  setTab("Overview");
                }}
              >
                <span>{a.room.shortName}</span>
                <small>{a.room.areaTarget} m²</small>
              </button>
            ))}
          </div>
          <details className="tool-block">
            <summary>Typical-size objects & fit check</summary>
            <p className="small">
              Size references, not selected equipment or a capacity/compliance
              claim. Control-room glazing (live room, lounge, percussion and
              bass/vocal booths) is proposed double / laminated glazing at
              typical widths; no acoustic rating is specified. Wall zones = 0.30
              m assumed; single leaf = 0.90 m; entrance pair = 1.80 m; WC
              cubicle = 1.50 × 0.90 m. An access/service allocation is added
              outside net rooms; routes, accessibility, fire escape and door
              swings require review.
            </p>
            <ul>
              {[...new Set(objects.map((o) => o.label))].map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            {failures.length ? (
              failures.map((f) => (
                <p className="error-text" key={f}>
                  {f}
                </p>
              ))
            ) : (
              <p className="small cyan">
                Displayed footprints fit inside their current reference
                envelopes. This is not a circulation or acoustic validation.
              </p>
            )}
            <p className="notice">
              A 2.74 m grand is not placed in the 3.00 × 2.50 m booths: its
              length exceeds the 2.50 m clear depth in this orientation, and
              realistic player/door clearance is unresolved. The real fit is
              shown, rather than scaling the piano down.
            </p>
          </details>
          <ConceptReference />
          <Clarifications />
        </div>
        <aside
          className="room-information"
          aria-label={`${r.name} room information`}
        >
          <div className="room-panel-heading">
            <span className="eyebrow">
              Selected room /{" "}
              {String(spatial.rooms.indexOf(sr) + 1).padStart(2, "0")}
            </span>
            <h3>{r.name}</h3>
            <Badge status={r.evidence.status} />
          </div>
          <div className="room-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            className="room-tab-content"
            key={`${r.id}-${tab}`}
          >
            {tab === "Overview" ? (
              <>
                {roomImage ? (
                  <figure className="room-image">
                    <img src={roomImage.dataUrl} alt={roomImage.name} />
                    <figcaption>
                      Owner-added room image · {roomImage.status}
                    </figcaption>
                  </figure>
                ) : (
                  <>
                    <div className="image-placeholder">
                      <span>Room image / add later</span>
                      <small>Use Documents to add actual room imagery.</small>
                    </div>
                  </>
                )}
                <p>{r.purpose}</p>
                <ProgrammeEditor room={r} />
              </>
            ) : tab === "Documents" ? (
              <>
                <ConceptReference compact />
                <Clarifications />
                <ResourceManager roomId={r.id} />
                <EditableNote
                  noteKey={`room:${r.id}:documents`}
                  label={`${r.shortName} references, calculations & decisions`}
                />
                <details className="tool-block">
                  <summary>Decision & revision history</summary>
                  {data.decisions.map((d) => (
                    <p key={d.id}>{d.text}</p>
                  ))}
                  {[...data.revisions]
                    .reverse()
                    .slice(0, 12)
                    .map((v) => (
                      <p className="small" key={v.id}>
                        R{String(v.number).padStart(3, "0")} · {v.description}
                      </p>
                    ))}
                </details>
              </>
            ) : (
              <>
                <h4>{tab}</h4>
                <p>{descriptions[tab]}</p>
                {tab === "Sound Isolation" && <IsolationAssemblyNotes />}
                {tab === "Internal Acoustics" && (
                  <details className="tool-block">
                    <summary>Rectangular axial-mode reference</summary>
                    <p className="small">
                      A preliminary calculation only; geometry, finishes and
                      irregular boundaries are not represented.
                    </p>
                    {r.height !== null ? (
                      <Modes
                        room={
                          { ...r, use: r.purpose, height: r.height } as Room
                        }
                      />
                    ) : (
                      <p>
                        Clear height is pending; a complete axial-mode reference
                        cannot yet be calculated.
                      </p>
                    )}
                  </details>
                )}
                <div className="empty-inline">
                  Actual {tab.toLowerCase()} study content — pending engineering
                  input.
                </div>
                <EditableNote
                  noteKey={`room:${r.id}:${tab}`}
                  label={`${r.shortName} ${tab} study`}
                />
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
