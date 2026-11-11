import { useState } from "react";
import { useProject } from "../lib/store";
const stages = [
  {
    title: "Structural shell",
    text: "The base building provides the outer boundary. Its junctions and flanking paths still need assessment.",
  },
  {
    title: "Independent inner envelope",
    text: "Add separately supported inner walls and an isolated ceiling strategy. Mass, separation and damping work together; retain airtight junctions and avoid rigid bridges.",
  },
  {
    title: "Floating construction & continuity",
    text: "Add a room-specific floating-floor concept and complete seals and service interfaces. Supports must be selected from loads and resonance requirements; springs are not assumed.",
  },
];
export function IsolationModel() {
  const [stage, setStage] = useState(0);
  const { data } = useProject();
  const room = data.programme.find((r) => r.id === "live")!;
  const L = room.length,
    W = room.width,
    H = room.height;
  const allowance = 0.3;
  const lx = L + 2 * allowance,
    wy = W + 2 * allowance,
    hz = (H ?? 0) + 2 * allowance;
  const scale = Math.min(
    560 / (0.866 * (lx + wy)),
    320 / ((lx + wy) * 0.5 + hz),
  );
  const cx = 350 - ((lx - wy) * 0.866 * scale) / 2,
    cy = 40 + hz * scale;
  const point = (x: number, y: number, z: number) =>
    `${cx + (x - y) * 0.866 * scale},${cy + (x + y) * 0.5 * scale - z * scale}`;
  const plane = (z: number, inset = 0) =>
    [
      [inset, inset],
      [lx - inset, inset],
      [lx - inset, wy - inset],
      [inset, wy - inset],
    ]
      .map(([x, y]) => point(x, y, z))
      .join(" ");
  const outerVertical = [
    [0, 0],
    [lx, 0],
    [lx, wy],
    [0, wy],
  ];
  return (
    <div className="isolation-model">
      <div
        className="model-controls"
        role="group"
        aria-label="Isolation construction stages"
      >
        {stages.map((s, i) => (
          <button
            className={stage === i ? "selected" : ""}
            key={s.title}
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
          >
            <span>0{i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      {H === null ? (
        <p className="notice">
          Enter a preliminary live-room height to display the proportioned
          construction model.
        </p>
      ) : (
        <svg
          viewBox="0 0 700 420"
          role="img"
          aria-label={`Fixed live-room geometry and camera, construction stage ${stage + 1}: ${stages[stage].title}`}
        >
          <g strokeLinejoin="round">
            <polygon
              points={plane(hz)}
              fill="none"
              stroke="#6b8ca0"
              strokeWidth="2"
            />
            <polygon
              points={plane(0)}
              fill="none"
              stroke="#40596c"
              strokeDasharray="5 7"
            />
            {outerVertical.map(([x, y]) => (
              <path
                key={`${x}-${y}`}
                d={`M${point(x, y, 0)}L${point(x, y, hz)}`}
                fill="none"
                stroke="#6b8ca0"
                strokeWidth="2"
              />
            ))}
            {stage >= 1 && (
              <>
                <polygon
                  points={plane(H + allowance, allowance)}
                  fill="#193b50"
                  fillOpacity=".55"
                  stroke="#73bfde"
                  strokeWidth="1.6"
                />
                {outerVertical.map(([x, y]) => {
                  const ix = x ? lx - allowance : allowance,
                    iy = y ? wy - allowance : allowance;
                  return (
                    <path
                      key={`${x}-${y}`}
                      d={`M${point(ix, iy, allowance)}L${point(ix, iy, H + allowance)}`}
                      fill="none"
                      stroke="#73bfde"
                      strokeWidth="2.3"
                    />
                  );
                })}
                <polygon
                  points={plane(allowance, allowance)}
                  fill="none"
                  stroke="#458ba9"
                  strokeDasharray="4 5"
                />
                <text x="385" y="110">
                  INNER CEILING STRATEGY
                </text>
                <text x="130" y="223">
                  INNER WALLS
                </text>
              </>
            )}
            {stage >= 2 && (
              <>
                <polygon
                  points={plane(allowance, allowance)}
                  fill="#b8955a"
                  fillOpacity=".18"
                  stroke="#d0b57f"
                  strokeWidth="2"
                />
                <polygon
                  points={plane(allowance / 2, allowance)}
                  fill="none"
                  stroke="#d0b57f"
                  strokeWidth="1"
                />
                <text x="250" y="285">
                  ROOM-SPECIFIC FLOATING FLOOR
                </text>
              </>
            )}
          </g>
        </svg>
      )}
      <p className="model-explanation">
        <b>{stages[stage].title}</b> — {stages[stage].text}
      </p>
      <p className="small muted">
        Fixed camera and live-room proportions ({L.toFixed(2)} × {W.toFixed(2)}{" "}
        m; H {H ?? "TBD"} m). Nested 0.30 m diagram allowances are provisional,
        not an engineered build-up. Conceptual section, not a dimensioned
        construction detail or three soundproofing grades. No universal spring
        system, common isolated platform or achieved isolation rating is
        asserted.
      </p>
    </div>
  );
}
export function IsolationAssemblyNotes() {
  return (
    <div className="assembly-notes">
      {[
        [
          "Walls",
          "Outer and inner mass leaves; structurally independent framing where feasible; cavity and damping strategy; airtight perimeter and penetrations.",
          "Leaf material, mass, cavity depth, ties, fire details and frequency-dependent performance: pending.",
        ],
        [
          "Floor",
          "Room-specific floating construction as required by the source/vibration brief. Avoid short-circuiting resilient support with perimeter or service bridges.",
          "Loads, support type, deflection, resonance, moisture/fire interfaces and thresholds: pending. No springs are specified by default.",
        ],
        [
          "Ceiling",
          "Independent support or engineered resilient suspension coordinated with structure, ducts, lighting and wall junctions.",
          "Span, hanger specification, mass, clearances, deflection and access details: pending.",
        ],
      ].map(([name, principle, pending]) => (
        <details className="tool-block" key={name} open>
          <summary>{name} isolation</summary>
          <p>{principle}</p>
          <p className="notice">{pending}</p>
        </details>
      ))}
    </div>
  );
}
