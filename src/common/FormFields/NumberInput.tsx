import React from 'react'
import PropTypes from 'prop-types'
import { FormField } from './Styles'

interface NumberInputProps {
  label: string,
  value: number,
  onChange(number: number, attribute: string): void,
  attribute: string, 
  editable?: boolean
}

const NumberInput = ({ label, value, onChange, attribute, editable = false}: NumberInputProps) => {
  const onValueChange = (e: any) => {
    const number = e.target.value
    onChange(number, attribute)
  }

  return (
    <FormField>
      <div className="col-lg-3 col-sm-2">
        <label className="label">
          {label} <span>*</span>
        </label>
      </div>
      <div className="col-lg-9 col-sm-10">
        {editable ? (
          <input className="field" type="number" value={value} onChange={onValueChange} />
        ) : (
          <span className="text-field"> {value} </span>
        )}
      </div>
    </FormField>
  )
}

NumberInput.prototypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired
}

export default NumberInput
