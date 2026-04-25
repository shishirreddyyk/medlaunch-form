import { useState } from 'react'
import { useForm } from '../context/FormContext'
import { Field, Input, SectionTitle, SectionSubtitle, Row } from '../components/Field.jsx'
import './Steps.css'

const SERVICE_GROUPS = [
  {
    group: 'Emergency & Critical Care',
    items: ['Emergency Department', 'Intensive Care Unit (ICU)', 'Trauma Services', 'Cardiac Catheterization'],
  },
  {
    group: 'Cardiac Services',
    items: ['Cardiovascular Surgery', 'Heart Failure Program', 'Electrophysiology', 'Cardiac Imaging'],
  },
  {
    group: 'Diagnostic Services',
    items: ['Radiology / Imaging', 'Laboratory Services', 'Pathology', 'Nuclear Medicine'],
  },
  {
    group: 'Rehabilitation',
    items: ['Physical Therapy', 'Occupational Therapy', 'Speech-Language Pathology', 'Cardiac Rehabilitation'],
  },
]

export default function StepServicesCertifications({ errors, clearError }) {
  const { data, update } = useForm()
  const [otherInput, setOtherInput] = useState('')
  const [customServices, setCustomServices] = useState([])

  const toggle = (item) => {
    const current = data.services || []
    const next = current.includes(item)
      ? current.filter(s => s !== item)
      : [...current, item]
    update({ services: next })
    if (next.length > 0) clearError('services')
  }

  const addCustom = () => {
    const val = otherInput.trim()
    if (!val) return
    setCustomServices(prev => [...prev, val])
    const current = data.services || []
    update({ services: [...current, val] })
    setOtherInput('')
    clearError('services')
  }

  const removeCustom = (svc) => {
    setCustomServices(prev => prev.filter(s => s !== svc))
    update({ services: (data.services || []).filter(s => s !== svc) })
  }

  return (
    <div className="step-body">
      <SectionTitle>Services & Certifications</SectionTitle>
      <SectionSubtitle>Select all services and programs you would like included in your accreditation scope.</SectionSubtitle>

      {errors.services && (
        <div className="form-error-banner" role="alert">{errors.services}</div>
      )}

      <div className="service-groups">
        {SERVICE_GROUPS.map(({ group, items }) => (
          <div key={group} className="service-group">
            <h3 className="sub-heading">{group}</h3>
            <div className="checkbox-grid">
              {items.map(item => (
                <label key={item} className={`checkbox-card ${(data.services || []).includes(item) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={(data.services || []).includes(item)}
                    onChange={() => toggle(item)}
                    className="sr-only"
                  />
                  <div className="checkbox-box">
                    {(data.services || []).includes(item) && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {customServices.length > 0 && (
        <div className="custom-tags">
          <h4 className="sub-heading" style={{ fontSize: '13px' }}>Added Services</h4>
          <div className="tag-list">
            {customServices.map(svc => (
              <span key={svc} className="tag">
                {svc}
                <button type="button" onClick={() => removeCustom(svc)} aria-label={`Remove ${svc}`}>×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="add-other">
        <h3 className="sub-heading">Add Other Service</h3>
        <div className="add-other-row">
          <Input
            value={otherInput}
            onChange={e => setOtherInput(e.target.value)}
            placeholder="Enter service name"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          />
          <button type="button" className="btn-add" onClick={addCustom}>+ Add</button>
        </div>
      </div>

      <div className="cert-dates">
        <h3 className="sub-heading">Certification Period</h3>
        <Row>
          <Field label="Desired Start Date" error={errors.certStartDate}>
            <Input
              name="certStartDate"
              type="date"
              value={data.certStartDate}
              onChange={e => update({ certStartDate: e.target.value })}
            />
          </Field>
          <Field label="Expected Completion Date" error={errors.certEndDate}>
            <Input
              name="certEndDate"
              type="date"
              value={data.certEndDate}
              onChange={e => update({ certEndDate: e.target.value })}
            />
          </Field>
        </Row>
      </div>
    </div>
  )
}
