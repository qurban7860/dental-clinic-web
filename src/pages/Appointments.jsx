import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { PageHeader, Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/common";

const today = new Date().toISOString().slice(0, 10);
const empty = { patientName: "", patientContact: "", doctorId: "", appointmentDate: today, startTime: "09:00", duration: 30, reason: "", status: "PENDING" };
const statuses = ["PENDING", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [form, setForm] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (doctorId) params.set("doctorId", doctorId);
      if (date) params.set("date", date);
      params.set("limit", "100");
      const [appointmentData, doctorData] = await Promise.all([api.appointments(`?${params}`), api.doctors("?limit=100")]);
      setItems(appointmentData.items);
      setDoctors(doctorData.items.filter(d => d.isActive));
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [search, status, doctorId, date]);

  function openCreate() { setForm({ ...empty }); }
  function openEdit(a) {
    const start = new Date(a.startTime);
    setForm({
      ...a,
      appointmentDate: a.appointmentDate.slice(0, 10),
      startTime: `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
      duration: Math.round((new Date(a.endTime) - start) / 60000),
      doctorId: a.doctorId,
    });
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (form.id) await api.updateAppointment(form.id, form); else await api.createAppointment(form);
      setNotice(form.id ? "Appointment updated successfully" : "Appointment created successfully");
      setForm(null); await load();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function confirmDelete() {
    setBusy(true);
    try { await api.deleteAppointment(remove.id); setRemove(null); setNotice("Appointment deleted successfully"); await load(); }
    catch (e) { setError(e.message); setRemove(null); } finally { setBusy(false); }
  }

  return <>
    <PageHeader title="Appointments" subtitle="Schedule and manage patient visits" action={<button className="button" onClick={openCreate}><Plus />New appointment</button>} />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {error && <div className="inline-error" role="alert">{error}</div>}
    <section className="panel">
      <div className="toolbar appointment-toolbar"><input aria-label="Search appointments" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select><select aria-label="Filter by doctor" value={doctorId} onChange={e => setDoctorId(e.target.value)}><option value="">All doctors</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select><input aria-label="Filter by date" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
      {loading ? <Loading text="Loading appointments..." /> : items.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Reason</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map(a => <tr key={a.id}><td><strong>{a.patientName}</strong><small>{a.patientContact}</small></td><td>{a.doctor.name}</td><td><strong>{new Date(a.appointmentDate).toLocaleDateString()}</strong><small>{new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</small></td><td>{a.reason}</td><td><StatusBadge status={a.status} /></td><td><div className="row-actions"><button className="icon-button" aria-label={`Edit appointment for ${a.patientName}`} onClick={() => openEdit(a)}><Pencil /></button><button className="icon-button danger-text" aria-label={`Delete appointment for ${a.patientName}`} onClick={() => setRemove(a)}><Trash2 /></button></div></td></tr>)}</tbody></table></div> : <EmptyState title={search || status || doctorId || date ? "No matching appointments" : "No appointments yet"} text={search || status || doctorId || date ? "Try changing your filters." : "Schedule the first patient appointment."} action={!search && !status && !doctorId && !date && <button className="button" onClick={openCreate}>New appointment</button>} />}
    </section>
    {form && <Modal title={form.id ? "Edit appointment" : "New appointment"} onClose={() => setForm(null)}><form onSubmit={submit}><div className="form-grid"><label>Patient name<input required minLength="2" maxLength="100" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} /></label><label>Patient contact<input required minLength="7" maxLength="40" value={form.patientContact} onChange={e => setForm({ ...form, patientContact: e.target.value })} /></label><label className="full">Doctor<select required value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}><option value="">Select a doctor</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}</select></label><label>Appointment date<input required type="date" min={today} value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} /></label><label>Start time<input required type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></label><label>Duration<select value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}>{[15,30,45,60,90,120].map(n => <option key={n} value={n}>{n} minutes</option>)}</select></label><label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label className="full">Reason<textarea required minLength="3" maxLength="500" rows="3" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setForm(null)}>Cancel</button><button className="button" disabled={busy}>{busy ? "Saving..." : "Save appointment"}</button></div></form></Modal>}
    {remove && <ConfirmDialog title="Delete appointment" message={`Delete the appointment for ${remove.patientName}?`} onClose={() => setRemove(null)} onConfirm={confirmDelete} loading={busy} />}
  </>;
}
