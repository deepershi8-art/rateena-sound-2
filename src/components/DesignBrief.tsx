import { useProject } from "../lib/store";
import { Badge } from "./Engineering";
import { wavelength } from "../lib/modes";
const PHI = (1 + Math.sqrt(5)) / 2;
const LOW_E = 41.2; // E1, lowest open string of a standard four-string bass (12-TET, A4 = 440 Hz)
export function DesignBrief() {
  const { data } = useProject();
  const live = data.programme.find((r) => r.id === "live")!;
  const H = live.height;
  const ratio = H ? [1, live.width / H, live.length / H] : null;
  const lambda = wavelength(LOW_E);
  return (
    <section className="design-brief" aria-labelledby="design-brief-title">
      <div className="section-kicker">TECHNICAL STUDY / 00 · DESIGN BRIEF</div>
      <h2 id="design-brief-title">
        The reasoning <em className="gold">behind the room.</em>
      </h2>
      <div className="brief-grid">
        <article>
          <span className="brief-number">01</span>
          <h3>Proportion</h3>
          <p>
            The Main Live Room’s proportions are <b>informed by</b> golden-ratio
            proportioning, with the aim of spreading room modes more evenly.
            They are not an exact golden ratio.
          </p>
          <p className="brief-figure">
            {ratio ? (
              <>
                H : W : L = 1 : {ratio[1].toFixed(2)} : {ratio[2].toFixed(2)}
                <small>
                  {live.length.toFixed(2)} × {live.width.toFixed(2)} ×{" "}
                  {H!.toFixed(2)} m · reference φ = {PHI.toFixed(3)}, φ² ={" "}
                  {(PHI * PHI).toFixed(3)}
                </small>
              </>
            ) : (
              <>Clear height pending</>
            )}
          </p>
          <Badge status="Calculated" />
        </article>
        <article>
          <span className="brief-number">02</span>
          <h3>Ensemble capacity</h3>
          <p>
            The live room is sized for <b>up to 25 musicians</b>. This owner
            figure supersedes the earlier 12–15 reference and remains a design
            target, subject to layout, circulation, ventilation and egress
            validation.
          </p>
          <Badge status="Proposed" />
        </article>
        <article>
          <span className="brief-number">03</span>
          <h3>Length for the low end</h3>
          <p>
            The {live.length.toFixed(2)} m length gives low-frequency
            wavelengths room to develop. The low E of a bass guitar (≈
            {LOW_E} Hz) has a wavelength of ≈ {lambda.toFixed(2)} m at c = 343
            m/s.
          </p>
          <Badge status="Calculated" />
        </article>
        <article>
          <span className="brief-number">04</span>
          <h3>Height for air and clarity</h3>
          <p>
            The {H ? `${H.toFixed(2)} m ` : ""}height is intended to let upper
            frequencies and early reflections sound natural and comfortable
            rather than harsh and close. Final behaviour depends on treatment
            and remains to be designed and verified.
          </p>
          <Badge status="Proposed" />
        </article>
        <article className="brief-wide">
          <span className="brief-number">05</span>
          <h3>A central control room</h3>
          <p>
            The Control Room sits at the centre, between the Main Live Room and
            the isolation booths, with sight lines throughout: glazing to the
            live room (north), to the lounge (south), to the percussion booth
            (west) and to the bass / vocal booths (east), each window set in an
            otherwise solid isolating wall. Glazing is shown on the plan as
            proposed double / laminated glazing; no acoustic rating is specified
            yet.
          </p>
          <Badge status="Proposed" />
        </article>
      </div>
    </section>
  );
}
