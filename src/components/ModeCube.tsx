import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { analyseAxialModes, pressureNodes } from "../lib/modes";
import type { Axis } from "../lib/modes";
import { Badge } from "./Engineering";
type Vec = [number, number, number];
interface Ray {
  pos: Vec;
  dir: Vec;
  path: Vec[];
  born: number;
  bounces: number;
}
const AXIS_INDEX: Record<Axis, 0 | 1 | 2> = { L: 0, W: 1, H: 2 };
const AXIS_NAME: Record<Axis, string> = {
  L: "Length",
  W: "Width",
  H: "Height",
};
const RAYS_PER_PULSE = 40;
const PULSE_INTERVAL = 1.6;
const RAY_LIFE = 5.5;
function directions(n: number): Vec[] {
  const out: Vec[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const z = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - z * z);
    out.push([Math.cos(golden * i) * r, Math.sin(golden * i) * r, z]);
  }
  return out;
}
const DIRS = directions(RAYS_PER_PULSE);
export function ModeCube({
  initial,
}: {
  initial: { L: number; W: number; H: number };
}) {
  const reduced =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const [dims, setDims] = useState(initial);
  const [running, setRunning] = useState(!reduced);
  const [selected, setSelected] = useState<{ axis: Axis; n: number }>({
    axis: "L",
    n: 1,
  });
  const analysis = useMemo(() => analyseAxialModes(dims), [dims]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const view = useRef({ yaw: -0.65, pitch: 0.42 });
  const state = useRef({
    rays: [] as Ray[],
    t: 0,
    lastPulse: -99,
    visible: true,
  });
  const drawRef = useRef<() => void>(() => {});
  const source: Vec = [dims.L * 0.32, dims.W * 0.42, dims.H * 0.38];
  // Reset the ray field when the room changes.
  useEffect(() => {
    state.current.rays = [];
    state.current.lastPulse = -99;
  }, [dims.L, dims.W, dims.H]);
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext?.("2d");
    if (!c || !ctx) return;
    const size = { w: 0, h: 0, dpr: 1 };
    const resize = () => {
      const r = c.getBoundingClientRect();
      size.dpr = Math.min(2, window.devicePixelRatio || 1);
      size.w = r.width;
      size.h = r.height;
      c.width = Math.max(1, Math.round(r.width * size.dpr));
      c.height = Math.max(1, Math.round(r.height * size.dpr));
      drawRef.current();
    };
    const D = [dims.L, dims.W, dims.H] as Vec;
    const radius = 0.5 * Math.hypot(...D);
    const project = (p: Vec) => {
      const { yaw, pitch } = view.current;
      const x = p[0] - D[0] / 2;
      const y = p[1] - D[1] / 2;
      const z = p[2] - D[2] / 2;
      const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
      const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
      const y2 = y1 * Math.cos(pitch) - z * Math.sin(pitch);
      const z2 = y1 * Math.sin(pitch) + z * Math.cos(pitch);
      const s = (0.43 * Math.min(size.w, size.h * 1.25)) / radius;
      const f = (radius * 4) / (radius * 4 + y2);
      return [size.w / 2 + x1 * s * f, size.h / 2 - z2 * s * f, s * f] as const;
    };
    const line = (a: Vec, b: Vec) => {
      const p = project(a);
      const q = project(b);
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
    };
    const speed = radius / 3.2; // visual propagation speed, not real time
    const step = (dt: number) => {
      const st = state.current;
      st.t += dt;
      if (st.t - st.lastPulse >= PULSE_INTERVAL) {
        st.lastPulse = st.t;
        for (const d of DIRS)
          st.rays.push({
            pos: [...source] as Vec,
            dir: [...d] as Vec,
            path: [[...source] as Vec],
            born: st.t,
            bounces: 0,
          });
      }
      st.rays = st.rays.filter((r) => st.t - r.born < RAY_LIFE);
      for (const r of st.rays) {
        let remaining = speed * dt;
        while (remaining > 1e-9) {
          // distance to the next wall along the ray
          let tHit = Infinity;
          let hitAxis = -1;
          for (let k = 0; k < 3; k++) {
            if (r.dir[k] > 0) {
              const t = (D[k] - r.pos[k]) / r.dir[k];
              if (t < tHit) [tHit, hitAxis] = [t, k];
            } else if (r.dir[k] < 0) {
              const t = -r.pos[k] / r.dir[k];
              if (t < tHit) [tHit, hitAxis] = [t, k];
            }
          }
          const move = Math.min(remaining, tHit);
          for (let k = 0; k < 3; k++) r.pos[k] += r.dir[k] * move;
          remaining -= move;
          if (move === tHit && hitAxis >= 0) {
            // specular reflection: angle of incidence equals angle of reflection
            r.dir[hitAxis] = -r.dir[hitAxis];
            r.pos[hitAxis] = Math.min(D[hitAxis], Math.max(0, r.pos[hitAxis]));
            r.bounces++;
            r.path.push([...r.pos] as Vec);
            if (r.path.length > 12) r.path.shift();
          }
        }
      }
    };
    const draw = () => {
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      // edges only — engineering wireframe
      const corners: Vec[] = [];
      for (const x of [0, D[0]])
        for (const y of [0, D[1]])
          for (const z of [0, D[2]]) corners.push([x, y, z]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(214,190,136,0.85)";
      ctx.beginPath();
      for (let i = 0; i < 8; i++)
        for (let j = i + 1; j < 8; j++) {
          const diff = [0, 1, 2].filter(
            (k) => corners[i][k] !== corners[j][k],
          ).length;
          if (diff === 1) line(corners[i], corners[j]);
        }
      ctx.stroke();
      // floor metre ticks along length & width for scale
      ctx.strokeStyle = "rgba(115,170,200,0.25)";
      ctx.beginPath();
      for (let m = 1; m < D[0]; m++) line([m, 0, 0], [m, 0.25, 0]);
      for (let m = 1; m < D[1]; m++) line([0, m, 0], [0.25, m, 0]);
      ctx.stroke();
      const st = state.current;
      ctx.globalCompositeOperation = "lighter";
      // expanding direct wavefront (until it reaches the nearest boundary)
      const nearest = Math.min(
        source[0],
        D[0] - source[0],
        source[1],
        D[1] - source[1],
        source[2],
        D[2] - source[2],
      );
      for (let k = 0; k < 4; k++) {
        const age = st.t - (st.lastPulse - k * PULSE_INTERVAL);
        const r = age * speed;
        if (age < 0 || r > nearest * 1.6) continue;
        const sp = project(source);
        ctx.strokeStyle = `rgba(240,214,150,${0.5 * (1 - r / (nearest * 1.6))})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sp[0], sp[1], r * sp[2], 0, Math.PI * 2);
        ctx.stroke();
      }
      // reflected rays with short trails
      const trail = radius * 0.22;
      for (const r of st.rays) {
        const life = 1 - (st.t - r.born) / RAY_LIFE;
        const energy = Math.pow(0.72, r.bounces) * life;
        if (energy < 0.03) continue;
        ctx.strokeStyle =
          r.bounces === 0
            ? `rgba(240,214,150,${energy})`
            : `rgba(110,200,235,${energy})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        let prev: Vec = r.pos;
        let left = trail;
        const p0 = project(prev);
        ctx.moveTo(p0[0], p0[1]);
        for (let i = r.path.length - 1; i >= 0 && left > 0; i--) {
          const v = r.path[i];
          const seg = Math.hypot(
            prev[0] - v[0],
            prev[1] - v[1],
            prev[2] - v[2],
          );
          const target: Vec =
            seg > left
              ? [
                  prev[0] + ((v[0] - prev[0]) * left) / seg,
                  prev[1] + ((v[1] - prev[1]) * left) / seg,
                  prev[2] + ((v[2] - prev[2]) * left) / seg,
                ]
              : v;
          const p = project(target);
          ctx.lineTo(p[0], p[1]);
          left -= seg;
          prev = v;
        }
        ctx.stroke();
        const head = project(r.pos);
        ctx.fillStyle =
          r.bounces === 0
            ? `rgba(255,232,180,${energy})`
            : `rgba(160,225,250,${energy})`;
        ctx.fillRect(head[0] - 1, head[1] - 1, 2, 2);
      }
      ctx.globalCompositeOperation = "source-over";
      // source
      const sp = project(source);
      const glow = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], 14);
      glow.addColorStop(0, "rgba(255,230,170,0.95)");
      glow.addColorStop(1, "rgba(255,230,170,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sp[0], sp[1], 14, 0, Math.PI * 2);
      ctx.fill();
      // standing-wave pressure distribution along the selected axis
      const ai = AXIS_INDEX[selected.axis];
      const len = D[ai];
      const centre: Vec = [D[0] / 2, D[1] / 2, D[2] / 2];
      const perp = ai === 2 ? 0 : 2;
      const amp = Math.min(...D) * 0.22;
      const phase = Math.cos(st.t * 2.4);
      const at = (u: number, a: number): Vec => {
        const p: Vec = [...centre] as Vec;
        p[ai] = u;
        p[perp] += a;
        return p;
      };
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(115,170,200,0.35)";
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      line(at(0, 0), at(len, 0));
      for (const sign of [1, -1]) {
        for (let i = 0; i <= 80; i++) {
          const u = (i / 80) * len;
          const p = project(
            at(
              u,
              sign * amp * Math.abs(Math.cos((selected.n * Math.PI * u) / len)),
            ),
          );
          if (i === 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(240,214,150,0.95)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = (i / 120) * len;
        const p = project(
          at(u, amp * phase * Math.cos((selected.n * Math.PI * u) / len)),
        );
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
      for (const f of pressureNodes(selected.n)) {
        const p = project(at(f * len, 0));
        ctx.fillStyle = "#6ec8eb";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let k = 0; k <= selected.n; k++) {
        const p = project(at((k / selected.n) * len, 0));
        ctx.strokeStyle = "#e6cf9c";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    drawRef.current = draw;
    resize();
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(c);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([e]) => (state.current.visible = e.isIntersecting),
          )
        : null;
    io?.observe(c);
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (state.current.visible) {
        step(dt);
        draw();
      }
      frame = requestAnimationFrame(loop);
    };
    if (running) frame = requestAnimationFrame(loop);
    else {
      if (!state.current.rays.length) step(PULSE_INTERVAL * 1.4);
      draw();
    }
    return () => {
      cancelAnimationFrame(frame);
      ro?.disconnect();
      io?.disconnect();
    };
    // source is derived from dims
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.L, dims.W, dims.H, running, selected.axis, selected.n]);
  const drag = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
  } | null>(null);
  const strip = Math.max(...analysis.modes.map((m) => m.hz)) * 1.08;
  const colour: Record<Axis, string> = {
    L: "#e6cf9c",
    W: "#6ec8eb",
    H: "#9fb4c3",
  };
  return (
    <section className="mode-cube" aria-labelledby="mode-cube-title">
      <div className="mode-cube-head">
        <div>
          <span className="eyebrow">Interactive · illustrative</span>
          <h3 id="mode-cube-title">Reflections & standing waves</h3>
        </div>
        <div className="mode-cube-controls">
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            aria-pressed={!running}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => setDims(initial)}>
            <RotateCcw size={14} />
            Reset to plan
          </button>
        </div>
      </div>
      <div className="mode-cube-layout">
        <div className="mode-canvas-wrap" ref={wrap}>
          <canvas
            ref={canvas}
            role="img"
            aria-label={`Wireframe room ${dims.L.toFixed(2)} by ${dims.W.toFixed(2)} by ${dims.H.toFixed(2)} metres with a sound source, reflecting rays and the ${AXIS_NAME[selected.axis].toLowerCase()} axial mode ${selected.n} standing wave. Drag to orbit.`}
            onPointerDown={(e) => {
              drag.current = { x: e.clientX, y: e.clientY, ...view.current };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              view.current.yaw =
                drag.current.yaw + (e.clientX - drag.current.x) * 0.008;
              view.current.pitch = Math.max(
                -0.2,
                Math.min(
                  1.35,
                  drag.current.pitch + (e.clientY - drag.current.y) * 0.006,
                ),
              );
              if (!running) drawRef.current();
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          />
          <div className="mode-legend">
            <span>
              <i className="lg-gold" />
              Direct sound
            </span>
            <span>
              <i className="lg-blue" />
              Reflections (incidence = reflection)
            </span>
            <span>
              <i className="lg-node" />
              Pressure node
            </span>
            <span>
              <i className="lg-anti" />
              Pressure antinode
            </span>
            <span className="muted">
              Drag to orbit · visual speed, not real time
            </span>
          </div>
        </div>
        <div className="mode-panel">
          {(["L", "W", "H"] as Axis[]).map((a) => {
            const limits = { L: [3, 20], W: [2.5, 16], H: [2.4, 8] }[a];
            return (
              <label key={a} className="mode-slider">
                <span>
                  {AXIS_NAME[a]} <b>{dims[a].toFixed(2)} m</b>
                </span>
                <input
                  type="range"
                  min={limits[0]}
                  max={limits[1]}
                  step={0.01}
                  value={dims[a]}
                  aria-label={`${AXIS_NAME[a]} in metres`}
                  onChange={(e) =>
                    setDims({ ...dims, [a]: Number(e.target.value) })
                  }
                />
              </label>
            );
          })}
          <div className="mode-quality" data-quality={analysis.quality}>
            <small>SPACING (FIRST FOUR AXIAL MODES PER AXIS)</small>
            <strong>{analysis.quality}</strong>
            <span>
              {analysis.coincidentPairs} coincident (≤ 1 %) ·{" "}
              {analysis.clusteredPairs} clustered (≤ 5 %) · H : W : L = 1 :{" "}
              {analysis.ratio[1].toFixed(2)} : {analysis.ratio[2].toFixed(2)}
            </span>
          </div>
          <svg
            className="mode-strip"
            viewBox="0 0 300 46"
            role="img"
            aria-label="Axial mode frequencies on a frequency axis"
          >
            <line x1="0" y1="30" x2="300" y2="30" stroke="#405a6c" />
            {analysis.modes.map((m) => (
              <g key={`${m.axis}${m.n}`}>
                <line
                  x1={(m.hz / strip) * 300}
                  x2={(m.hz / strip) * 300}
                  y1={m.flag ? 6 : 14}
                  y2="30"
                  stroke={m.flag ? "#ff9d7a" : colour[m.axis]}
                  strokeWidth={m.flag ? 2 : 1.2}
                />
              </g>
            ))}
            {[0, 50, 100, 150, 200]
              .filter((v) => v < strip)
              .map((v) => (
                <text
                  key={v}
                  x={(v / strip) * 300}
                  y="43"
                  fontSize="8"
                  fill="#7f97a8"
                >
                  {v} Hz
                </text>
              ))}
          </svg>
          <table className="mode-table">
            <thead>
              <tr>
                <th>Axis</th>
                {[1, 2, 3, 4].map((n) => (
                  <th key={n}>n={n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["L", "W", "H"] as Axis[]).map((a) => (
                <tr key={a}>
                  <th style={{ color: colour[a] }}>{a}</th>
                  {analysis.modes
                    .filter((m) => m.axis === a)
                    .sort((x, y) => x.n - y.n)
                    .map((m) => (
                      <td key={m.n}>
                        <button
                          type="button"
                          className={`mode-cell ${m.flag ?? ""} ${selected.axis === a && selected.n === m.n ? "selected" : ""}`}
                          onClick={() => setSelected({ axis: a, n: m.n })}
                          aria-label={`Show ${AXIS_NAME[a]} mode ${m.n}, ${m.hz.toFixed(1)} hertz${m.flag ? `, ${m.flag}` : ""}`}
                        >
                          {m.hz.toFixed(1)}
                        </button>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small muted">
            Hz · f = n·c / 2D, c = 343 m/s. Select a value to show its standing
            wave. Highlighted values are coincident or clustered with another
            axis.
          </p>
          <Badge status="Calculated" />
          <p className="small muted">
            Calculated (rectangular-room approximation): axial modes only, rigid
            parallel walls, no tangential/oblique modes, no absorption or
            irregular geometry. The animation is illustrative, not an acoustic
            simulation.
          </p>
        </div>
      </div>
    </section>
  );
}
