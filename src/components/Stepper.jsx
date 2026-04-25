import './Stepper.css'

const STEPS = [
  'DNV Quote Request',
  'Facility Details',
  'Leadership Contacts',
  'Site Information',
  'Services & Certifications',
  'Review & Submit',
]

export default function Stepper({ current }) {
  return (
    <nav className="stepper" aria-label="Form progress">
      <div className="stepper-inner">
        {STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <div
              key={i}
              className={`stepper-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}
              aria-current={active ? 'step' : undefined}
            >
              <div className="stepper-bubble">
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="stepper-label">{label}</span>
              {i < STEPS.length - 1 && <div className="stepper-line" />}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
