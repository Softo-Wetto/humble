import { expect, test } from "@playwright/test";
import { logIn, logOut } from "./helpers";

test("an accepted compliment opens a calm conversation", async ({ page }) => {
  await logIn(page, "theo@humble.local");
  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Theo, 31" })).toBeVisible();
  await page.goto("/matches");
  let activeMatch = page.locator(".match-list > a").filter({ hasText: "Open conversation" });

  if ((await activeMatch.count()) === 0) {
    await page.goto("/compliments");
    const acceptButton = page.getByRole("button", { name: "Accept and match" });
    await expect(acceptButton).toBeVisible();
    const [decisionResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/compliments/") && response.url().endsWith("/decision")),
      acceptButton.click(),
    ]);
    expect(decisionResponse.ok(), await decisionResponse.text()).toBe(true);
    await page.goto("/matches");
    activeMatch = page.locator(".match-list > a").filter({ hasText: "Open conversation" });
  }

  await expect(activeMatch).toBeVisible();
  await activeMatch.click();
  await expect(page.getByRole("heading", { name: "Maya" })).toBeVisible();
  await page.getByLabel("Message Maya").fill("Your community garden sounds like a lovely thing to build together.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Your community garden sounds like a lovely thing to build together.")).toBeVisible();

  await logOut(page);
});
