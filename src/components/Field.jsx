import './Field.css'

export function Field({ label, required, error, children, hint }) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-err-msg" role="alert">{error}</span>}
    </div>
  )
}

export function Input({ error, ...props }) {
  return (
    <input
      className={`input ${error ? 'input-err' : ''}`}
      {...props}
    />
  )
}

export function Select({ error, children, ...props }) {
  return (
    <select className={`input ${error ? 'input-err' : ''}`} {...props}>
      {children}
    </select>
  )
}

export function SectionTitle({ children }) {
  return <h2 className="section-title">{children}</h2>
}

export function SectionSubtitle({ children }) {
  return <p className="section-subtitle">{children}</p>
}

export function Row({ children, cols = 2 }) {
  return (
    <div className="row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  )
}
