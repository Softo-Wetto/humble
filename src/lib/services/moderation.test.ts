import { expect, it } from "vitest";
import { buildModerationAudit, canModerate } from "./moderation";

it("allows only administrators to moderate", () => {
  expect(canModerate("admin")).toBe(true);
  expect(canModerate("member")).toBe(false);
});

it("captures the actor, reason, and state transition", () => {
  expect(buildModerationAudit({ administratorId: "admin", targetUserId: "user", action: "suspend", reason: "Safety review", beforeState: { account: "active" }, afterState: { account: "suspended" } })).toEqual({ administrator: "admin", target_user: "user", action: "suspend", target_type: "user", target_record: "", reason: "Safety review", before_state: { account: "active" }, after_state: { account: "suspended" } });
});
