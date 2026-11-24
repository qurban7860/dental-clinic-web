import { test, expect } from "@playwright/test";

test("navigates the primary application routes", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.goto("/doctors");
  await expect(page.getByRole("heading", { name: "Doctors" })).toBeVisible();
  await page.goto("/appointments");
  await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();
});
