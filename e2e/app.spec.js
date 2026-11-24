import { test, expect } from "@playwright/test";

test("navigates the primary application routes", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/dashboard.png", fullPage: true });
  await page.goto("/doctors");
  await expect(page.getByRole("heading", { name: "Doctors" })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/doctors.png", fullPage: true });
  await page.goto("/appointments");
  await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/appointments.png", fullPage: true });
});

test("creates, edits, and deletes a doctor through the UI", async ({ page }) => {
  const stamp = Date.now();
  const originalName = `E2E Doctor ${stamp}`;
  const updatedName = `E2E Updated ${stamp}`;

  await page.goto("/doctors");
  await page.getByRole("button", { name: "Add doctor" }).click();
  await page.getByLabel("Full name").fill(originalName);
  await page.getByRole("textbox", { name: "Specialization", exact: true }).fill("General Dentistry");
  await page.getByLabel("Phone").fill("+1 555-017-700");
  await page.getByLabel("Email").fill(`e2e.${stamp}@fictional.example`);
  await page.getByLabel("Availability").fill("Mon-Fri 9:00 AM-5:00 PM");
  await page.getByRole("button", { name: "Save doctor" }).click();
  await expect(page.getByRole("status")).toContainText("Doctor created successfully");

  await page.getByLabel("Search doctors").fill(originalName);
  await expect(page.getByText(originalName)).toBeVisible();
  await page.getByRole("button", { name: `Edit ${originalName}` }).click();
  await page.getByLabel("Full name").fill(updatedName);
  await page.getByRole("button", { name: "Save doctor" }).click();
  await expect(page.getByRole("status")).toContainText("Doctor updated successfully");

  await page.getByLabel("Search doctors").fill(updatedName);
  await expect(page.getByText(updatedName)).toBeVisible();
  await page.getByRole("button", { name: `Delete ${updatedName}` }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Doctor deleted successfully");
});

test("creates, edits, updates status, and deletes an appointment through the UI", async ({ page }) => {
  const stamp = Date.now();
  const patientName = `E2E Patient ${stamp}`;
  const date = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  await page.goto("/appointments");
  await page.getByRole("button", { name: "New appointment" }).click();
  await page.getByLabel("Patient name").fill(patientName);
  await page.getByLabel("Patient contact").fill("+1 555-027-700");
  await page.getByRole("dialog").getByRole("combobox").nth(0).selectOption({ label: "Dr. Maya Chen — Orthodontics" });
  await page.getByLabel("Appointment date").fill(date);
  await page.getByLabel("Start time").fill("16:30");
  await page.getByRole("dialog").getByRole("combobox").nth(1).selectOption("30");
  await page.getByLabel("Reason").fill("E2E database verification");
  await page.getByRole("button", { name: "Save appointment" }).click();
  await expect(page.getByRole("status")).toContainText("Appointment created successfully");

  await page.getByLabel("Search appointments").fill(patientName);
  await expect(page.getByText(patientName)).toBeVisible();
  await page.getByRole("button", { name: `Edit appointment for ${patientName}` }).click();
  await page.getByRole("dialog").getByRole("combobox").nth(2).selectOption("CONFIRMED");
  await page.getByRole("button", { name: "Save appointment" }).click();
  await expect(page.getByRole("status")).toContainText("Appointment updated successfully");

  await page.getByLabel("Search appointments").fill(patientName);
  await page.getByRole("button", { name: `Delete appointment for ${patientName}` }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Appointment deleted successfully");
});
