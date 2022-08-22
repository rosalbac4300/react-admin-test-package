import React from 'react'
import PropTypes from 'prop-types'
import { FormField } from './Styles'
import { validateEmailInput } from '../../helpers/validateForm'

interface EmailInputProps {
  error: boolean, 
  label: string, 
  value: string, 
  onChange(text: string, attribute: string): void, 
  attribute: string, 
  editable: boolean 
}

const EmailInput = ({ error, label, value, onChange, attribute, editable }: EmailInputProps) => {
  const onEmailChange = (e: any) => {
    const text = e.target.value
    onChange(text, attribute)
  }

  return (
    <FormField>
      <div className="col-lg-3 col-sm-2">
        <label className="label">
          {label} <span> * </span>
        </label>
      </div>
      <div className="col-lg-9 col-sm-10">
        {editable ? (
          <input className="field" type="text" value={value} onChange={onEmailChange} />
        ) : (
          <span className="text-field">{value}</span>
        )}
      </div>
      {error && !validateEmailInput(value) && (
        <div className="col-12">
          <ul className="error-message">
            <li> This field is required </li>
          </ul>
        </div>
      )}
    </FormField>
  )
}

EmailInput.prototypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired
}

export default EmailInput
