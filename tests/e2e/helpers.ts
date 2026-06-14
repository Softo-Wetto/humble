import { expect, type Page } from "@playwright/test";

export const memberPassword = "HumbleLocal123!";

export async function logIn(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(memberPassword);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/discover$/);
}

export async function logOut(page: Page) {
  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/$/);
}
