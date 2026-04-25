import { useState } from 'react'

// Only letters, spaces, hyphens, apostrophes (covers O'Brien, Mary-Jane)
const NAME_REGEX = /^[a-zA-Z\s'\-]+$/

// Digits + common formatting chars, 7–15 chars
const PHONE_REGEX = /^[\d\s\(\)\-\+]{7,15}$/

// Standard email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ZIP: 5 digits or ZIP+4
const ZIP_REGEX = /^\d{5}(-\d{4})?$/

const isValidName  = (val) => NAME_REGEX.test(val.trim())
const isValidPhone = (val) => PHONE_REGEX.test(val.trim())
const isValidEmail = (val) => EMAIL_REGEX.test(val.trim())
const isValidZip   = (val) => ZIP_REGEX.test(val.trim())

export function useValidation() {
  const [errors, setErrors] = useState({})

  const validate = (step, data) => {
    const errs = {}

    if (step === 0) {
      if (!data.legalEntityName.trim()) errs.legalEntityName = 'Required'

      if (!data.firstName.trim())          errs.firstName = 'Required'
      else if (!isValidName(data.firstName)) errs.firstName = 'Name must contain letters only'

      if (!data.lastName.trim())           errs.lastName = 'Required'
      else if (!isValidName(data.lastName))  errs.lastName = 'Name must contain letters only'

      if (!data.title.trim())              errs.title = 'Required'
      else if (!isValidName(data.title))     errs.title = 'Title must contain letters only'

      if (!data.workPhone.trim())            errs.workPhone = 'Required'
      else if (!isValidPhone(data.workPhone)) errs.workPhone = 'Enter a valid phone number'

      if (data.cellPhone.trim() && !isValidPhone(data.cellPhone))
        errs.cellPhone = 'Enter a valid phone number'

      if (!data.email.trim())              errs.email = 'Required'
      else if (!isValidEmail(data.email))    errs.email = 'Enter a valid email address'
    }

    if (step === 1) {
      if (!data.facilityType) errs.facilityType = 'Please select a facility type'
    }

    if (step === 2) {
      if (!data.ceoFirstName.trim())             errs.ceoFirstName = 'Required'
      else if (!isValidName(data.ceoFirstName))    errs.ceoFirstName = 'Name must contain letters only'

      if (!data.ceoLastName.trim())              errs.ceoLastName = 'Required'
      else if (!isValidName(data.ceoLastName))     errs.ceoLastName = 'Name must contain letters only'

      if (data.ceoPhone.trim() && !isValidPhone(data.ceoPhone))
        errs.ceoPhone = 'Enter a valid phone number'

      if (!data.ceoEmail.trim())                 errs.ceoEmail = 'Required'
      else if (!isValidEmail(data.ceoEmail))       errs.ceoEmail = 'Enter a valid email address'

      // Director — optional, validate only if filled
      if (data.directorFirstName.trim() && !isValidName(data.directorFirstName))
        errs.directorFirstName = 'Name must contain letters only'
      if (data.directorLastName.trim() && !isValidName(data.directorLastName))
        errs.directorLastName = 'Name must contain letters only'
      if (data.directorPhone.trim() && !isValidPhone(data.directorPhone))
        errs.directorPhone = 'Enter a valid phone number'
      if (data.directorEmail.trim() && !isValidEmail(data.directorEmail))
        errs.directorEmail = 'Enter a valid email address'

      // Invoicing — optional, validate only if filled
      if (data.invoicingFirstName.trim() && !isValidName(data.invoicingFirstName))
        errs.invoicingFirstName = 'Name must contain letters only'
      if (data.invoicingLastName.trim() && !isValidName(data.invoicingLastName))
        errs.invoicingLastName = 'Name must contain letters only'
      if (data.invoicingPhone.trim() && !isValidPhone(data.invoicingPhone))
        errs.invoicingPhone = 'Enter a valid phone number'
      if (data.invoicingEmail.trim() && !isValidEmail(data.invoicingEmail))
        errs.invoicingEmail = 'Enter a valid email address'

      // Billing address
      if (!data.billingAddress.trim()) errs.billingAddress = 'Required'

      if (!data.billingCity.trim())            errs.billingCity = 'Required'
      else if (!isValidName(data.billingCity))   errs.billingCity = 'City must contain letters only'

      if (!data.billingState.trim()) errs.billingState = 'Required'

      if (!data.billingZip.trim())           errs.billingZip = 'Required'
      else if (!isValidZip(data.billingZip))   errs.billingZip = 'Enter a valid ZIP code (e.g. 12345)'
    }

    if (step === 3) {
      if (!data.siteType) errs.siteType = 'Please select a location type'
      if (data.siteType === 'multiple' && !data.uploadedFileName)
        errs.uploadedFile = 'Please upload a file'
    }

    if (step === 4) {
      if (data.services.length === 0) errs.services = 'Please select at least one service'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const clearError = (field) => {
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  return { errors, validate, clearError, setErrors }
}