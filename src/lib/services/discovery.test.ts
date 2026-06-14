import { expect, it } from "vitest";
import { filterDiscoveryCandidates } from "./discovery";

const viewer = { userId: "viewer", age: 30, gender: "woman", interestedIn: ["man"], minimumAge: 25, maximumAge: 36 };
const candidates = [
  { userId: "later", age: 32, gender: "man", interestedIn: ["woman"], minimumAge: 25, maximumAge: 40, isPublished: true, hasPhoto: true, accountState: "active" as const, updatedAt: "2026-06-13" },
  { userId: "earlier", age: 29, gender: "man", interestedIn: ["woman"], minimumAge: 25, maximumAge: 40, isPublished: true, hasPhoto: true, accountState: "active" as const, updatedAt: "2026-06-14" },
  { userId: "hidden", age: 30, gender: "man", interestedIn: ["woman"], minimumAge: 25, maximumAge: 40, isPublished: true, hasPhoto: true, accountState: "active" as const, updatedAt: "2026-06-15" },
];

it("filters exclusions and orders discovery deterministically", () => {
  const result = filterDiscoveryCandidates(viewer, candidates, { blockedIds: [], hiddenIds: ["hidden"] });
  expect(result.map((candidate) => candidate.userId)).toEqual(["earlier", "later"]);
});
