import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  api: {
    dashboard: vi.fn(async () => ({ totalDoctors: 6, upcomingAppointments: 12, todayAppointments: 3, pendingAppointments: 2, appointments: [] })),
    doctors: vi.fn(async () => ({ items: [] })),
    appointments: vi.fn(async () => ({ items: [] })),
  },
}));

describe("Application navigation", () => {
  it("renders dashboard metrics", async () => {
    render(<MemoryRouter initialEntries={["/dashboard"]}><App /></MemoryRouter>);
    expect(await screen.findByText("Total Doctors")).toBeInTheDocument();
    expect(screen.getByText("Upcoming appointments")).toBeInTheDocument();
  });

  it("renders doctors empty state", async () => {
    render(<MemoryRouter initialEntries={["/doctors"]}><App /></MemoryRouter>);
    expect(await screen.findByText("No doctors yet")).toBeInTheDocument();
  });

  it("renders unknown route", () => {
    render(<MemoryRouter initialEntries={["/unknown"]}><App /></MemoryRouter>);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
