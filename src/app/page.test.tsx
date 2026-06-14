import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "./page";

it("introduces compliment-first connection", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", {
      name: /meet through what you appreciate/i,
    }),
  ).toBeInTheDocument();
  const signupLinks = screen.getAllByRole("link", { name: /join humble/i });
  expect(signupLinks.length).toBeGreaterThan(0);
  signupLinks.forEach((link) => expect(link).toHaveAttribute("href", "/signup"));
});
