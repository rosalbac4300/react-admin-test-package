import React from 'react'
import PropTypes from 'prop-types'
import { FormField } from './Styles'
import { validateInput } from '../../helpers/validateForm'

interface TextInputProps {
  error?: boolean,
  label: string, 
  value: string,
  onChange(text: string, attribute: string): void,
  attribute: string, 
  message?: string | null,
  editable?: boolean
}

const TextInput = ({ error, label, value, onChange, attribute, message = null, editable = false }: TextInputProps) => {
  const onTextChange = (e: any) => {
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
          <input className="field" type="text" value={value} onChange={onTextChange} />
        ) : (
          <span className="text-field">{value}</span>
        )}
      </div>
      {message && (
        <div className="col-12">
          <p className="input-message">{message}</p>
        </div>
      )}
      {error && !validateInput(value) && (
        <div className="col-12">
          <ul className="error-message">
            <li> This field is required </li>
          </ul>
        </div>
      )}
    </FormField>
  )
}

TextInput.prototypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.string.isRequired,
  message: PropTypes.string,
  editable: PropTypes.bool.isRequired
}

export default TextInput
