export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-modal admin-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-modal-header">
          <div>
            <p className="admin-modal-kicker">{danger ? "Permanent action" : "Please confirm"}</p>
            <h2>{title}</h2>
          </div>
        </header>
        <div className="admin-modal-body">
          <p className="help-text">{message}</p>
        </div>
        <footer className="admin-modal-footer">
          <button type="button" className="admin-ghost-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? "admin-ghost-btn admin-confirm-danger-btn" : "admin-primary-btn"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
