import { useForm } from '../context/FormContext'
import { SectionTitle, SectionSubtitle } from '../components/Field.jsx'
import './Steps.css'

const FACILITY_TYPES = [
  { value: 'short-term-acute', label: 'Short-Term Acute Care Hospital' },
  { value: 'long-term-acute', label: 'Long-Term Acute Care Hospital' },
  { value: 'critical-access', label: 'Critical Access Hospital' },
  { value: 'childrens', label: "Children's Hospital" },
  { value: 'psychiatric', label: 'Free-Standing Psychiatric Hospital' },
  { value: 'other', label: 'Other' },
]

export default function StepFacilityDetails({ errors, clearError }) {
  const { data, update } = useForm()

  const select = (value) => {
    update({ facilityType: value })
    clearError('facilityType')
  }

  return (
    <div className="step-body">
      <SectionTitle>Facility Details</SectionTitle>
      <SectionSubtitle>Select the type of healthcare facility seeking accreditation.</SectionSubtitle>

      {errors.facilityType && (
        <div className="form-error-banner" role="alert">{errors.facilityType}</div>
      )}

      <div className="radio-group">
        {FACILITY_TYPES.map(({ value, label }) => (
          <label
            key={value}
            className={`radio-card ${data.facilityType === value ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="facilityType"
              value={value}
              checked={data.facilityType === value}
              onChange={() => select(value)}
              className="sr-only"
            />
            <div className="radio-circle">
              {data.facilityType === value && <div className="radio-dot" />}
            </div>
            <span className="radio-label">{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
