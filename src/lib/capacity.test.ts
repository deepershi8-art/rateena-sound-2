import { describe, it, expect } from "vitest";
import { normaliseData, upgradeLegacy } from "./migration";
import { initialData } from "../data/initial";
describe("Live room capacity update (owner, 11 Nov 2026)", () => {
  it("replaces only the untouched earlier defaults", () => {
    const d = upgradeLegacy(initialData);
    d.rooms[0].capacity = "12–15 musicians";
    d.programme[0].capacity =
      "To be validated against the equipment layout and circulation.";
    const n = normaliseData(d);
    expect(n.rooms[0].capacity).toMatch(/Up to 25/);
    expect(n.programme[0].capacity).toMatch(/up to 25 musicians/);
    d.rooms[0].capacity = "Owner edited";
    expect(normaliseData(d).rooms[0].capacity).toBe("Owner edited");
  });
});
