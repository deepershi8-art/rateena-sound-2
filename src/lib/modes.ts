export const SPEED_OF_SOUND = 343;
export type Axis = "L" | "W" | "H";
export interface AxialMode {
  axis: Axis;
  n: number;
  hz: number;
  flag: "coincident" | "clustered" | null;
}
export interface ModeAnalysis {
  modes: AxialMode[];
  coincidentPairs: number;
  clusteredPairs: number;
  quality: "Even spacing" | "Some clustering" | "Coincident modes";
  ratio: [number, number, number];
}
/** Axial mode frequency of a rigid-walled rectangular room: f = n·c / 2D. */
export function axialMode(dimension: number, n: number, c = SPEED_OF_SOUND) {
  if (!(dimension > 0) || !(n > 0))
    throw new Error("Dimension and order must be positive.");
  return (n * c) / (2 * dimension);
}
/** Coincident: within 1 %; clustered: within 5 % (illustrative thresholds). */
export const COINCIDENT = 0.01;
export const CLUSTERED = 0.05;
export function analyseAxialModes(
  dims: { L: number; W: number; H: number },
  orders = 4,
  c = SPEED_OF_SOUND,
): ModeAnalysis {
  const modes: AxialMode[] = [];
  (["L", "W", "H"] as Axis[]).forEach((axis) => {
    for (let n = 1; n <= orders; n++)
      modes.push({ axis, n, hz: axialMode(dims[axis], n, c), flag: null });
  });
  let coincidentPairs = 0;
  let clusteredPairs = 0;
  const rank = { coincident: 2, clustered: 1 } as const;
  for (let i = 0; i < modes.length; i++)
    for (let j = i + 1; j < modes.length; j++) {
      const a = modes[i];
      const b = modes[j];
      if (a.axis === b.axis) continue;
      const rel = Math.abs(a.hz - b.hz) / Math.min(a.hz, b.hz);
      const flag =
        rel <= COINCIDENT
          ? "coincident"
          : rel <= CLUSTERED
            ? "clustered"
            : null;
      if (!flag) continue;
      if (flag === "coincident") coincidentPairs++;
      else clusteredPairs++;
      for (const m of [a, b])
        if (!m.flag || rank[flag] > rank[m.flag]) m.flag = flag;
    }
  modes.sort((a, b) => a.hz - b.hz);
  const quality = coincidentPairs
    ? "Coincident modes"
    : clusteredPairs
      ? "Some clustering"
      : "Even spacing";
  return {
    modes,
    coincidentPairs,
    clusteredPairs,
    quality,
    ratio: [1, dims.W / dims.H, dims.L / dims.H],
  };
}
/** Pressure node positions (fraction of the dimension) for axial order n. */
export function pressureNodes(n: number) {
  return Array.from({ length: n }, (_, k) => (2 * k + 1) / (2 * n));
}
export function wavelength(hz: number, c = SPEED_OF_SOUND) {
  return c / hz;
}
