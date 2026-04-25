import { createContext, useContext, useState } from 'react'

const FormContext = createContext(null)

export const useForm = () => useContext(FormContext)

const initialData = {
  // Step 1 – DNV Quote Request
  legalEntityName: '',
  doingBusinessAs: '',
  firstName: '',
  lastName: '',
  title: '',
  workPhone: '',
  cellPhone: '',
  email: '',
  emailVerified: false,

  // Step 2 – Facility Details
  facilityType: '',

  // Step 3 – Leadership Contacts
  ceoFirstName: '',
  ceoLastName: '',
  ceoPhone: '',
  ceoEmail: '',
  directorFirstName: '',
  directorLastName: '',
  directorPhone: '',
  directorEmail: '',
  invoicingFirstName: '',
  invoicingLastName: '',
  invoicingPhone: '',
  invoicingEmail: '',
  billingAddress: '',
  billingCity: '',
  billingState: '',
  billingZip: '',

  // Step 4 – Site Information
  siteType: '',
  uploadedFile: null,
  uploadedFileName: '',

  // Step 5 – Services & Certifications
  services: [],
  certifications: [],
  otherService: '',
  certStartDate: '',
  certEndDate: '',
}

export function FormProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [step, setStep] = useState(0)

  const update = (fields) => setData(prev => ({ ...prev, ...fields }))

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => setStep(s => Math.max(s - 1, 0))
  const goTo = (i) => setStep(i)

  return (
    <FormContext.Provider value={{ data, update, step, next, back, goTo }}>
      {children}
    </FormContext.Provider>
  )
}
