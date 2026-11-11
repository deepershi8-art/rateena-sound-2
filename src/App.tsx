import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Download,
  Upload,
  Globe,
  Check,
  FileText,
  X,
  Layers,
  ShieldCheck,
  PanelTop,
  AlertCircle,
} from "lucide-react";
import { Provider, useProject, download, cairoDate } from "./lib/store";
import { LanguageProvider, useI18n } from "./lib/i18n";
import { roomMetrics } from "./lib/geometry";
import { Brand, OfficialLogo } from "./components/Brand";
import { Knowledge } from "./components/Knowledge";
import { TechnicalStudy } from "./components/TechnicalStudy";
const modules = [
  "Tasks",
  "Milestones",
  "Engineering deliverables",
  "Dependencies",
  "Project risks",
  "Budget tracking",
  "Contractor coordination",
  "Document control",
  "Review & approval workflows",
];
function DataActions() {
  const { data, importData } = useProject();
  const { t } = useI18n();
  const ref = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const report = () => {
    const lines = [
      "# RATEENA SOUND 2 — preliminary technical report",
      "",
      `Generated: ${cairoDate(new Date().toISOString())}`,
      `Local revision R${String(data.revisions.at(-1)?.number ?? 0).padStart(3, "0")}`,
      "",
      "Architectural Drawing Pending — Geometry Not Yet Approved",
      "Building area: TBD. Not for construction.",
      "",
      "## Room programme",
    ];
    for (const r of data.rooms) {
      const m = roomMetrics(r);
      lines.push(
        `### ${r.name}`,
        `Dimensions ${r.length} × ${r.width} × ${r.height} m — Proposed`,
        `Area ${m.area.toFixed(2)} m²; volume ${m.volume.toFixed(2)} m³ — Calculated`,
        `H:W:L 1:${m.ratios[1].toFixed(3)}:${m.ratios[2].toFixed(3)} — Calculated`,
        ...m.modes.map(
          (a) =>
            `${a.axis} axial modes (n1–4): ${a.hz.map((v) => v.toFixed(1)).join(", ")} Hz — Calculated, rectangular-reference approximation`,
        ),
        `Source: ${r.evidence.source}`,
        `Method: L × W; L × W × H; ratios normalised to height; f = n × 343 / (2D)`,
        `Assumptions: ${r.evidence.assumptions} Speed of sound assumed 343 m/s; ideal rectangular boundary.`,
        `Date/revision: ${r.evidence.date} / R${r.evidence.revision}`,
        `Discipline: ${r.evidence.discipline}`,
        `Outstanding: ${r.evidence.validation}`,
        "",
      );
    }
    lines.push(
      "## Qualifications",
      "All heights are finished clear heights after isolation and treatment. Areas exclude circulation, sound locks, wall thickness, services and support rooms. Capacities, control-room and booth acoustics require validation.",
      "## Design targets",
      ...data.targets.map(
        (t) =>
          `${t.name}: ${t.target.value} — ${t.target.evidence.status}\nSource: ${t.target.evidence.source}\nMethod: ${t.target.evidence.method}\nAssumptions: ${t.target.evidence.assumptions}\nDate/revision: ${t.target.evidence.date} / R${t.target.evidence.revision}\nDiscipline: ${t.target.evidence.discipline}\nOutstanding: ${t.target.evidence.validation}`,
      ),
      "## Verification register",
      ...data.verification.map((v) => `${v.title} — ${v.stage}. ${v.note}`),
      "## References",
      ...data.references.map((r) => `${r.name}: ${r.scope} ${r.url ?? ""}`),
      "## Decisions",
      ...data.decisions.map((d) => `${cairoDate(d.date)} — ${d.text}`),
      "## Revisions",
      ...data.revisions.map(
        (r) => `R${r.number}: ${cairoDate(r.date)} — ${r.description}`,
      ),
    );
    download(
      "RATEENA-preliminary-report.md",
      lines.join("\n\n"),
      "text/markdown",
    );
    setMessage("Preliminary Markdown report exported.");
  };
  return (
    <>
      <div className="data-actions">
        <button
          title={t("export")}
          onClick={() => {
            download("RATEENA-project-v1.json", JSON.stringify(data, null, 2));
            setMessage("Version 1 project JSON exported.");
          }}
        >
          <Download size={14} />
          <span>{t("export")}</span>
        </button>
        <button title={t("import")} onClick={() => ref.current?.click()}>
          <Upload size={14} />
          <span>{t("import")}</span>
        </button>
        <button title={t("report")} onClick={report}>
          <FileText size={14} />
          <span>{t("report")}</span>
        </button>
        <input
          hidden
          type="file"
          accept=".json,application/json"
          ref={ref}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              if (f.size > 2_000_000)
                setMessage("Import failed: maximum file size is 2 MB.");
              else setPending(await f.text());
            }
            e.target.value = "";
          }}
        />
      </div>
      {message && (
        <div role="status" className="toast">
          {message}
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {pending !== null && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Import local project"
          >
            <div className="section-kicker">LOCAL DATA IMPORT</div>
            <h2>Replace the current project data?</h2>
            <p>
              Export a backup first if needed. Import preserves an audit entry;
              it does not approve geometry or create measurements.
            </p>
            <div className="modal-actions">
              <button onClick={() => setPending(null)}>Cancel</button>
              <button
                className="button gold-button"
                onClick={() => {
                  try {
                    importData(pending);
                    setMessage("Project imported and saved locally.");
                  } catch (e) {
                    setMessage(`Import failed: ${(e as Error).message}`);
                  }
                  setPending(null);
                }}
              >
                Import project
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
function Shell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { error, clearError } = useProject();
  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />
        <div className="header-right">
          <span className="local-indicator">
            <Check size={12} />
            {t("local")}
          </span>
        </div>
      </header>
      {error && (
        <div role="alert" className="error-banner">
          <AlertCircle size={16} />
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      {children}
      <footer className="app-footer">
        <span>
          RATEENA SOUND 2{" "}
          <span className="muted">/ A developing engineering platform</span>
        </span>
        <span>PRELIMINARY · NOT FOR CONSTRUCTION</span>
      </footer>
    </div>
  );
}
function Home() {
  const { t } = useI18n();
  return (
    <Shell>
      <main className="home">
        <div className="home-title">
          <div>
            <div className="section-kicker">THE PROJECT WORKSPACE</div>
            <h1>
              Built on sound.
              <br />
              <em>Grounded in science.</em>
            </h1>
            <p>
              A considered space for technical knowledge,
              <br />
              architectural thinking and engineering decisions.
            </p>
          </div>
          <div className="home-meta">
            <OfficialLogo className="home-official-logo" />
            <div className="meta-line" />
            <span>DEVELOPMENT EDITION</span>
            <small>Two facilities. Independent design journeys.</small>
          </div>
        </div>
        <section className="management-section" aria-labelledby="pm-title">
          <div className="home-section-heading">
            <div className="section-number">01</div>
            <BriefcaseBusiness size={20} />
            <h2 id="pm-title">{t("management")}</h2>
            <span className="construction-tag">{t("underConstruction")}</span>
          </div>
          <details className="management-expand">
            <summary>
              <span>Project operations, prepared for what comes next.</span>
              <span className="muted">
                Explore module structure <ChevronDown size={15} />
              </span>
            </summary>
            <div className="module-grid">
              {modules.map((m) => (
                <details key={m}>
                  <summary>
                    {m}
                    <ChevronDown size={13} />
                  </summary>
                  <p>No {m.toLowerCase()} recorded. Future integration.</p>
                </details>
              ))}
            </div>
          </details>
        </section>
        <section
          className="facilities-section"
          aria-labelledby="facilities-title"
        >
          <div className="home-section-heading">
            <div className="section-number">02</div>
            <BookOpen size={20} />
            <h2 id="facilities-title">{t("studyKnowledge")}</h2>
            <span className="small muted">TWO INDEPENDENT FACILITIES</span>
          </div>
          <div className="facility-grid">
            <Link
              to="/flagship/knowledge/sound"
              className="facility-card flagship-card"
            >
              <div className="card-top">
                <span className="phase-label">{t("phaseOne")}</span>
                <span className="priority">
                  <span />
                  {t("active")}
                </span>
              </div>
              <div className="facility-card-content">
                <span className="facility-index" aria-hidden="true">
                  01
                </span>
                <h3>Flagship Studio</h3>
                <p>
                  A focused recording facility.
                  <br />
                  The science, the spaces and the design decisions.
                </p>
                <div className="facility-tags">
                  <span>Knowledge book</span>
                  <span>Technical study</span>
                </div>
              </div>
              <div className="card-bottom">
                <span>{t("open")}</span>
                <ArrowUpRight size={20} />
              </div>
            </Link>
            <Link to="/centre" className="facility-card centre-card">
              <div className="card-top">
                <span className="phase-label">{t("phaseTwo")}</span>
                <span className="future-tag">{t("future")}</span>
              </div>
              <div className="facility-card-content">
                <span className="facility-index" aria-hidden="true">
                  02
                </span>
                <h3>RATEENA Sound Center</h3>
                <p>
                  A separate future facility.
                  <br />
                  An expandable framework, ready to develop.
                </p>
                <div className="facility-tags">
                  <span>Independent facility</span>
                  <span>Design pending</span>
                </div>
              </div>
              <div className="card-bottom">
                <span>{t("explore")}</span>
                <ArrowUpRight size={20} />
              </div>
            </Link>
          </div>
        </section>
      </main>
    </Shell>
  );
}
function Flagship() {
  const { t } = useI18n();
  return (
    <Shell>
      <div className="facility-bar">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={13} />
            {t("home")}
          </Link>
          <div className="facility-title">
            <span className="gold-line" />
            <h2>Flagship Studio</h2>
            <span>{t("phaseOne")}</span>
          </div>
        </div>
        <DataActions />
      </div>
      <div
        className="primary-tabs"
        role="navigation"
        aria-label="Flagship main tabs"
      >
        <NavLink
          to="/flagship/knowledge/sound"
          className={({ isActive }) =>
            isActive || location.hash.includes("/knowledge/") ? "active" : ""
          }
        >
          <BookOpen size={16} />
          {t("knowledge")}
        </NavLink>
        <NavLink
          to="/flagship/study/architectural"
          className={({ isActive }) =>
            isActive || location.hash.includes("/study/") ? "active" : ""
          }
        >
          <Building2 size={16} />
          {t("technicalStudy")}
        </NavLink>
        <span>INDEPENDENT FACILITY / PRELIMINARY DESIGN</span>
      </div>
      <Routes>
        <Route path="knowledge/:chapter?" element={<Knowledge />} />
        <Route path="study/:section?" element={<TechnicalStudy />} />
        <Route
          path="*"
          element={<Navigate to="/flagship/knowledge/sound" replace />}
        />
      </Routes>
    </Shell>
  );
}
function Centre() {
  const { t } = useI18n();
  return (
    <Shell>
      <main className="placeholder-page">
        <Link className="back-link" to="/">
          <ArrowLeft size={15} />
          {t("back")}
        </Link>
        <div className="section-kicker blue">
          PHASE TWO / SEPARATE FUTURE FACILITY
        </div>
        <h1>RATEENA Sound Center</h1>
        <p className="intro-text">
          A distinct facility. Its own study, geometry and project record.
        </p>
        <div className="notice">
          Future integration. No room programme, design, schedule or performance
          data has been created.
        </div>
        {[
          { icon: BookOpen, name: "Knowledge & technical references" },
          { icon: PanelTop, name: "Architectural design workspace" },
          { icon: Layers, name: "Room programme & engineering data" },
          { icon: ShieldCheck, name: "Verification & decisions" },
        ].map((m) => (
          <details className="tool-block" key={m.name}>
            <summary>
              <m.icon size={17} />
              {m.name}
            </summary>
            <p>
              Empty structure for Phase Two. Future integration; independent of
              Flagship Studio.
            </p>
          </details>
        ))}
        <Link className="text-button blue" to="/">
          {t("back")}
          <ArrowRight size={15} />
        </Link>
      </main>
    </Shell>
  );
}
export default function App() {
  return (
    <Provider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flagship/*" element={<Flagship />} />
            <Route path="/centre" element={<Centre />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </Provider>
  );
}
