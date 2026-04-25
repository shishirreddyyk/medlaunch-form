import { useRef } from 'react'
import { useForm } from '../context/FormContext'
import { SectionTitle, SectionSubtitle } from '../components/Field.jsx'
import './Steps.css'

export default function StepSiteInformation({ errors, clearError }) {
  const { data, update } = useForm()
  const fileRef = useRef()

  const select = (value) => {
    update({ siteType: value })
    clearError('siteType')
    if (value !== 'multiple') {
      update({ uploadedFile: null, uploadedFileName: '' })
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    update({ uploadedFile: file, uploadedFileName: file.name })
    clearError('uploadedFile')
  }

  return (
    <div className="step-body">
      <SectionTitle>Site Information</SectionTitle>
      <SectionSubtitle>Tell us about the scope of facilities included in this accreditation request.</SectionSubtitle>

      {errors.siteType && (
        <div className="form-error-banner" role="alert">{errors.siteType}</div>
      )}

      <div className="site-cards">
        <button
          type="button"
          className={`site-card ${data.siteType === 'single' ? 'selected' : ''}`}
          onClick={() => select('single')}
        >
          <div className="site-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="site-card-text">
            <strong>Single Location</strong>
            <span>All services provided at one physical address</span>
          </div>
          {data.siteType === 'single' && (
            <div className="site-card-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </button>

        <button
          type="button"
          className={`site-card ${data.siteType === 'multiple' ? 'selected' : ''}`}
          onClick={() => select('multiple')}
        >
          <div className="site-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="6" height="6"/>
              <rect x="9" y="3" width="6" height="6"/>
              <rect x="16" y="3" width="6" height="6"/>
              <rect x="2" y="12" width="6" height="6"/>
              <rect x="9" y="12" width="6" height="6"/>
              <rect x="16" y="12" width="6" height="6"/>
            </svg>
          </div>
          <div className="site-card-text">
            <strong>Multiple Locations</strong>
            <span>Services provided across multiple sites or campuses</span>
          </div>
          {data.siteType === 'multiple' && (
            <div className="site-card-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </button>
      </div>

      {data.siteType === 'multiple' && (
        <div className="upload-section">
          <h3 className="sub-heading">Upload Location List</h3>
          <p className="upload-hint">Please upload a CSV or Excel file listing all locations. Include name, address, and services for each site.</p>
          <div
            className={`upload-zone ${data.uploadedFileName ? 'has-file' : ''} ${errors.uploadedFile ? 'upload-error' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) {
                update({ uploadedFile: file, uploadedFileName: file.name })
                clearError('uploadedFile')
              }
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFile}
              className="sr-only"
            />
            {data.uploadedFileName ? (
              <div className="upload-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <div>
                  <strong>{data.uploadedFileName}</strong>
                  <span>Click to replace</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                <p><strong>Drop your file here</strong> or click to browse</p>
                <span>Accepts .csv, .xlsx, .xls</span>
              </div>
            )}
          </div>
          {errors.uploadedFile && (
            <span className="field-err-msg" role="alert">{errors.uploadedFile}</span>
          )}
        </div>
      )}
    </div>
  )
}
