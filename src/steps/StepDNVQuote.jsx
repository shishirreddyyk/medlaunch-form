import { useState } from 'react'
import { useForm } from '../context/FormContext'
import { Field, Input, SectionTitle, SectionSubtitle, Row } from '../components/Field.jsx'
import './Steps.css'

export default function StepDNVQuote({ errors, clearError }) {
  const { data, update } = useForm()
  const [verifyState, setVerifyState] = useState('idle') // idle | sending | sent

  const handle = (e) => {
    update({ [e.target.name]: e.target.value })
    clearError(e.target.name)
  }

  const sendVerification = () => {
    if (!data.email) return
    setVerifyState('sending')
    setTimeout(() => setVerifyState('sent'), 1200)
  }

  return (
    <div className="step-body">
      <SectionTitle>DNV Quote Request</SectionTitle>
      <SectionSubtitle>Please provide your organization's details to get started with your accreditation quote.</SectionSubtitle>

      <div className="step-section">
        <h3 className="sub-heading">Identify Healthcare Organization</h3>
        <div className="fields-stack">
          <Field label="Legal Entity Name" required error={errors.legalEntityName}>
            <Input
              name="legalEntityName"
              value={data.legalEntityName}
              onChange={handle}
              placeholder="Enter legal entity name"
              error={errors.legalEntityName}
            />
          </Field>
          <Field label="Doing Business As" error={errors.doingBusinessAs}>
            <Input
              name="doingBusinessAs"
              value={data.doingBusinessAs}
              onChange={handle}
              placeholder="DBA name (if different)"
              error={errors.doingBusinessAs}
            />
          </Field>
        </div>
      </div>

      <div className="step-section">
        <h3 className="sub-heading">Primary Contact</h3>
        <div className="fields-stack">
          <Row>
            <Field label="First Name" required error={errors.firstName}>
              <Input name="firstName" value={data.firstName} onChange={handle} placeholder="First name" error={errors.firstName} />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <Input name="lastName" value={data.lastName} onChange={handle} placeholder="Last name" error={errors.lastName} />
            </Field>
          </Row>
          <Field label="Title / Position" required error={errors.title}>
            <Input name="title" value={data.title} onChange={handle} placeholder="e.g. Director of Quality" error={errors.title} />
          </Field>
          <Row>
            <Field label="Work Phone" required error={errors.workPhone}>
              <Input name="workPhone" value={data.workPhone} onChange={handle} placeholder="(555) 000-0000" type="tel" error={errors.workPhone} />
            </Field>
            <Field label="Cell Phone" error={errors.cellPhone}>
              <Input name="cellPhone" value={data.cellPhone} onChange={handle} placeholder="(555) 000-0000" type="tel" />
            </Field>
          </Row>
          <Field label="Email Address" required error={errors.email}>
            <div className="email-row">
              <Input
                name="email"
                value={data.email}
                onChange={handle}
                placeholder="email@organization.com"
                type="email"
                error={errors.email}
              />
              <button
                type="button"
                className={`verify-btn ${verifyState === 'sent' ? 'verified' : ''}`}
                onClick={sendVerification}
                disabled={verifyState === 'sending' || verifyState === 'sent' || !data.email}
              >
                {verifyState === 'idle' && 'Send Verification'}
                {verifyState === 'sending' && (
                  <span className="spinner-small" />
                )}
                {verifyState === 'sent' && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Sent
                  </>
                )}
              </button>
            </div>
            {verifyState === 'sent' && (
              <span className="field-hint" style={{ color: 'var(--green)' }}>
                Verification email sent — please check your inbox.
              </span>
            )}
          </Field>
        </div>
      </div>
    </div>
  )
}
