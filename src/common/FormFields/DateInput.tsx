import React, { useState, useEffect, useCallback, forwardRef } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormField } from './Styles'

interface DateInputProps {
  label: string,
  value: any,
  onChange(date: any, attribute: string): void,
  attribute: string,
  editable: boolean
}

const DateInput = ({ label, value, onChange, attribute, editable }: DateInputProps) => {
  const date = new Date(value !== '' ? value : '2000-1-1')
  const [selectedDate, setSelectedDate] = useState<any>(date)
  const [dateInputValue, setDateInputValue] = useState(value)

  const setRange = (start: number, end: number) => {
    return new Array(end - start + 1).fill(undefined).map((_, k) => k + start)
  }

  const today = new Date()
  const years = setRange(1990, today.getFullYear())

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const handleDateInputChange = useCallback(() => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const newDate = `${year}-${month}-${day}`
    setDateInputValue(newDate)
    onChange(newDate, attribute)
  }, [selectedDate])

  useEffect(() => {
    handleDateInputChange()
  }, [handleDateInputChange])

  const CalendarInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button type="button" className="calendar-shortcut" onClick={onClick} ref={ref}>
      <i className="fas fa-calendar"></i>
    </button>
  ))

  CalendarInput.displayName = 'ExampleCustomInput'

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }: any) => (
    <div
      style={{
        margin: 10,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {'<'}
      </button>
      <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {'>'}
      </button>
    </div>
  )

  const selectToday = () => {
    const today = new Date()
    setSelectedDate(today)
  }

  return (
    <FormField>
      <div className="col-lg-3 col-sm-2">
        <label className="label">
          {label} <span>*</span>
        </label>
      </div>
      <div className="col-lg-9 col-sm-10">
        <div className="row date-input">
          <div className="col-8">
            {editable ? (
              <input readOnly className="field" type="text" value={dateInputValue} />
            ) : (
              <span className="text-field">{dateInputValue}</span>
            )}
          </div>
          {editable && (
            <div className="col-1">
              <button className="calendar-shortcut" type="button" onClick={selectToday}>
                Today
              </button>
            </div>
          )}
          {editable && (
            <div className="col-3 division">
              <span>|</span>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                customInput={<CalendarInput />}
                renderCustomHeader={CustomHeader}
              />
            </div>
          )}
        </div>
      </div>
    </FormField>
  )
}

DateInput.prototypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired
}

export default DateInput
