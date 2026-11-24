import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, CalendarClock, Clock3, Stethoscope } from "lucide-react";
import { api } from "../services/api";
import { Loading, StatusBadge, EmptyState } from "../components/common";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function load() {
    setLoading(true); setError("");
    try { setData(await api.dashboard()); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <div className="error-state"><p>{error}</p><button className="button" onClick={load}>Retry</button></div>;
  const cards = [
    ["Total Doctors", data.totalDoctors, Stethoscope, "blue"],
    ["Upcoming Appointments", data.upcomingAppointments, CalendarClock, "teal"],
    ["Today's Appointments", data.todayAppointments, CalendarCheck, "purple"],
    ["Pending Appointments", data.pendingAppointments, Clock3, "orange"],
  ];
  return <>
    <div className="page-header"><div><h1>Dashboard</h1><p>Overview of today's clinic activity</p></div><button className="button" onClick={() => navigate("/appointments")}>Manage appointments</button></div>
    <section className="metric-grid">{cards.map(([label, value, Icon, color]) => <article className="metric-card" key={label}><div className={`metric-icon ${color}`}><Icon /></div><div><span>{label}</span><strong>{value}</strong></div></article>)}</section>
    <section className="panel"><div className="panel-header"><div><h2>Upcoming appointments</h2><p>Next scheduled visits</p></div></div>
      {data.appointments?.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>{data.appointments.map(a => <tr key={a.id}><td><strong>{a.patientName}</strong><small>{a.reason}</small></td><td>{a.doctor.name}</td><td>{new Date(a.appointmentDate).toLocaleDateString()}</td><td>{new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</td><td><StatusBadge status={a.status} /></td></tr>)}</tbody></table></div> : <EmptyState title="No upcoming appointments" text="New appointments will appear here." />}
    </section>
  </>;
}
