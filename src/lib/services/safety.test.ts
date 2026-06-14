import { expect, it } from "vitest";
import { buildEvidenceSnapshot, relationshipEndState } from "./safety";

it("maps blocks and unmatches to distinct relationship states", () => {
  expect(relationshipEndState("block")).toBe("blocked");
  expect(relationshipEndState("unmatch")).toBe("unmatched");
});

it("copies report evidence so later edits cannot mutate it", () => {
  const content = { body: "Original message", sender: "user-a" };
  const snapshot = buildEvidenceSnapshot(content);
  content.body = "Edited message";
  expect(snapshot.body).toBe("Original message");
});
