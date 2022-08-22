import styled from 'styled-components'

interface FormFieldProps {
    alignStart?: boolean
  }

const FormField = styled.div<FormFieldProps>`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: ${(props) => (props.alignStart ? 'flex-start' : 'center')};

  .label {
    font-weight: 700;
    text-transform: capitalize;
  }

  .label span {
    color: crimson;
  }

  .field {
    height: calc(2.25rem + 2px);
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    color: #495057;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ced4da;
    padding: 6px 12px;
  }

  .text-field {
    height: calc(2.25rem + 2px);
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    color: #495057;
    border: none;
    padding: 6px 12px;
  }

  .date-input {
    display: flex;
    align-items: center;
  }

  .calendar-shortcut {
    padding: 8px;
    color: #3c8dbc;
    text-decoration: none;
    border: none;
    background-color: transparent;
    position: relative;
  }

  .calendar-shortcut:hover {
    color: #296282;
    text-decoration: underline;
  }

  .calendar {
    position: absolute;
    z-index: 4;
  }

  .division {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .input-message {
    font-style: italic;
    margin: 0px;
    color: gray;
    font-size: 12px;
  }

  .error-message {
    font-style: italic;
    color: crimson;
    font-size: 12px;
  }

  .selector {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .selector-options {
    width: 48%;
    margin-bottom: 5px;
  }

  .selector-chooser {
    width: 4%;
    margin-bottom: 5px;
    list-style: none;
    margin: auto 1px auto 1px;
    background: #eee;
    border-radius: 10px;
    padding: 5px;
  }

  .selector-chooser li {
    margin: 0px auto;
    color: #ccc;
  }

  .selector-chooser li.active {
    color: #666;
  }

  .selector-chooser li.active:hover {
    color: #296282;
  }

  .selector-chooser button {
    background-color: transparent;
    color: inherit;
    border: none;
    padding: 0;
  }

  .selector-chosen {
    width: 48%;
    margin-bottom: 5px;
  }

  .select-shortcut {
    width: 100%;
    padding: 12px;
    text-align: center;
  }

  .select-shortcut button {
    background: none;
    border: none;
    font-weight: 700;
    font-size: 14px;
    color: #3c8dbc;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  .select-shortcut button:hover {
    color: #296282;
  }

  .select-shortcut button i {
    color: #666666;
    font-size: 12px;
  }

  .options-title {
    color: #666666;
    background: #f8f8f8;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 16px;
    padding: 5px;
    text-align: center;
    margin-bottom: 8px;
  }

  .options-filter {
    color: #666666;
    background: transparent;
    padding: 20px 8px 8px 8px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 6px;
  }

  .options-filter input {
    box-sizing: border-box;
    color: #666666;
    border: 1px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    padding: 4px;
  }

  .options-list {
    width: 100%;
    height: 240px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .chosen-title {
    color: #ffffff;
    background: #3c8dbc;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 16px;
    padding: 5px;
    text-align: center;
    margin-bottom: 8px;
  }

  .chosen-list {
    width: 100%;
    height: 296px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  option {
    font-size: 16px;
    line-height: 20px;
    padding: 2px 4px;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
`

export { FormField }
