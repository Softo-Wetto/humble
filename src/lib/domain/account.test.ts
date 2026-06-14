import { describe, expect, it } from "vitest";
import { calculateAge, isAdult } from "./account";

const today = new Date("2026-06-14T12:00:00.000Z");

describe("adult eligibility", () => {
  it("accepts a person on their eighteenth birthday", () => {
    expect(calculateAge("2008-06-14", today)).toBe(18);
    expect(isAdult("2008-06-14", today)).toBe(true);
  });

  it("rejects a person one day before their eighteenth birthday", () => {
    expect(calculateAge("2008-06-15", today)).toBe(17);
    expect(isAdult("2008-06-15", today)).toBe(false);
  });

  it("handles a birthday that has already occurred this year", () => {
    expect(calculateAge("2000-06-13", today)).toBe(26);
  });
});
