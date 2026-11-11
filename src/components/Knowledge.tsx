import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MoveUpRight, BookOpen } from "lucide-react";
import { chapters } from "../data/chapters";
import { Sketch } from "./Sketch";
export function Knowledge() {
  const { chapter = "sound" } = useParams();
  const navigate = useNavigate();
  const c = chapters.find((c) => c.id === chapter) ?? chapters[0];
  const index = chapters.indexOf(c);
  const [revealed, setRevealed] = useState(1);
  const isStatic = c.id === "static-comparison";
  const move = (id: string) => {
    setRevealed(1);
    navigate(`/flagship/knowledge/${id}`);
  };
  return (
    <div className="book-layout">
      <aside className="book-index">
        <div className="rail-heading">
          <BookOpen size={15} /> THE KNOWLEDGE BOOK
        </div>
        <p className="muted small">The science behind the space.</p>
        <nav aria-label="Knowledge chapters">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              className={`chapter-link ${c.id === ch.id ? "selected" : ""}`}
              onClick={() => move(ch.id)}
            >
              <span>{ch.number}</span>
              <b>{ch.title}</b>
              {ch.id === c.id && <span className="chapter-dot" />}
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
          <span>KNOWLEDGE / CHAPTER {c.number}</span>
          <span>FLAGSHIP STUDIO · PHASE ONE</span>
        </div>
        <h1>{c.title}</h1>
        <p className="chapter-subtitle">{c.subtitle}</p>
        <div className={`lesson ${isStatic ? "static-lesson" : ""}`}>
          <div className="drawing-surface">
            <div className="drawing-topline">
              <span>PRINCIPLE SKETCH / {c.number}</span>
              <span>
                {isStatic ? "STATIC ILLUSTRATION" : "CONCEPTUAL · NOT TO SCALE"}
              </span>
            </div>
            <Sketch
              key={c.id}
              kind={c.diagram}
              stage={revealed}
              staticOnly={isStatic}
            />
            <div className="drawing-caption">
              <span>BLUE INK STUDIES</span>
              <span>RATEENA / KNOWLEDGE SERIES</span>
            </div>
          </div>
          <div className="principles">
            <div className="section-kicker">THE ESSENTIALS</div>
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
        <footer className="book-footer">
          <button
            disabled={!index}
            onClick={() => move(chapters[index - 1].id)}
          >
            <ArrowLeft size={15} />
            Previous chapter
          </button>
          <span>{c.number} / 11</span>
          <button
            disabled={index === chapters.length - 1}
            onClick={() => move(chapters[index + 1].id)}
          >
            Next chapter
            <ArrowRight size={15} />
          </button>
        </footer>
      </article>
    </div>
  );
}
