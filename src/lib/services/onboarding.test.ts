import { describe, expect, it } from "vitest";
import { onboardingSchema } from "./onboarding";

const valid = {
  displayName: "Maya",
  city: "West End",
  region: "Queensland",
  gender: "woman",
  pronouns: "she/her",
  interestedIn: ["man", "nonbinary"],
  minimumAge: 25,
  maximumAge: 38,
  bio: "I care about community gardens, generous tables, and making time for the people around me.",
  interests: ["Gardening", "Cooking"],
  values: ["Kindness", "Community"],
  photoCount: 1,
};

describe("onboarding completion", () => {
  it("accepts a complete profile", () => {
    expect(onboardingSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["photo", { ...valid, photoCount: 0 }],
    ["bio", { ...valid, bio: "Too short" }],
    ["interest", { ...valid, interests: [] }],
    ["dating preference", { ...valid, interestedIn: [] }],
    ["age range", { ...valid, minimumAge: 40, maximumAge: 25 }],
  ])("rejects a profile missing a valid %s", (_label, input) => {
    expect(onboardingSchema.safeParse(input).success).toBe(false);
  });
});
