import { describe, expect, it } from "vitest";
import { isDiscoverable } from "./discovery";

const viewer = {
  userId: "viewer",
  age: 30,
  gender: "woman",
  interestedIn: ["man", "nonbinary"],
  minimumAge: 26,
  maximumAge: 36,
};

const candidate = {
  userId: "candidate",
  age: 31,
  gender: "man",
  interestedIn: ["woman"],
  minimumAge: 27,
  maximumAge: 40,
  isPublished: true,
  hasPhoto: true,
  accountState: "active" as const,
};

describe("discovery policy", () => {
  it("allows mutually compatible visible profiles", () => {
    expect(isDiscoverable(viewer, candidate, { blockedIds: [], hiddenIds: [] })).toBe(true);
  });

  it.each([
    ["the current user", { ...candidate, userId: "viewer" }, { blockedIds: [], hiddenIds: [] }],
    ["an incomplete profile", { ...candidate, hasPhoto: false }, { blockedIds: [], hiddenIds: [] }],
    ["a paused profile", { ...candidate, accountState: "paused" as const }, { blockedIds: [], hiddenIds: [] }],
    ["a blocked profile", candidate, { blockedIds: ["candidate"], hiddenIds: [] }],
    ["a privately hidden profile", candidate, { blockedIds: [], hiddenIds: ["candidate"] }],
  ])("excludes %s", (_label, profile, exclusions) => {
    expect(isDiscoverable(viewer, profile, exclusions)).toBe(false);
  });

  it("requires mutual gender interest", () => {
    expect(
      isDiscoverable(viewer, { ...candidate, interestedIn: ["man"] }, { blockedIds: [], hiddenIds: [] }),
    ).toBe(false);
  });

  it("requires both users to fit each other's age range", () => {
    expect(
      isDiscoverable(viewer, { ...candidate, minimumAge: 31 }, { blockedIds: [], hiddenIds: [] }),
    ).toBe(false);
  });
});
