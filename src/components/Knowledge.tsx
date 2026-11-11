import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MoveUpRight, BookOpen } from "lucide-react";
import { chapters } from "../data/chapters";
import { Sketch } from "./Sketch";
import { References } from "./Engineering";
import { IsolationModel, IsolationAssemblyNotes } from "./IsolationModel";
import { EditableNote } from "./StudyFields";
const groups = [
  {
    id: "sound",
    title: "Understanding Sound",
    intro:
      "Sound is a mechanical pressure disturbance. In buildings, distinguish airborne noise from vibration transmitted through the structure: both paths matter.",
    diagram: "wave",
    topics: ["sound"],
  },
  {
    id: "sound-isolation",
    title: "Sound Isolation",
    intro:
      "An integrated Room-in-Room / Box-in-Box design controls transmission. Mass–Decoupling–Damping and Floating Construction are complementary techniques within that design, not three competing grades.",
    diagram: "isolation",
    topics: ["isolation", "isolation-treatment", "static-comparison", "hvac"],
  },
  {
    id: "internal-acoustics",
    title: "Internal Acoustics",
    intro:
      "Absorption, diffusion and reflection shape sound inside a room. Geometry, room modes, bass control and reverberation must be studied together; treatment is not sound isolation.",
    diagram: "reflections",
    topics: ["geometry", "modes", "volume", "reflections", "decay", "variable"],
  },
  {
    id: "terminology",
    title: "Acoustic Terminology",
    intro:
      "These terms describe different acoustic phenomena. A single-number rating is not a full design brief, and a proposed target is not a measured result.",
    diagram: "decay",
    topics: [],
  },
  {
    id: "standards",
    title: "International Standards",
    intro:
      "ISO, IEC, ITU-R and EBU references have different scopes. Select applicable documents and editions with the consultant; listing a reference does not establish compliance.",
    diagram: "verification",
    topics: ["verification"],
  },
];
const terms = [
  [
    "RT60",
    "Time corresponding to a 60 dB decay in reverberant sound level. Band, method and test conditions matter; extrapolated decay estimates must be identified.",
  ],
  [
    "NC",
    "Noise Criteria curves used to assess background-noise spectra. NC-15 here remains a Proposed aspiration, not an achieved result.",
  ],
  [
    "NR",
    "Noise Rating curves used to characterise background noise. NR and NC are different systems and are not automatically interchangeable.",
  ],
  [
    "STC",
    "Sound Transmission Class, an ASTM single-number airborne-isolation rating. It does not describe all low-frequency or flanking behaviour.",
  ],
  [
    "Rw",
    "Weighted sound reduction index under the relevant ISO framework. Test conditions and spectral adaptation terms matter; it is not simply identical to STC.",
  ],
  [
    "SPL",
    "Sound pressure level in decibels relative to 20 µPa in air. Frequency weighting, time weighting, position and bandwidth must be stated.",
  ],
  [
    "Transmission loss",
    "Frequency-dependent reduction through a separating element under defined conditions. Field paths and junctions can limit the installed system.",
  ],
  [
    "Frequency response",
    "Variation of system or room response with frequency, dependent on source, receiver positions and measurement method.",
  ],
];
function RetainedTopic({ id }: { id: string }) {
  const c = chapters.find((c) => c.id === id);
  const [revealed, setRevealed] = useState(1);
  const navigate = useNavigate();
  if (!c) return <p>Additional illustration pending.</p>;
  const isStatic = c.id === "static-comparison";
  return (
    <div className={`retained-topic lesson ${isStatic ? "static-lesson" : ""}`}>
      <p className="chapter-subtitle">{c.subtitle}</p>
      <div className="drawing-surface">
        <div className="drawing-topline">
          <span>RETAINED STUDY / {c.number}</span>
          <span>
            {isStatic ? "STATIC ILLUSTRATION" : "CONCEPTUAL · NOT TO SCALE"}
          </span>
        </div>
        <Sketch kind={c.diagram} stage={revealed} staticOnly={isStatic} />
        <div className="drawing-caption">
          <span>BLUE INK STUDIES</span>
          <span>RATEENA / KNOWLEDGE SERIES</span>
        </div>
      </div>
      <div className="principles">
        {c.principles.map(
          (p, i) =>
            (isStatic || i < revealed) && (
              <div className="principle" key={p.label}>
                <span className="principle-no">0{i + 1}</span>
                <div>
                  <h3>{p.label}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ),
        )}
        {!isStatic && revealed < c.principles.length && (
          <button
            className="text-button cyan"
            onClick={() => setRevealed((v) => v + 1)}
          >
            Reveal next principle <ArrowRight size={15} />
          </button>
        )}
        <div className="design-link">
          <span className="section-kicker">FROM PRINCIPLE TO DESIGN</span>
          <p>{c.decision}</p>
          {!isStatic && (
            <button
              className="text-button"
              onClick={() => navigate("/flagship/study/architectural")}
            >
              Open Technical Study <MoveUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export function Knowledge() {
  const { chapter = "sound" } = useParams();
  const navigate = useNavigate();
  const group =
    groups.find((g) => g.id === chapter) ??
    groups.find((g) => g.topics.includes(chapter)) ??
    groups[0];
  const index = groups.indexOf(group);
  const retained =
    chapter !== group.id && chapters.find((c) => c.id === chapter);
  const move = (id: string) => navigate(`/flagship/knowledge/${id}`);
  return (
    <div className="book-layout">
      <aside className="book-index">
        <div className="rail-heading">
          <BookOpen size={15} />
          THE KNOWLEDGE BOOK
        </div>
        <p className="muted small">The science behind the space.</p>
        <nav aria-label="Knowledge chapters">
          {groups.map((g, i) => (
            <button
              key={g.id}
              className={`chapter-link ${g.id === group.id ? "selected" : ""}`}
              onClick={() => move(g.id)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{g.title}</b>
              {g.id === group.id && <span className="chapter-dot" />}
            </button>
          ))}
        </nav>
        <div className="rail-foot">
          ENGINEERING PRINCIPLES
          <br />
          <span>Illustrations, not simulations.</span>
        </div>
      </aside>
      <article className="book-page">
        <div className="section-kicker">
          <span>KNOWLEDGE / CHAPTER {String(index + 1).padStart(2, "0")}</span>
          <span>FLAGSHIP STUDIO · PHASE ONE</span>
        </div>
        <div className="chapter-heading">
          <span className="folio-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h1>{retained ? retained.title : group.title}</h1>
            <p className="chapter-subtitle">{group.intro}</p>
          </div>
        </div>
        {retained ? (
          <RetainedTopic key={retained.id} id={retained.id} />
        ) : (
          <>
            {group.id === "sound" ? (
              <RetainedTopic id="sound" />
            ) : group.id === "sound-isolation" ? (
              <>
                <IsolationModel />
                <IsolationAssemblyNotes />
              </>
            ) : (
              <div className="drawing-surface">
                <div className="drawing-topline">
                  <span>PRINCIPLE SKETCH</span>
                  <span>ILLUSTRATIVE / NOT A RESULT</span>
                </div>
                <Sketch kind={group.diagram} stage={3} />
              </div>
            )}
            {group.id === "terminology" && (
              <div className="terminology-list">
                {terms.map(([term, text]) => (
                  <details className="tool-block" key={term} open>
                    <summary>{term}</summary>
                    <p>{text}</p>
                  </details>
                ))}
              </div>
            )}
            {group.id === "internal-acoustics" && (
              <p className="notice">
                No room-specific treatment quantities, numerical decay targets
                or performance results are approved. The following original
                studies are preserved for reference.
              </p>
            )}
            {group.id === "standards" && <References />}
            {group.topics
              .filter((t) => t !== "sound")
              .map((id) => (
                <details className="tool-block retained-study" key={id}>
                  <summary>
                    {chapters.find((c) => c.id === id)?.number} ·{" "}
                    {chapters.find((c) => c.id === id)?.title ?? id}
                  </summary>
                  <RetainedTopic id={id} />
                </details>
              ))}
            <details className="tool-block">
              <summary>
                Additional material / progressive content integration
              </summary>
              <p>
                Actual illustrations, documents and room-specific findings can
                be added as the technical study develops. Missing engineering
                results remain pending.
              </p>
              <EditableNote
                noteKey={`knowledge:${group.id}`}
                label={`${group.title} additional content`}
              />
            </details>
          </>
        )}
        <footer className="book-footer">
          <button disabled={!index} onClick={() => move(groups[index - 1].id)}>
            <ArrowLeft size={15} />
            Previous chapter
          </button>
          <span>{String(index + 1).padStart(2, "0")} / 05</span>
          <button
            disabled={index === groups.length - 1}
            onClick={() => move(groups[index + 1].id)}
          >
            Next chapter
            <ArrowRight size={15} />
          </button>
        </footer>
      </article>
    </div>
  );
}
