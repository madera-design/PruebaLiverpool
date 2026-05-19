function Modal({ children, onClose, title }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default Modal
