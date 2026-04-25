import { useForm } from '../context/FormContext'
import { Field, Input, SectionTitle, SectionSubtitle, Row } from '../components/Field.jsx'
import './Steps.css'

function ContactGroup({ heading, prefix, data, errors, onChange }) {
  return (
    <div className="contact-group">
      <h3 className="sub-heading">{heading}</h3>
      <Row>
        <Field label="First Name" required error={errors[`${prefix}FirstName`]}>
          <Input
            name={`${prefix}FirstName`}
            value={data[`${prefix}FirstName`]}
            onChange={onChange}
            placeholder="First name"
            error={errors[`${prefix}FirstName`]}
          />
        </Field>
        <Field label="Last Name" required error={errors[`${prefix}LastName`]}>
          <Input
            name={`${prefix}LastName`}
            value={data[`${prefix}LastName`]}
            onChange={onChange}
            placeholder="Last name"
            error={errors[`${prefix}LastName`]}
          />
        </Field>
      </Row>
      <Row>
        <Field label="Phone Number" error={errors[`${prefix}Phone`]}>
          <Input
            name={`${prefix}Phone`}
            value={data[`${prefix}Phone`]}
            onChange={onChange}
            placeholder="(555) 000-0000"
            type="tel"
          />
        </Field>
        <Field label="Email Address" required error={errors[`${prefix}Email`]}>
          <Input
            name={`${prefix}Email`}
            value={data[`${prefix}Email`]}
            onChange={onChange}
            placeholder="email@organization.com"
            type="email"
            error={errors[`${prefix}Email`]}
          />
        </Field>
      </Row>
    </div>
  )
}

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

export default function StepLeadershipContacts({ errors, clearError }) {
  const { data, update } = useForm()

  const handle = (e) => {
    update({ [e.target.name]: e.target.value })
    clearError(e.target.name)
  }

  return (
    <div className="step-body">
      <SectionTitle>Leadership Contacts</SectionTitle>
      <SectionSubtitle>Provide contact information for key leadership roles. These contacts will be used throughout the accreditation process.</SectionSubtitle>

      <ContactGroup heading="Chief Executive Officer (CEO)" prefix="ceo" data={data} errors={errors} onChange={handle} />
      <ContactGroup heading="Director of Quality" prefix="director" data={data} errors={errors} onChange={handle} />
      <ContactGroup heading="Invoicing Contact" prefix="invoicing" data={data} errors={errors} onChange={handle} />

      <div className="contact-group">
        <h3 className="sub-heading">Billing Address</h3>
        <div className="fields-stack">
          <Field label="Street Address" required error={errors.billingAddress}>
            <Input name="billingAddress" value={data.billingAddress} onChange={handle} placeholder="123 Main St" error={errors.billingAddress} />
          </Field>
          <Row cols={3}>
            <Field label="City" required error={errors.billingCity}>
              <Input name="billingCity" value={data.billingCity} onChange={handle} placeholder="City" error={errors.billingCity} />
            </Field>
            <Field label="State" required error={errors.billingState}>
              <select
                name="billingState"
                value={data.billingState}
                onChange={handle}
                className={`input ${errors.billingState ? 'input-err' : ''}`}
              >
                <option value="">State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="ZIP Code" required error={errors.billingZip}>
              <Input name="billingZip" value={data.billingZip} onChange={handle} placeholder="00000" maxLength={5} error={errors.billingZip} />
            </Field>
          </Row>
        </div>
      </div>
    </div>
  )
}
