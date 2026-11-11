import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
const wave = (x: number, y: number, w: number, amp: number, cycles = 3) =>
  Array.from(
    { length: 160 },
    (_, i) =>
      `${i ? "L" : "M"}${(x + (w * i) / 159).toFixed(2)},${(y + amp * Math.sin((i / 159) * Math.PI * 2 * cycles)).toFixed(2)}`,
  ).join(" ");
export function Sketch({
  kind,
  stage = 2,
  staticOnly = false,
}: {
  kind: string;
  stage?: number;
  staticOnly?: boolean;
}) {
  const reduced = useReducedMotion();
  const draw = (d: string, delay = 0) =>
    staticOnly || reduced ? (
      <path d={d} />
    ) : (
      <motion.path
        d={d}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay, ease: "easeInOut" }}
      />
    );
  let art: ReactNode;
  if (kind === "wave")
    art = (
      <>
        <path d="M72 200L108 180V300L72 280H50V200Z" />
        <path d="M112 177L133 161V319L112 302" opacity=".35" />
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={0.9 - i * 0.22}>
            {draw(
              `M${155 + i * 38} ${194 - i * 25}Q${200 + i * 43} 240 ${155 + i * 38} ${286 + i * 25}`,
              i * 0.2,
            )}
          </g>
        ))}
        <path d="M365 105V365M379 105V365M397 105V365" />
        {draw(wave(410, 240, 210, 27), 0.7)}
        <text x="51" y="125">
          SOURCE
        </text>
        <text x="180" y="355">
          PRESSURE WAVE
        </text>
        <text x="344" y="83">
          BOUNDARY
        </text>
        <text x="476" y="355">
          TRANSMITTED ENERGY
        </text>
        {stage > 0 && (
          <g>
            {draw("M90 305V395H580L610 375", 0.4)}
            <path d="M85 389L103 402M180 389L198 402M280 389L298 402M380 389L398 402M480 389L498 402" />
            <text x="232" y="433">
              STRUCTURE-BORNE PATH
            </text>
          </g>
        )}
        {stage > 1 && (
          <>
            <path d="M360 106L385 95L402 107" />
            <text x="434" y="137">
              VIBRATION → RE-RADIATION
            </text>
          </>
        )}
      </>
    );
  else if (kind === "compare" || kind === "static")
    art = (
      <>
        <text x="75" y="73">
          ISOLATION
        </text>
        <text x="411" y="73">
          TREATMENT
        </text>
        <path d="M45 105H302V370H45ZM370 105H652V370H370" opacity=".3" />
        <path d="M171 105V370M183 105V370M204 105V370M216 105V370" />
        {draw(wave(65, 235, 100, 28))}
        <path d="M230 235H277" strokeDasharray="3 8" />
        <path
          d="M391 121H422V172H391ZM590 166H630V268H590ZM459 328H558V350H459"
          fill="currentColor"
          fillOpacity=".12"
        />
        {draw("M435 280L595 180L532 123L411 181L530 300L600 265")}
        <circle cx="435" cy="280" r="10" />
        <text x="70" y="411">
          BETWEEN SPACES
        </text>
        <text x="417" y="411">
          WITHIN A SPACE
        </text>
      </>
    );
  else if (kind === "geometry" || kind === "volume")
    art = (
      <>
        {draw(
          "M159 151L405 113L564 203L322 250ZM159 151V318L322 408L564 354V203M322 250V408",
        )}
        <path
          d="M405 113V280L159 318M405 280L564 354"
          strokeDasharray="5 7"
          opacity=".35"
        />
        <path d="M137 150V318M129 150H145M129 318H145M165 345L310 429M338 430L576 374" />
        <text x="72" y="236">
          HEIGHT
        </text>
        <text x="185" y="410">
          WIDTH
        </text>
        <text x="452" y="418">
          LENGTH
        </text>
        <text x="238" y="72">
          REFERENCE ENVELOPE — NOT A PLAN
        </text>
      </>
    );
  else if (kind === "modes")
    art = (
      <>
        <path d="M80 130V360M620 130V360M80 245H620" opacity=".35" />
        {[0, 1, 2].map((n) => (
          <g key={n} opacity={1 - n * 0.25}>
            {draw(wave(80, 245, 540, 70, n + 1), n * 0.3)}
          </g>
        ))}
        <text x="86" y="94">
          IDEAL RECTANGULAR AXIS
        </text>
        <text x="227" y="410">
          NODES / ANTINODES — SCHEMATIC
        </text>
      </>
    );
  else if (kind === "decay")
    art = (
      <>
        <path d="M95 83V381H625" />
        {draw("M100 113Q170 209 230 248T380 324T610 363")}
        <path
          d="M100 142Q250 240 330 263T610 319M100 186Q200 270 320 334T610 375"
          opacity=".35"
        />
        <text x="102" y="62">
          RELATIVE ENERGY
        </text>
        <text x="528" y="415">
          TIME →
        </text>
        <text x="331" y="137">
          ILLUSTRATION, NOT MEASURED DATA
        </text>
      </>
    );
  else if (kind === "hvac")
    art = (
      <>
        {draw("M83 159H257V202H436V137H617M83 235H213V278H503V212H617")}
        <path d="M273 207V271M290 207V271M310 207V271M330 207V271M350 207V271" />
        <circle cx="103" cy="197" r="27" />
        <path d="M88 184L117 210M88 210L117 184M526 212V358M552 212V358M510 358H568" />
        <text x="258" y="334">
          ATTENUATION + VIBRATION CONTROL
        </text>
        <text x="86" y="107">
          SERVICES PATH — SCHEMATIC
        </text>
      </>
    );
  else if (kind === "isolation")
    art = (
      <>
        {draw(
          "M94 368V109H603V368M124 368V139H573V368M157 368V174H539V368M94 368H603",
        )}
        <path
          d="M124 340H157M539 340H573M124 368V390M157 368V390M539 368V390M573 368V390"
          strokeDasharray="2 5"
        />
        <text x="220" y="232">
          INDEPENDENT INNER SHELL
        </text>
        <text x="232" y="407">
          NO UNDESIGNED RIGID BRIDGES
        </text>
        <text x="84" y="72">
          CONCEPT ONLY — NOT A CONSTRUCTION DETAIL
        </text>
      </>
    );
  else if (kind === "verification")
    art = (
      <>
        {[0, 1, 2, 3, 4].map((n) => (
          <g key={n}>
            <circle cx={100 + n * 125} cy="235" r="25" />
            {n < 4 && draw(`M${126 + n * 125} 235H${197 + n * 125}`, n * 0.2)}
            <text x={100 + n * 125} y="300" textAnchor="middle">
              {
                ["PROPOSED", "CALCULATED", "SIMULATED", "MEASURED", "VERIFIED"][
                  n
                ]
              }
            </text>
          </g>
        ))}
        <text x="197" y="120">
          EVIDENCE MATURITY ≠ AUTOMATIC APPROVAL
        </text>
      </>
    );
  else
    art = (
      <>
        <path d="M110 135H592V370H110Z" opacity=".4" />
        {draw("M195 310L518 170L397 140L157 210L350 362L557 292")}
        <circle cx="195" cy="310" r="13" />
        <path
          d={
            kind === "variable"
              ? "M255 142V188M274 142V188M293 142V188M312 142V188"
              : "M520 158L540 185L520 212L540 239L520 266"
          }
        />
        <text x="190" y="80">
          {kind === "variable"
            ? "ADJUSTABLE ACOUSTIC SURFACES"
            : "DIRECT AND REFLECTED PATHS"}
        </text>
        <text x="190" y="427">
          SCHEMATIC — NOT A PREDICTED RESPONSE
        </text>
      </>
    );
  return (
    <svg
      className="sketch"
      viewBox="0 0 700 480"
      role="img"
      aria-label={`${kind} technical principle illustration`}
    >
      <defs>
        <pattern
          id={`draft-${kind}`}
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0H0V25"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".07"
            strokeWidth=".6"
          />
        </pattern>
      </defs>
      <rect
        width="700"
        height="480"
        fill={`url(#draft-${kind})`}
        stroke="none"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {art}
      </g>
      <path
        d="M20 40V20H40M660 20H680V40M680 440V460H660M40 460H20V440"
        stroke="currentColor"
        strokeOpacity=".4"
        fill="none"
      />
    </svg>
  );
}
