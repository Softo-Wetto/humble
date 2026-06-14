import { describe, expect, it } from "vitest";
import { validateComplimentDecision } from "./compliments";

const compliment = { recipientId: "recipient", status: "pending" as const };

describe("compliment decisions", () => {
  it("allows the recipient to accept a pending compliment", () => {
    expect(validateComplimentDecision("recipient", compliment, "accepted").success).toBe(true);
  });

  it("rejects decisions by anyone else", () => {
    expect(validateComplimentDecision("sender", compliment, "accepted").success).toBe(false);
  });

  it("rejects a second decision on a terminal compliment", () => {
    expect(validateComplimentDecision("recipient", { ...compliment, status: "accepted" }, "ignored").success).toBe(false);
  });
});
