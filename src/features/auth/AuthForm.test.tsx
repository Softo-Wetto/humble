import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AuthForm } from "./AuthForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

it("explains adult eligibility during signup", () => {
  render(<AuthForm mode="signup" />);

  expect(screen.getByLabelText(/date of birth/i)).toHaveAttribute("type", "date");
  expect(screen.getByText(/you must be 18 or older/i)).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: /community expectations/i })).toBeInTheDocument();
});

it("keeps login focused on existing account credentials", () => {
  render(<AuthForm mode="login" />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/date of birth/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});
