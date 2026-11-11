import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MoveUpRight, BookOpen } from "lucide-react";
import { chapters } from "../data/chapters";
import { Sketch } from "./Sketch";
import { References } from "./Engineering";
import { IsolationModel, IsolationAssemblyNotes } from "./IsolationModel";
import { EditableNote } from "./StudyFields";
import { ImageSlot } from "./ImageSlot";
import { ModeCube } from "./ModeCube";
import { useProject } from "../lib/store";
interface Group {
  id: string;
  folio: string;
  title: string;
  intro: string;
  diagram: string;
  topics: string[];
  aliases?: string[];
  study?: { section: string; label: string };
  appendix?: boolean;
}
const groups: Group[] = [
  {
    id: "sound",
    folio: "01",
    title: "Understanding Sound",
    intro:
      "Sound is a mechanical pressure disturbance travelling through air and structure. In buildings, distinguish airborne noise from vibration carried through the structure: both paths matter.",
    diagram: "wave",
    topics: ["sound"],
  },
  {
    id: "sound-isolation",
    folio: "02",
    title: "Stopping Sound — Isolation",
    intro:
      "Isolation keeps sound in and noise out. Mass, decoupling, damping and floating construction are complementary techniques within one integrated Room-in-Room / Box-in-Box design, not competing grades.",
    diagram: "isolation",
    topics: ["isolation", "isolation-treatment", "static-comparison"],
  },
  {
    id: "internal-acoustics",
    folio: "03",
    title: "Acoustic Treatment",
    aliases: ["acoustic-treatment"],
    intro:
      "Treatment shapes how sound behaves inside the room — through absorption, diffusion and controlled reflection. It is not isolation: it does not stop sound leaving the room.",
    diagram: "reflections",
    topics: ["geometry", "modes", "volume", "reflections", "decay", "variable"],
  },
  {
    id: "hvac",
    folio: "04",
    title: "HVAC & Conditioning",
    intro:
      "A studio must breathe quietly. Air must be supplied and extracted without duct noise, cross-talk between rooms or plant vibration. NC-15 remains a Proposed aspiration, not an achieved result.",
    diagram: "isolation",
    topics: ["hvac"],
    study: { section: "hvac", label: "Open HVAC and Environmental Control" },
  },
  {
    id: "infrastructure",
    folio: "05",
    title: "Equipment Infrastructure",
    intro:
      "Electrical distribution, earthing, audio wiring, patching, data networks and lighting must be coordinated with the isolation design, so that no service penetration bridges an isolated construction.",
    diagram: "verification",
    topics: [],
    study: {
      section: "audio",
      label: "Open Electrical, Audio and Network Infrastructure",
    },
  },
  {
    id: "equipment",
    folio: "06",
    title: "Equipment",
    intro:
      "Equipment planning follows the rooms and their uses. No equipment package has been selected yet; the plan’s instruments and furniture are typical-size references only.",
    diagram: "verification",
    topics: [],
    study: { section: "equipment", label: "Open Equipment Planning" },
  },
  {
    id: "terminology",
    folio: "A",
    appendix: true,
    title: "Appendix A — Acoustic Terminology",
    intro:
      "These terms describe different acoustic phenomena. A single-number rating is not a full design brief, and a proposed target is not a measured result.",
    diagram: "decay",
    topics: [],
  },
  {
    id: "standards",
    folio: "B",
    appendix: true,
    title: "Appendix B — International Standards",
    intro:
      "ISO, IEC, ITU-R and EBU references have different scopes. Select applicable documents and editions with the consultant; listing a reference does not establish compliance.",
    diagram: "verification",
    topics: ["verification"],
  },
];
const isolationTopics = [
  [
    "mass",
    "Mass",
    "Heavier, denser constructions are harder for sound to set into vibration. Mass alone gives diminishing returns, especially at low frequencies.",
  ],
  [
    "decoupling",
    "Decoupling",
    "Separating inner and outer constructions — independent framing, resilient supports and an air cavity — interrupts the structural path. A single rigid bridge can short-circuit it. Damping reduces resonant build-up within the leaves.",
  ],
  [
    "floating",
    "Floating construction",
    "An inner floor, and where required its walls, supported on resilient elements selected for the loads and the frequencies of concern. The support type is an engineering decision; springs are not assumed.",
  ],
  [
    "box-in-box",
    "Box-in-box (room-in-room)",
    "The integrated strategy: an inner room built within the structural shell, combining mass, decoupling, damping, airtightness and floating construction where each critical room needs it.",
  ],
];
const treatmentTopics = [
  [
    "absorption",
    "Absorption",
    "Converts part of the incident sound energy into heat. Porous materials work mainly at mid and high frequencies; low frequencies need deep or resonant absorbers.",
  ],
  [
    "diffusion",
    "Diffusion",
    "Scatters reflections in time and direction, keeping energy in the room while softening strong discrete echoes.",
  ],
  [
    "reflection",
    "Reflection",
    "Hard surfaces return sound specularly — the angle of incidence equals the angle of reflection. Controlled reflections add life; parallel hard surfaces can cause flutter echoes and reinforce room modes.",
  ],
];
function TopicCards({
  prefix,
  topics,
}: {
  prefix: string;
  topics: string[][];
}) {
  return (
    <div className="topic-cards">
      {topics.map(([id, title, text], i) => (
        <article className="topic-card" key={id} id={`topic-${id}`}>
          <span className="principle-no">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <ImageSlot
            slotKey={`knowledge:${prefix}:${id}`}
            title={`${title} — illustration`}
            placeholder={`${title} image – to be uploaded`}
          />
        </article>
      ))}
    </div>
  );
}
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
    groups.find((g) => g.id === chapter || g.aliases?.includes(chapter)) ??
    groups.find((g) => g.topics.includes(chapter)) ??
    groups[0];
  const index = groups.indexOf(group);
  const { data } = useProject();
  const live = data.programme.find((r) => r.id === "live")!;
  const retained =
    chapter !== group.id &&
    !group.aliases?.includes(chapter) &&
    chapters.find((c) => c.id === chapter);
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
          {groups.map((g) => (
            <button
              key={g.id}
              className={`chapter-link ${g.id === group.id ? "selected" : ""} ${g.appendix ? "appendix-link" : ""}`}
              onClick={() => move(g.id)}
            >
              <span>{g.folio}</span>
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
          <span>
            KNOWLEDGE / {group.appendix ? "APPENDIX" : "CHAPTER"} {group.folio}
          </span>
          <span>FLAGSHIP STUDIO · PHASE ONE</span>
        </div>
        <div className="chapter-heading">
          <span className="folio-number" aria-hidden="true">
            {group.folio}
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
              <>
                <RetainedTopic id="sound" />
                <ImageSlot
                  slotKey="knowledge:sound"
                  title="Sound — illustration"
                  placeholder="Sound image – to be uploaded"
                />
              </>
            ) : group.id === "sound-isolation" ? (
              <>
                <TopicCards prefix="isolation" topics={isolationTopics} />
                <IsolationModel />
                <IsolationAssemblyNotes />
              </>
            ) : group.id === "internal-acoustics" ? (
              <>
                <TopicCards prefix="treatment" topics={treatmentTopics} />
                <ModeCube
                  initial={{
                    L: live.length,
                    W: live.width,
                    H: live.height ?? 4.5,
                  }}
                />
              </>
            ) : group.id === "hvac" ? (
              <RetainedTopic id="hvac" />
            ) : group.id === "infrastructure" || group.id === "equipment" ? (
              <ImageSlot
                slotKey={`knowledge:${group.id}`}
                title={`${group.title} — illustration`}
                placeholder={`${group.title} image – to be uploaded`}
              />
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
            {group.study && (
              <button
                className="text-button study-jump"
                onClick={() =>
                  navigate(`/flagship/study/${group.study!.section}`)
                }
              >
                {group.study.label} <MoveUpRight size={14} />
              </button>
            )}
            {group.topics
              .filter((t) => t !== "sound" && t !== "hvac")
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
          <span>
            {group.folio} / {groups.length}
          </span>
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
