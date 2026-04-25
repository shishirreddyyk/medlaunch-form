import { useState, useRef, useEffect } from 'react'
import { FormProvider, useForm } from './context/FormContext'
import Header from './components/Header.jsx'
import Stepper from './components/Stepper.jsx'
import StepDNVQuote from './steps/StepDNVQuote.jsx'
import StepFacilityDetails from './steps/StepFacilityDetails.jsx'
import StepLeadershipContacts from './steps/StepLeadershipContacts.jsx'
import StepSiteInformation from './steps/StepSiteInformation.jsx'
import StepServicesCertifications from './steps/StepServicesCertifications.jsx'
import StepReviewSubmit from './steps/StepReviewSubmit.jsx'
import { useValidation } from './hooks/useValidation'
import './App.css'

// ── Support Chat Widget ──────────────────────────────────────────
const CANNED = [
  "How long does the accreditation process take?",
  "What documents do I need to prepare?",
  "Can I save my progress and come back later?",
]

function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Hi! How can we help you with your DNV accreditation request today?' }
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text: msg }])
    // Simulated agent reply after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'agent',
        text: "Thanks for reaching out! A DNV representative will follow up on that shortly. In the meantime, feel free to continue filling out your form."
      }])
    }, 1100)
  }

  return (
    <>
      {open && (
        <div className="chat-window" role="dialog" aria-label="Support Chat">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar-agent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p className="chat-agent-name">DNV Support</p>
                <p className="chat-agent-status">
                  <span className="status-dot" /> Online
                </p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="chat-canned">
              {CANNED.map(q => (
                <button key={q} className="canned-btn" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message…"
            />
            <button className="chat-send" onClick={() => send()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className={`chat-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Support chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        <span>{open ? 'Close' : 'Support Chat'}</span>
      </button>
    </>
  )
}

// ── Main Form Shell ──────────────────────────────────────────────
function FormShell() {
  const { step, next, back, data } = useForm()
  const { errors, validate, clearError } = useValidation()
  const [submitted, setSubmitted] = useState(false)

  const handleNext = () => {
    const valid = validate(step, data)
    if (valid) next()
  }

  const handleSubmit = () => {
    console.log('Form submitted:', data)
    setSubmitted(true)
  }

  const handleExit = () => {
    if (window.confirm('Exit and lose your progress?')) {
      window.location.reload()
    }
  }

  // Derive display name from step 1 fields
  const userName = [data.firstName, data.lastName].filter(Boolean).join(' ')

  const isLastStep = step === 5

  const steps = [
    <StepDNVQuote errors={errors} clearError={clearError} />,
    <StepFacilityDetails errors={errors} clearError={clearError} />,
    <StepLeadershipContacts errors={errors} clearError={clearError} />,
    <StepSiteInformation errors={errors} clearError={clearError} />,
    <StepServicesCertifications errors={errors} clearError={clearError} />,
    <StepReviewSubmit submitted={submitted} />,
  ]

  return (
    <div className="shell">
      <Header userName={userName} />
      {!submitted && <Stepper current={step} />}

      <main className="main">
        <div className="form-card">
          <div className="step-content" key={step}>
            {steps[step]}
          </div>

          {!submitted && (
            <div className="form-footer">
              {/* Left side: Exit (always shown) */}
              <button type="button" className="btn-exit" onClick={handleExit}>
                Exit
              </button>

              {/* Right side: Previous + action button */}
              <div className="footer-right">
                {step > 0 && (
                  <button type="button" className="btn-back" onClick={back}>
                    ← Previous
                  </button>
                )}

                {isLastStep ? (
                  /* On review step: Submit button */
                  <button type="button" className="btn-primary btn-submit-final" onClick={handleSubmit}>
                    Submit Quote Request
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                ) : (
                  /* Steps 1–5: Save & Continue */
                  <button type="button" className="btn-primary" onClick={handleNext}>
                    Save &amp; Continue
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {!submitted && <SupportChat />}
    </div>
  )
}

export default function App() {
  return (
    <FormProvider>
      <FormShell />
    </FormProvider>
  )
}
