import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { PageHeader, Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/common";

const empty = { name: "", specialization: "", phone: "", email: "", availability: "", isActive: true };

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (specialization) params.set("specialization", specialization);
      if (status) params.set("status", status);
      const data = await api.doctors(`?${params}`);
      setItems(data.items);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [search, specialization, status]);

  function openCreate() { setForm({ ...empty }); }
  function openEdit(d) { setForm({ ...d }); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (form.id) await api.updateDoctor(form.id, form); else await api.createDoctor(form);
      setNotice(form.id ? "Doctor updated successfully" : "Doctor created successfully");
      setForm(null); await load();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function confirmDelete() {
    setBusy(true);
    try { await api.deleteDoctor(remove.id); setRemove(null); setNotice("Doctor deleted successfully"); await load(); }
    catch (e) { setError(e.message); setRemove(null); } finally { setBusy(false); }
  }

  return <>
    <PageHeader title="Doctors" subtitle="Manage clinic providers and availability" action={<button className="button" onClick={openCreate}><Plus />Add doctor</button>} />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {error && <div className="inline-error" role="alert">{error}</div>}
    <section className="panel">
      <div className="toolbar"><input aria-label="Search doctors" placeholder="Search by doctor name..." value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Filter specialization" value={specialization} onChange={e => setSpecialization(e.target.value)}><option value="">All specializations</option>{[...new Set(items.map(d => d.specialization))].map(s => <option key={s}>{s}</option>)}</select><select aria-label="Filter status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      {loading ? <Loading text="Loading doctors..." /> : error ? <div className="error-state"><p>{error}</p><button className="button" onClick={load}>Retry</button></div> : items.length ? <div className="table-wrap"><table><thead><tr><th>Doctor</th><th>Specialization</th><th>Contact</th><th>Availability</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map(d => <tr key={d.id}><td><strong>{d.name}</strong><small>{d.email}</small></td><td>{d.specialization}</td><td>{d.phone}</td><td>{d.availability}</td><td><StatusBadge status={d.isActive ? "active" : "inactive"} /></td><td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${d.name}`} onClick={() => openEdit(d)}><Pencil /></button><button className="icon-button danger-text" aria-label={`Delete ${d.name}`} onClick={() => setRemove(d)}><Trash2 /></button></div></td></tr>)}</tbody></table></div> : <EmptyState title={search || specialization || status ? "No matching doctors" : "No doctors yet"} text={search || specialization || status ? "Try changing your search or filters." : "Add the first doctor to begin scheduling."} action={!search && !specialization && !status && <button className="button" onClick={openCreate}>Add doctor</button>} />}
    </section>
    {form && <Modal title={form.id ? "Edit doctor" : "Add doctor"} onClose={() => setForm(null)}><form onSubmit={submit}><div className="form-grid"><label>Full name<input required minLength="2" maxLength="100" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Specialization<input required minLength="2" maxLength="100" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></label><label>Phone<input required pattern="[+()\\d][\\d\\s()+-]{7,24}" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label className="full">Availability<input required minLength="2" maxLength="300" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} /></label><label className="checkbox full"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Active doctor</label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setForm(null)}>Cancel</button><button className="button" disabled={busy}>{busy ? "Saving..." : "Save doctor"}</button></div></form></Modal>}
    {remove && <ConfirmDialog title="Delete doctor" message={`Delete ${remove.name}? Doctors linked to existing appointments cannot be deleted.`} onClose={() => setRemove(null)} onConfirm={confirmDelete} loading={busy} />}
  </>;
}
