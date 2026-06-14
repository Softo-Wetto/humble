import { describe, expect, it } from "vitest";
import { canTransitionCompliment, complimentBodySchema } from "./compliment";

describe("compliment policy", () => {
  it.each(["accepted", "ignored", "reported", "withdrawn"] as const)(
    "allows pending to transition to %s",
    (next) => expect(canTransitionCompliment("pending", next)).toBe(true),
  );

  it("does not allow terminal states to change", () => {
    expect(canTransitionCompliment("accepted", "ignored")).toBe(false);
    expect(canTransitionCompliment("reported", "accepted")).toBe(false);
  });

  it("requires a sincere amount of custom text", () => {
    expect(complimentBodySchema.safeParse("Nice").success).toBe(false);
    expect(
      complimentBodySchema.safeParse("Your care for your community really stood out to me.").success,
    ).toBe(true);
  });
});
