import { AlertCircle, LoaderCircle, Search } from "lucide-react";

export function PageHeader({ title, subtitle, action }) {
  return <div className="page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
        {children}
      </section>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmText = "Delete", onConfirm, onClose, loading }) {
  return <Modal title={title} onClose={onClose}><div className="confirm-body"><AlertCircle className="danger-icon" /><p>{message}</p></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button danger" disabled={loading} onClick={onConfirm}>{loading ? "Deleting..." : confirmText}</button></div></Modal>;
}

export function Loading({ text = "Loading..." }) {
  return <div className="loading"><LoaderCircle className="spin" />{text}</div>;
}

export function EmptyState({ title, text, action }) {
  return <div className="empty-state"><Search /><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function StatusBadge({ status }) {
  const normalized = String(status).toLowerCase();
  return <span className={`badge ${normalized}`}>{normalized.charAt(0).toUpperCase() + normalized.slice(1)}</span>;
}
