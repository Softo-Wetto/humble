import { expect, test } from "@playwright/test";

test("a new adult member can create and publish a profile", async ({ page }) => {
  const email = `e2e-${Date.now()}@humble.local`;

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("HumbleE2E123!");
  await page.getByLabel("Confirm password").fill("HumbleE2E123!");
  await page.getByLabel("Date of birth").fill("1995-04-12");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create my profile" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("Display name").fill("Taylor");
  await page.getByLabel("City").fill("Brisbane");
  await page.getByLabel("Region").fill("Queensland");
  await page.getByLabel("Gender identity").fill("nonbinary");
  await page.getByLabel("Pronouns").fill("they/them");
  await page.getByLabel("woman", { exact: true }).check();
  await page.getByLabel("man", { exact: true }).check();
  await page.getByLabel("Bio").fill("Thoughtful home cook who enjoys small galleries, river walks, and making time for close friends.");
  await page.getByLabel(/Interests/).fill("Cooking, galleries, river walks");
  await page.getByLabel(/Values/).fill("Kindness, curiosity, community");
  await page.getByLabel("Choose profile photos").setInputFiles({
    name: "taylor.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="100%" height="100%" fill="#8a7469"/></svg>'),
  });
  await page.getByRole("button", { name: "Enter discovery" }).click();

  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.getByRole("heading", { name: /who would you like to know/i })).toBeVisible();
});
