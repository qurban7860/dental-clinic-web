const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({ success: false, message: "The server returned an invalid response" }));
  if (!response.ok) throw new Error(body.message || "Request failed");
  return body.data;
}

export const api = {
  dashboard: () => request("/dashboard"),
  doctors: (params = "") => request(`/doctors${params}`),
  doctor: (id) => request(`/doctors/${id}`),
  createDoctor: (data) => request("/doctors", { method: "POST", body: JSON.stringify(data) }),
  updateDoctor: (id, data) => request(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDoctor: (id) => request(`/doctors/${id}`, { method: "DELETE" }),
  appointments: (params = "") => request(`/appointments${params}`),
  appointment: (id) => request(`/appointments/${id}`),
  createAppointment: (data) => request("/appointments", { method: "POST", body: JSON.stringify(data) }),
  updateAppointment: (id, data) => request(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: "DELETE" }),
};
