function StatusMessage({ actionLabel, message, onAction, title, variant = 'info' }) {
  return (
    <div className={`status-message status-message--${variant}`} role="status">
      <div>
        <strong>{title}</strong>
      </div>
      {message ? <p>{message}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default StatusMessage
