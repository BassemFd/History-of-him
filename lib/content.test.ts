import { describe, it, expect } from "vitest";
import { projects, experience } from "./content";

describe("content ordering", () => {
  it("sorts projects newest year first", () => {
    const years = projects.map((p) => p.year);
    const sorted = [...years].sort((a, b) => b.localeCompare(a));
    expect(years).toEqual(sorted);
  });

  it("floats the present role to the top of experience", () => {
    const presentIndex = experience.findIndex((e) => e.end === "present");
    if (presentIndex !== -1) expect(presentIndex).toBe(0);
  });
});
