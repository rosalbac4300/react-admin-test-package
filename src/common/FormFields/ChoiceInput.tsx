import React from 'react'
import PropTypes from 'prop-types'
import { FormField } from './Styles'
import { validateInput } from '../../helpers/validateForm'

interface ChoiceInputProps {
  error: boolean,
  label: string,
  value: any,
  onChange(choice: any, attribute: string): void,
  choices: any[],
  attribute: string,
  editable: boolean
}

const ChoiceInput = ({ error, label, value, onChange, choices, attribute, editable }: ChoiceInputProps) => {
  const onChoiceSelect = (e: any) => {
    const choice = e.target.value
    onChange(choice, attribute)
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
          <select className="field" value={value} onChange={onChoiceSelect}>
            <option value=""> -------------- </option>
            {choices.map((choice) => {
              return (
                <option value={choice.value} key={choice.value}>
                  {choice.display_name}
                </option>
              )
            })}
          </select>
        ) : (
          <span className="text-field">
            {choices.map((item) => {
              if (item.value === value) {
                return item.display_name
              }
            })}
          </span>
        )}
      </div>
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

ChoiceInput.prototypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
  attribute: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired
}

export default ChoiceInput
