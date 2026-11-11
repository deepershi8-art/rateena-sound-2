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
  it("has exactly two home sections and two independent facility links", async () => {
    await openRoute("/");
    expect(document.querySelectorAll("main.home>section")).toHaveLength(2);
    expect(document.querySelectorAll(".facility-card")).toHaveLength(2);
    expect(screen.getByText("Project Management")).toBeTruthy();
    expect(screen.getByText("Under Construction")).toBeTruthy();
    expect(screen.getByText("Flagship Studio")).toBeTruthy();
    expect(screen.getByText("RATEENA Sound Center")).toBeTruthy();
    expect(document.documentElement.dir).not.toBe("rtl");
  });
  it("opens the flagship on Knowledge with exactly two main tabs", async () => {
    await openRoute("/flagship");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Understanding Sound" }),
      ).toBeTruthy(),
    );
    expect(document.querySelectorAll(".primary-tabs>a")).toHaveLength(2);
    expect(screen.queryByText("Studio Introduction")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: /Reveal next principle/ }),
    );
    expect(screen.getByText("Airborne transmission")).toBeTruthy();
  });
  it("keeps the 02.1 lesson completely static", async () => {
    await openRoute("/flagship/knowledge/static-comparison");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Isolation & Treatment" }),
      ).toBeTruthy(),
    );
    const lesson = document.querySelector(".lesson")!;
    expect(
      lesson.querySelectorAll("button,input,select,audio,video,animate"),
    ).toHaveLength(0);
    expect(lesson.querySelectorAll("svg")).toHaveLength(1);
    expect(within(lesson as HTMLElement).getByText("Isolation")).toBeTruthy();
  });
  it("keeps plan empty and recalculates editable dimensions with a revision", async () => {
    await openRoute("/flagship/study/architectural");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Architectural Proposal" }),
      ).toBeTruthy(),
    );
    expect(
      screen.getByText(
        "Architectural Drawing Pending — Geometry Not Yet Approved",
      ),
    ).toBeTruthy();
    expect(document.querySelectorAll(".plan-canvas svg polygon")).toHaveLength(
      0,
    );
    fireEvent.change(screen.getByLabelText("Main Live Room length"), {
      target: { value: "10" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Save preliminary dimensions/ }),
    );
    await waitFor(() => {
      const d = JSON.parse(localStorage.getItem("rateena-sound-2:v1")!);
      expect(d.rooms[0].length).toBe(10);
      expect(d.revisions).toHaveLength(1);
    });
    expect(screen.getByText("74.20")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("115%")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Drawing scale"), {
      target: { value: "50" },
    });
    expect(
      (screen.getByLabelText("Drawing scale") as HTMLSelectElement).value,
    ).toBe("50");
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
    const d = JSON.parse(localStorage.getItem("rateena-sound-2:v1")!);
    expect(d.decisions).toHaveLength(1);
    expect(d.revisions).toHaveLength(1);
  });
});
