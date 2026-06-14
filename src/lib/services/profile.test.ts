import { expect, it } from "vitest";
import { profileUpdateSchema } from "./profile";

const valid = {
  displayName: "Maya",
  city: "West End",
  region: "Queensland",
  gender: "woman",
  pronouns: "she/her",
  bio: "I care about community gardens, generous tables, and making time for the people around me.",
  interests: ["Gardening", "Cooking"],
  values: ["Kindness", "Community"],
  interestedIn: ["man", "nonbinary"],
  minimumAge: 25,
  maximumAge: 38,
};

it("accepts a complete editable profile", () => {
  expect(profileUpdateSchema.safeParse(valid).success).toBe(true);
});

it("rejects an inverted age range or empty values", () => {
  expect(
    profileUpdateSchema.safeParse({
      ...valid,
      minimumAge: 40,
      maximumAge: 25,
      values: [],
    }).success,
  ).toBe(false);
});
