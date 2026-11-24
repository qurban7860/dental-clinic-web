import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">+</div><div><strong>Clarity</strong><span>Dental Clinic</span></div></div>
        <button className="close-menu" aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button>
        <nav aria-label="Primary navigation">
          <NavLink to="/dashboard" onClick={() => setOpen(false)}><LayoutDashboard />Dashboard</NavLink>
          <NavLink to="/doctors" onClick={() => setOpen(false)}><Stethoscope />Doctors</NavLink>
          <NavLink to="/appointments" onClick={() => setOpen(false)}><CalendarDays />Appointments</NavLink>
        </nav>
        <div className="sidebar-footer"><div className="avatar">DC</div><div><strong>Clinic Admin</strong><span>Administrator</span></div></div>
      </aside>
      {open && <button className="backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <main className="main">
        <header className="topbar"><button className="menu-button" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu /></button><div className="topbar-title">Administration</div></header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<div className="state-card"><h1>Page not found</h1><p>The requested page does not exist.</p></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
