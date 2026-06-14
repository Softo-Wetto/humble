import { describe, expect, it } from "vitest";
import { validateSignup } from "./signup";

const currentDate = new Date("2026-06-14T12:00:00.000Z");
const valid = {
  email: "new@humble.local",
  password: "A-kind-password-123",
  passwordConfirm: "A-kind-password-123",
  birthDate: "1998-04-20",
  acceptedPolicies: true,
};

describe("signup validation", () => {
  it("accepts a valid adult registration", () => {
    expect(validateSignup(valid, currentDate).success).toBe(true);
  });

  it("rejects underage registration", () => {
    const result = validateSignup({ ...valid, birthDate: "2008-06-15" }, currentDate);
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords and missing policy acceptance", () => {
    const result = validateSignup(
      { ...valid, passwordConfirm: "different", acceptedPolicies: false },
      currentDate,
    );
    expect(result.success).toBe(false);
  });
});
