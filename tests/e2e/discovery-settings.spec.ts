import { expect, test } from "@playwright/test";
import { logIn } from "./helpers";

test("passing on a profile is private and reversible", async ({ page }) => {
  await logIn(page, "alex@humble.local");

  const firstCard = page.locator(".discovery-grid .discovery-card").first();
  const name = (await firstCard.getByRole("heading").textContent())?.split(",")[0] ?? "Hidden profile";
  await firstCard.getByRole("button", { name: "Not for me" }).click();
  await expect(page.locator(".discovery-grid .discovery-card").filter({ hasText: name })).toHaveCount(0);

  await page.goto("/settings/hidden-profiles");
  const hiddenProfile = page.getByText(name, { exact: true });
  await expect(hiddenProfile).toBeVisible();
  await hiddenProfile.locator("xpath=ancestor::article").getByRole("button", { name: "Restore to discovery" }).click();
  await expect(hiddenProfile).toBeHidden();
});
