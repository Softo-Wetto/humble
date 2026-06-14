import { describe, expect, it } from "vitest";
import { canSendMessage, countUnreadMessages } from "./chat";

const activeMatch = { participantOneId: "one", participantTwoId: "two", status: "active" as const };

describe("chat policy", () => {
  it("allows active match participants to send valid messages", () => {
    expect(canSendMessage("one", activeMatch, "Hello, I appreciated your compliment.").success).toBe(true);
  });

  it("rejects nonparticipants, ended matches, and blank messages", () => {
    expect(canSendMessage("three", activeMatch, "Hello there").success).toBe(false);
    expect(canSendMessage("one", { ...activeMatch, status: "unmatched" }, "Hello there").success).toBe(false);
    expect(canSendMessage("one", activeMatch, "   ").success).toBe(false);
  });

  it("counts only unread messages sent by the other participant", () => {
    expect(countUnreadMessages("one", [
      { senderId: "two", readAt: null },
      { senderId: "one", readAt: null },
      { senderId: "two", readAt: "2026-06-14T10:00:00Z" },
    ])).toBe(1);
  });
});
