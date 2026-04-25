import { useState } from 'react'
import { useForm } from '../context/FormContext'
import { SectionTitle, SectionSubtitle } from '../components/Field.jsx'
import './Steps.css'

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

function AccordionSection({ title, stepIndex, goTo, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="acc-section">
      <div className="acc-header">
        <button
          type="button"
          className="acc-toggle"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <ChevronIcon open={open} />
          <span>{title}</span>
        </button>
        <button
          type="button"
          className="acc-edit-btn"
          onClick={() => goTo(stepIndex)}
        >
          <EditIcon />
          Edit
        </button>
      </div>
      {open && (
        <div className="acc-body">{children}</div>
      )}
    </div>
  )
}

function InfoRow({ label, value, children }) {
  if (!value && !children) return null
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      {children ? <div className="info-value">{children}</div> : <span className="info-value">{value}</span>}
    </div>
  )
}

function ContactCard({ name, title, phone, cell, email, badge }) {
  if (!name) return null
  return (
    <div className="contact-card-review">
      <div className="ccr-name-row">
        <strong>{name}</strong>
        {badge && <span className="ccr-badge">{badge}</span>}
      </div>
      {title && <div className="ccr-line">{title}</div>}
      {(phone || cell) && (
        <div className="ccr-line">
          {phone && <>Work: {phone}</>}
          {phone && cell && ' | '}
          {cell && <>Cell: {cell}</>}
        </div>
      )}
      {email && <div className="ccr-line">Email: {email}</div>}
    </div>
  )
}

function LeaderContactCard({ role, name, jobTitle, phone, email, billingAddress }) {
  if (!name) return null
  return (
    <div className="ldr-contact-row">
      <span className="ldr-role">{role}</span>
      <div className="ldr-card">
        <strong>{name}</strong>
        {jobTitle && <div className="ccr-line">{jobTitle}</div>}
        {phone && <div className="ccr-line">Phone: {phone}</div>}
        {email && <div className="ccr-line">Email: {email}</div>}
        {billingAddress && <div className="ccr-line">Billing Address: {billingAddress}</div>}
      </div>
    </div>
  )
}

const FACILITY_LABELS = {
  'short-term-acute': 'Short-Term Acute Care (with Swing Beds)',
  'long-term-acute': 'Long-Term Acute Care Hospital',
  'critical-access': 'Critical Access Hospital',
  'childrens': "Children's Hospital",
  'psychiatric': 'Free-Standing Psychiatric Hospital',
  'other': 'Other',
}

export default function StepReviewSubmit({ submitted }) {
  const { data, goTo } = useForm()
  const [certify, setCertify] = useState(false)

  if (submitted) {
    return (
      <div className="step-body">
        <div className="success-screen">
          <div className="success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Request Submitted!</h2>
          <p>
            Thank you{data.firstName ? `, ${data.firstName}` : ''}. Your DNV Healthcare accreditation quote request
            has been received. A representative will be in touch within 2–3 business days.
          </p>
          <div className="success-ref">
            Reference: <strong>DNV-{Date.now().toString().slice(-8)}</strong>
          </div>
        </div>
      </div>
    )
  }

  const primaryContactName = [data.firstName, data.lastName].filter(Boolean).join(' ')
  const billingFull = [data.billingAddress, data.billingCity, data.billingState, data.billingZip].filter(Boolean).join(', ')
  const invoicingName = [data.invoicingFirstName, data.invoicingLastName].filter(Boolean).join(' ')

  return (
    <div className="step-body">
      <SectionTitle>Review &amp; Submit</SectionTitle>
      <SectionSubtitle>
        Please review your information before submitting. Click <strong>Edit</strong> on any section to make changes.
      </SectionSubtitle>

      <div className="review-group-label">Hospital Information</div>

      <AccordionSection title="Basic Information" stepIndex={0} goTo={goTo}>
        <InfoRow label="Legal Entity Name" value={data.legalEntityName} />
        <InfoRow label="d/b/a Name" value={data.doingBusinessAs} />
        {primaryContactName && (
          <InfoRow label="Primary Contact">
            <ContactCard
              name={primaryContactName}
              title={data.title}
              phone={data.workPhone}
              cell={data.cellPhone}
              email={data.email}
              badge={data.emailVerified ? 'Verified' : null}
            />
          </InfoRow>
        )}
      </AccordionSection>

      <AccordionSection title="Facility Details" stepIndex={1} goTo={goTo}>
        <InfoRow label="Facility Type" value={FACILITY_LABELS[data.facilityType] || data.facilityType} />
      </AccordionSection>

      <AccordionSection title="Leadership Contacts" stepIndex={2} goTo={goTo}>
        <LeaderContactCard
          role="CEO"
          name={[data.ceoFirstName, data.ceoLastName].filter(Boolean).join(' ')}
          phone={data.ceoPhone}
          email={data.ceoEmail}
        />
        <LeaderContactCard
          role="Director of Quality"
          name={[data.directorFirstName, data.directorLastName].filter(Boolean).join(' ')}
          phone={data.directorPhone}
          email={data.directorEmail}
        />
        <LeaderContactCard
          role="Invoicing Contact"
          name={invoicingName}
          jobTitle={data.invoicingTitle}
          phone={data.invoicingPhone}
          email={data.invoicingEmail}
          billingAddress={billingFull}
        />
      </AccordionSection>

      <AccordionSection title="Site Information" stepIndex={3} goTo={goTo}>
        <InfoRow
          label="Site Configuration"
          value={data.siteType === 'single' ? 'Single Location' : data.siteType === 'multiple' ? 'Multiple Locations' : ''}
        />
        {data.uploadedFileName && <InfoRow label="Input Method" value="File Upload" />}
        {data.uploadedFileName && <InfoRow label="Uploaded File" value={data.uploadedFileName} />}
      </AccordionSection>

      <AccordionSection title="Services & Certifications" stepIndex={4} goTo={goTo}>
        {(data.services || []).length > 0 ? (
          <InfoRow label="Services Provided">
            <div className="review-tags">
              {data.services.map(s => <span key={s} className="review-tag">{s}</span>)}
            </div>
          </InfoRow>
        ) : (
          <span className="review-empty">No services selected</span>
        )}
        {(data.standardsToApply || []).length > 0 && (
          <InfoRow label="Standards to Apply">
            <div className="review-tags">
              {data.standardsToApply.map(s => <span key={s} className="review-tag">{s}</span>)}
            </div>
          </InfoRow>
        )}
        <InfoRow label="Date of Application" value={data.certStartDate} />
        <InfoRow label="Expiration Date" value={data.certEndDate} />
      </AccordionSection>

      {/* Ready to Submit box */}
      <div className="ready-box">
        <div className="ready-title">Ready to Submit?</div>
        <label className="certify-check">
          <input
            type="checkbox"
            checked={certify}
            onChange={e => setCertify(e.target.checked)}
          />
          <span>I certify that all information provided is accurate and complete to the best of my knowledge</span>
        </label>
        <p className="ready-notice">
          By submitting this form, you agree to our terms and conditions. DNV will review your application and contact
          you within 2–3 business days.
        </p>
        <div className="ready-actions">
          <button type="button" className="btn-download">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download as PDF
          </button>
          <button type="button" className="btn-export">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  )
}
