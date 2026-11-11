// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";
import { initialData } from "./data/initial";
beforeEach(() => {
  window.matchMedia = (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
  localStorage.clear();
  window.location.hash = "#/";
});
afterEach(() => cleanup());
async function openRoute(path: string) {
  window.location.hash = "#" + path;
  render(<App />);
  await waitFor(() => expect(window.location.hash).toContain(path));
}
describe("Application structure and interactions", () => {
  it("opens on a logo-only splash that continues to the gateway on tap or key", async () => {
    await openRoute("/");
    const splash = document.querySelector(".splash") as HTMLElement;
    expect(splash.querySelectorAll("img")).toHaveLength(1);
    expect(splash.querySelectorAll("a,button,input,select")).toHaveLength(0);
    expect(splash.textContent?.trim()).toBe("Tap anywhere");
    fireEvent.click(splash);
    await waitFor(() => expect(window.location.hash).toBe("#/gateway"));
    expect(document.querySelectorAll(".gateway-option")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Studio Management" }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "RATEENA SOUND" })).toBeTruthy();
    expect(document.documentElement.dir).not.toBe("rtl");
  });
  it("continues from the splash with the keyboard", async () => {
    await openRoute("/");
    fireEvent.keyDown(document.querySelector(".splash")!, { key: "Enter" });
    await waitFor(() => expect(window.location.hash).toBe("#/gateway"));
  });
  it("shows only the studio graphic plan slot in Studio Management", async () => {
    await openRoute("/management");
    expect(
      screen.getByText("Studio graphic plan – to be uploaded"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Add image/ })).toBeTruthy();
    expect(screen.queryByText("Under Construction")).toBeNull();
    expect(screen.queryByText("Tasks")).toBeNull();
  });
  it("lists exactly the two RATEENA SOUND projects", async () => {
    await openRoute("/rateena");
    expect(document.querySelectorAll(".facility-card")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: /RATEENA SOUND.*FLAGSHIP STUDIO/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /RATEENA SOUND.*CENTER/ }),
    ).toBeTruthy();
    expect(document.querySelector(".flagship-card")?.getAttribute("href")).toBe(
      "#/flagship/study/architectural",
    );
  });
  it("lands the flagship on the design brief and plan, with two main tabs", async () => {
    await openRoute("/flagship");
    await waitFor(() =>
      expect(window.location.hash).toBe("#/flagship/study/architectural"),
    );
    expect(document.querySelectorAll(".primary-tabs>a")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: /reasoning/ })).toBeTruthy();
    expect(screen.getAllByText(/up to 25 musicians/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1 : 1.85 : 2.67/)).toBeTruthy();
    expect(screen.getByText("Owner 2D plan – to be uploaded")).toBeTruthy();
    expect(document.querySelectorAll("[data-window]")).toHaveLength(6);
    expect(screen.queryByText("Studio Introduction")).toBeNull();
  });
  it("orders Knowledge chapters with appendices last and keeps progressive reveals", async () => {
    await openRoute("/flagship/knowledge/sound");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Understanding Sound" }),
      ).toBeTruthy(),
    );
    const titles = [...document.querySelectorAll(".chapter-link b")].map(
      (b) => b.textContent,
    );
    expect(titles).toEqual([
      "Understanding Sound",
      "Stopping Sound — Isolation",
      "Acoustic Treatment",
      "HVAC & Conditioning",
      "Equipment Infrastructure",
      "Equipment",
      "Appendix A — Acoustic Terminology",
      "Appendix B — International Standards",
    ]);
    fireEvent.click(
      screen.getByRole("button", { name: /Reveal next principle/ }),
    );
    expect(screen.getByText("Airborne transmission")).toBeTruthy();
  });
  it("shows the treatment cube with calculated axial modes", async () => {
    await openRoute("/flagship/knowledge/acoustic-treatment");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Acoustic Treatment" }),
      ).toBeTruthy(),
    );
    expect(
      screen.getByRole("heading", { name: "Reflections & standing waves" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Length mode 1, 14.3 hertz/ }),
    ).toBeTruthy();
    expect(screen.getByText("Some clustering")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Width in metres"), {
      target: { value: "6" },
    });
    expect(
      screen.getByRole("button", {
        name: /Width mode 1, 28.6 hertz, coincident/,
      }),
    ).toBeTruthy();
    expect(screen.getByText("Coincident modes")).toBeTruthy();
  });
  it("keeps the 02.1 lesson completely static", async () => {
    await openRoute("/flagship/knowledge/static-comparison");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Isolation & Treatment" }),
      ).toBeTruthy(),
    );
    const lesson = document.querySelector(".static-lesson")!;
    expect(
      lesson.querySelectorAll("button,input,select,audio,video,animate"),
    ).toHaveLength(0);
    expect(lesson.querySelectorAll("svg")).toHaveLength(1);
    expect(within(lesson as HTMLElement).getByText("Isolation")).toBeTruthy();
  });
  it("draws eight true-scale rooms and recalculates editable dimensions with a revision", async () => {
    await openRoute("/flagship/study/architectural");
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /Floor Plan/ })).toBeTruthy(),
    );
    expect(document.querySelectorAll("[data-room-envelope]")).toHaveLength(8);
    expect(screen.getAllByRole("tab")).toHaveLength(7);
    expect(
      document
        .querySelector('[data-room-envelope="bass"]')
        ?.getAttribute("width"),
    ).toBe("3");
    fireEvent.change(screen.getByLabelText("Main Live Room length"), {
      target: { value: "10" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Save preliminary dimensions/ }),
    );
    await waitFor(() => {
      const d = JSON.parse(localStorage.getItem("rateena-sound-2:v2")!);
      expect(d.programme[0].length).toBe(10);
      expect(d.revisions).toHaveLength(1);
    });
    expect(document.querySelector(".current-stats")?.textContent).toContain(
      "83.30",
    );
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(
      document.querySelector(".metre-plan svg")?.getAttribute("viewBox"),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText("SVG physical export scale"), {
      target: { value: "50" },
    });
    expect(
      (screen.getByLabelText("SVG physical export scale") as HTMLSelectElement)
        .value,
    ).toBe("50");
    expect(
      screen.getByText("Proposed 0.90 m lounge-to-studio access door"),
    ).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Metre grid"));
    expect(document.querySelectorAll(".metric-grid")).toHaveLength(9);
  });
  it("records a design decision and maintains its audit trail", async () => {
    await openRoute("/flagship/study/decisions");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Decisions & revisions" }),
      ).toBeTruthy(),
    );
    fireEvent.change(screen.getByLabelText("Record design rationale"), {
      target: { value: "Compare candidate proportions before approval." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Record decision" }));
    expect(
      screen.getByText("Compare candidate proportions before approval."),
    ).toBeTruthy();
    const d = JSON.parse(localStorage.getItem("rateena-sound-2:v2")!);
    expect(d.decisions).toHaveLength(1);
    expect(d.revisions).toHaveLength(1);
  });
  it("preserves old browser data while adding the new programme", async () => {
    const old = structuredClone(initialData);
    old.rooms[0].length = 11.1;
    const original = JSON.stringify(old);
    localStorage.setItem("rateena-sound-2:v1", original);
    await openRoute("/");
    expect(localStorage.getItem("rateena-sound-2:v1")).toBe(original);
    const upgraded = JSON.parse(localStorage.getItem("rateena-sound-2:v2")!);
    expect(upgraded.rooms[0].length).toBe(11.1);
    expect(upgraded.programme).toHaveLength(8);
  });
  it("does not overwrite corrupt saved browser data", async () => {
    localStorage.setItem("rateena-sound-2:v2", "{broken");
    await openRoute("/gateway");
    expect(localStorage.getItem("rateena-sound-2:v2")).toBe("{broken");
    expect(screen.getByRole("alert").textContent).toContain("left untouched");
  });
  it("keeps the construction geometry fixed across the three reveal stages", async () => {
    await openRoute("/flagship/knowledge/sound-isolation");
    const model = document.querySelector(".isolation-model")!;
    const first = model.querySelector("polygon")!.getAttribute("points");
    fireEvent.click(
      within(model as HTMLElement).getByRole("button", {
        name: /02 Independent inner envelope/,
      }),
    );
    expect(model.querySelector("polygon")!.getAttribute("points")).toBe(first);
    fireEvent.click(
      within(model as HTMLElement).getByRole("button", {
        name: /03 Floating construction/,
      }),
    );
    expect(model.querySelector("polygon")!.getAttribute("points")).toBe(first);
    expect(model.textContent).toContain("not assumed");
  });
  it("has all five expandable Center workspaces without invented specifications", async () => {
    await openRoute("/centre");
    expect(
      document.querySelectorAll(".placeholder-page>.tool-block"),
    ).toHaveLength(5);
    expect(
      screen.getByText("Additional Recording Studios — Coming Later"),
    ).toBeTruthy();
  });
});
